# ET-QUA-003: Motor de Tickets

**ID:** ET-QUA-003 | **Módulo:** MAI-009

## Schema

```sql
CREATE TYPE quality.ticket_priority AS ENUM ('urgent', 'high', 'medium', 'low');
CREATE TYPE quality.ticket_status AS ENUM ('created', 'assigned', 'in_progress', 'resolved', 'closed');

CREATE TABLE quality.post_sale_tickets (
  id UUID PRIMARY KEY,
  numero VARCHAR(50) UNIQUE,
  housing_id UUID,
  derechohabiente_id UUID,
  category VARCHAR(50),
  priority quality.ticket_priority,
  description TEXT,
  photos TEXT[],
  status quality.ticket_status DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sla_deadline TIMESTAMPTZ,
  assigned_to UUID,
  assigned_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  resolution_photos TEXT[],
  satisfaction_rating INT, -- 1-5
  closed_at TIMESTAMPTZ
);
```

## Backend Service

```typescript
@Injectable()
export class TicketService {
  async create(dto: CreateTicketDto): Promise<PostSaleTicket> {
    const priority = this.determinePriority(dto.category);
    const slaDeadline = this.calculateSLADeadline(priority);
    const numero = await this.getNextTicketNumber();
    
    const ticket = this.ticketsRepo.create({ ...dto, numero, priority, slaDeadline });
    await this.ticketsRepo.save(ticket);
    
    // Asignación automática
    await this.autoAssignTechnician(ticket);
    
    return ticket;
  }

  private async autoAssignTechnician(ticket: PostSaleTicket): Promise<void> {
    const technicians = await this.getTechniciansBy Specialty(ticket.category);
    const available = technicians.filter(t => t.isAvailable && t.activeTickets < 5);
    
    if (available.length === 0) {
      await this.alertNoTechniciansAvailable(ticket);
      return;
    }
    
    // Asignar al técnico con menor carga
    const selected = available.sort((a, b) => a.activeTickets - b.activeTickets)[0];
    
    await this.ticketsRepo.update(ticket.id, {
      assignedTo: selected.id,
      assignedAt: new Date(),
      status: 'assigned'
    });
    
    await this.notifyTechnician(selected, ticket);
  }

  @Cron('0 */1 * * *')
  async checkSLACompliance(): Promise<void> {
    const atRisk = await this.ticketsRepo.find({
      where: { status: In(['created', 'assigned', 'in_progress']) }
    });
    
    for (const ticket of atRisk) {
      const elapsed = differenceInHours(new Date(), ticket.createdAt);
      const slaHours = this.getSLAHours(ticket.priority);
      const percentElapsed = (elapsed / slaHours) * 100;
      
      if (percentElapsed > 80) {
        await this.escalateTicket(ticket);
      }
    }
  }
}
```

---
**Generado:** 2025-11-20
