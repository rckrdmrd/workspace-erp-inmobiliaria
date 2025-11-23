# ET-HR-003: Implementación de Costeo de Mano de Obra

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-003
**Tipo:** Especificación Técnica
**Prioridad:** Alta
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 🏗️ Arquitectura

```
┌────────────────────────────────────────────────┐
│         Frontend (React)                       │
│  CostDashboard, CrewBudgetAssignment          │
└────────────────────┬───────────────────────────┘
                     │ REST API
┌────────────────────▼───────────────────────────┐
│         Backend (NestJS)                       │
│  LaborCostService - Cálculo automático        │
│  Event: OnAttendanceApproved → calculateCost  │
└────────────────────┬───────────────────────────┘
                     │ TypeORM
┌────────────────────▼───────────────────────────┐
│         PostgreSQL                             │
│  labor_costs (computed column)                 │
│  fsr_configuration                             │
│  crew_budget_assignments                       │
└────────────────────────────────────────────────┘
```

---

## 🔧 Implementación Backend

### 1. LaborCost Entity

**Archivo:** `apps/backend/src/modules/hr/labor-costs/entities/labor-cost.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AttendanceRecord } from '../../attendance/entities/attendance-record.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Project } from '../../../projects/entities/project.entity';
import { BudgetItem } from '../../../budgets/entities/budget-item.entity';

@Entity('labor_costs', { schema: 'hr' })
@Index(['workId', 'workDate'])
@Index(['budgetItemId'])
export class LaborCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  attendanceId: string;

  @ManyToOne(() => AttendanceRecord)
  @JoinColumn({ name: 'attendanceId' })
  attendance: AttendanceRecord;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'uuid' })
  workId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'workId' })
  work: Project;

  @Column({ type: 'uuid', nullable: true })
  budgetItemId: string;

  @ManyToOne(() => BudgetItem, { nullable: true })
  @JoinColumn({ name: 'budgetItemId' })
  budgetItem: BudgetItem;

  @Column({ type: 'date' })
  workDate: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  daysWorked: number; // 1.0 = día completo, 0.5 = medio día

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailySalary: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  fsr: number; // Factor de Salario Real

  // Computed column (calculado en BD)
  @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED' })
  realCost: number; // = dailySalary * daysWorked * fsr

  @CreateDateColumn()
  createdAt: Date;
}
```

---

### 2. LaborCostService

**Archivo:** `apps/backend/src/modules/hr/labor-costs/labor-costs.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { LaborCost } from './entities/labor-cost.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { Employee } from '../employees/entities/employee.entity';
import { FSRConfiguration } from '../fsr/entities/fsr-configuration.entity';
import { CrewBudgetAssignment } from '../crews/entities/crew-budget-assignment.entity';

@Injectable()
export class LaborCostsService {
  constructor(
    @InjectRepository(LaborCost)
    private laborCostRepo: Repository<LaborCost>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(FSRConfiguration)
    private fsrConfigRepo: Repository<FSRConfiguration),
    @InjectRepository(CrewBudgetAssignment)
    private crewBudgetRepo: Repository<CrewBudgetAssignment>,
  ) {}

  /**
   * Event listener: Cuando se aprueba asistencia, calcular costo
   */
  @OnEvent('attendance.approved')
  async handleAttendanceApproved(attendance: AttendanceRecord) {
    // Obtener empleado
    const employee = await this.employeeRepo.findOne({
      where: { id: attendance.employeeId },
      relations: ['workAssignments'],
    });

    // Obtener FSR de la constructora
    const fsrConfig = await this.fsrConfigRepo.findOne({
      where: { constructoraId: employee.constructoraId },
    });

    // Calcular días trabajados (basado en check-in y check-out)
    const daysWorked = await this.calculateDaysWorked(attendance);

    // Obtener salario (específico de obra o base)
    const workAssignment = employee.workAssignments.find(
      (a) => a.workId === attendance.workId && a.endDate === null,
    );
    const dailySalary = workAssignment?.workSpecificSalary || employee.currentSalary;

    // Determinar partida presupuestal
    const budgetItemId = await this.determineBudgetItem(
      attendance.employeeId,
      attendance.workId,
      attendance.workDate,
    );

    // Crear registro de costo
    const laborCost = this.laborCostRepo.create({
      attendanceId: attendance.id,
      employeeId: attendance.employeeId,
      workId: attendance.workId,
      budgetItemId,
      workDate: attendance.workDate,
      daysWorked,
      dailySalary,
      fsr: fsrConfig.totalFsr,
      // realCost se calcula automáticamente en BD
    });

    await this.laborCostRepo.save(laborCost);
  }

  /**
   * Calcular días trabajados basado en check-in/check-out
   */
  private async calculateDaysWorked(attendance: AttendanceRecord): Promise<number> {
    // Obtener check-in y check-out del mismo día
    const checkOut = await this.attendanceRepo.findOne({
      where: {
        employeeId: attendance.employeeId,
        workDate: attendance.workDate,
        type: 'check_out',
      },
    });

    if (!checkOut) {
      return 1.0; // Día completo por defecto
    }

    // Calcular horas trabajadas
    const hours =
      (checkOut.timestamp.getTime() - attendance.timestamp.getTime()) / (1000 * 60 * 60);

    if (hours >= 8) return 1.0; // Día completo
    if (hours >= 4) return 0.5; // Medio día
    return 0.25; // Cuarto de día
  }

  /**
   * Determinar partida presupuestal asignada
   */
  private async determineBudgetItem(
    employeeId: string,
    workId: string,
    workDate: Date,
  ): Promise<string | null> {
    // Buscar si el empleado está en una cuadrilla asignada a partida
    const assignment = await this.crewBudgetRepo
      .createQueryBuilder('assignment')
      .innerJoin('hr.crew_members', 'member', 'member.crew_id = assignment.crew_id')
      .where('member.employee_id = :employeeId', { employeeId })
      .andWhere('assignment.work_id = :workId', { workId })
      .andWhere('assignment.start_date <= :workDate', { workDate })
      .andWhere('(assignment.end_date IS NULL OR assignment.end_date >= :workDate)', {
        workDate,
      })
      .getOne();

    return assignment?.budgetItemId || null;
  }

  /**
   * Obtener costos por obra
   */
  async getCostsByWork(workId: string, filters?: { startDate?: Date; endDate?: Date }) {
    const query = this.laborCostRepo
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.employee', 'employee')
      .leftJoinAndSelect('cost.budgetItem', 'budgetItem')
      .where('cost.workId = :workId', { workId });

    if (filters?.startDate) {
      query.andWhere('cost.workDate >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('cost.workDate <= :endDate', { endDate: filters.endDate });
    }

    const costs = await query.getMany();

    const total = costs.reduce((sum, cost) => sum + Number(cost.realCost), 0);
    const byBudgetItem = this.groupByBudgetItem(costs);

    return { costs, total, byBudgetItem };
  }

  /**
   * Comparar real vs presupuestado
   */
  async compareRealVsBudget(workId: string) {
    // Obtener total presupuestado de MO
    const budgetedLabor = await this.budgetRepo
      .createQueryBuilder('item')
      .select('SUM(item.labor_cost)', 'total')
      .where('item.work_id = :workId', { workId })
      .getRawOne();

    // Obtener total real gastado
    const realLabor = await this.laborCostRepo
      .createQueryBuilder('cost')
      .select('SUM(cost.real_cost)', 'total')
      .where('cost.work_id = :workId', { workId })
      .getRawOne();

    // Obtener % de avance físico (de control de obra)
    const physicalProgress = await this.getPhysicalProgress(workId);

    // Proyección al 100%
    const projected = physicalProgress > 10
      ? (Number(realLabor.total) / physicalProgress) * 100
      : null;

    // Desviación
    const deviation = projected
      ? ((projected - Number(budgetedLabor.total)) / Number(budgetedLabor.total)) * 100
      : null;

    return {
      budgeted: Number(budgetedLabor.total),
      real: Number(realLabor.total),
      physicalProgress,
      projected,
      deviation,
      status: this.getDeviationStatus(deviation),
    };
  }

  private getDeviationStatus(deviation: number | null): string {
    if (!deviation) return 'unknown';
    if (Math.abs(deviation) < 10) return 'green'; // Normal
    if (Math.abs(deviation) < 20) return 'yellow'; // Advertencia
    return 'red'; // Crítico
  }

  private groupByBudgetItem(costs: LaborCost[]) {
    const grouped = {};
    costs.forEach((cost) => {
      const key = cost.budgetItemId || 'indirect';
      if (!grouped[key]) {
        grouped[key] = {
          budgetItemId: cost.budgetItemId,
          budgetItemName: cost.budgetItem?.name || 'Indirecto',
          total: 0,
          count: 0,
        };
      }
      grouped[key].total += Number(cost.realCost);
      grouped[key].count += 1;
    });
    return Object.values(grouped);
  }
}
```

---

### 3. FSRConfiguration Entity

**Archivo:** `apps/backend/src/modules/hr/fsr/entities/fsr-configuration.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fsr_configuration', { schema: 'hr' })
export class FSRConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  constructoraId: string;

  // Componentes del FSR
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 23.0 })
  imssPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  infonavitPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 4.17 })
  aguinaldoPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.67 })
  vacacionesPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.42 })
  primaVacacionalPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 14.28 })
  domingosPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.19 })
  festivosPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.0 })
  ausentismoPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 3.0 })
  otrosPercentage: number;

  // FSR calculado automáticamente
  @Column({ type: 'decimal', precision: 4, scale: 2, generatedType: 'STORED' })
  totalFsr: number;
  // = 1 + (sum of all percentages) / 100

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  effectiveDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🎨 Implementación Frontend

### CostDashboard Component

**Archivo:** `apps/frontend/src/features/hr/labor-costs/components/CostDashboard.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api.service';

export function CostDashboard({ workId }: { workId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['labor-costs', 'comparison', workId],
    queryFn: () => apiService.get<any>(`/hr/labor-costs/compare/${workId}`),
  });

  if (isLoading) return <div>Cargando...</div>;

  const statusColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Presupuesto MO</p>
          <p className="text-2xl font-bold">
            ${data.budgeted.toLocaleString('es-MX')}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Real Gastado</p>
          <p className="text-2xl font-bold">
            ${data.real.toLocaleString('es-MX')}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Proyección 100%</p>
          <p className="text-2xl font-bold">
            ${data.projected?.toLocaleString('es-MX') || 'N/A'}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Desviación</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">
              {data.deviation?.toFixed(1)}%
            </p>
            <Badge className={statusColor[data.status]}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Detalles */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Costo por Partida</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Partida</th>
              <th>Días-Hombre</th>
              <th>Costo Real</th>
            </tr>
          </thead>
          <tbody>
            {data.byBudgetItem.map((item) => (
              <tr key={item.budgetItemId}>
                <td>{item.budgetItemName}</td>
                <td>{item.count}</td>
                <td>${item.total.toLocaleString('es-MX')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
