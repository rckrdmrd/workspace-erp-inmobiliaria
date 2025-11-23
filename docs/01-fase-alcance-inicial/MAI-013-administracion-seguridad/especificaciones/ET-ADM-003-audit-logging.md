# ET-ADM-003: Audit Logging y Change Tracking

**ID:** ET-ADM-003  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-004

---

## 📋 Base de Datos

### Tabla: audit_logs

```sql
CREATE TABLE audit_logging.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Usuario
  user_id UUID NOT NULL,
  user_name VARCHAR(200),
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  
  -- Contexto
  constructora_id UUID NOT NULL,
  project_id UUID,
  
  -- Acción
  action VARCHAR(50) NOT NULL,
  module VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  -- Cambios
  changes JSONB,
  
  -- Contexto técnico
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  
  -- Metadata
  severity VARCHAR(20),
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  -- Retención
  retention_days INT DEFAULT 90,
  expires_at DATE
);

CREATE INDEX idx_audit_timestamp ON audit_logging.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user ON audit_logging.audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logging.audit_logs(action);
CREATE INDEX idx_audit_module ON audit_logging.audit_logs(module);
CREATE INDEX idx_audit_entity ON audit_logging.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_severity ON audit_logging.audit_logs(severity);
CREATE INDEX idx_audit_changes ON audit_logging.audit_logs USING GIN (changes);
```

---

## 🔧 Backend

### audit-log.entity.ts

```typescript
@Entity({ schema: 'audit_logging', name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  timestamp: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 50 })
  module: string;

  @Column({ name: 'entity_type', nullable: true })
  entityType?: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId?: string;

  @Column({ type: 'jsonb', nullable: true })
  changes?: any;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress?: string;

  @Column({ length: 20 })
  severity: string;

  @Column({ default: true })
  success: boolean;
}
```

### audit.service.ts

```typescript
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(dto: CreateAuditLogDto): Promise<void> {
    const retentionDays = this.getRetentionDays(dto.severity);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);

    const log = this.auditRepo.create({
      ...dto,
      retentionDays,
      expiresAt
    });

    await this.auditRepo.save(log);

    // Enviar alertas si es crítico
    if (dto.severity === 'critical' && !dto.success) {
      await this.sendSecurityAlert(log);
    }
  }

  private getRetentionDays(severity: string): number {
    const retention = {
      low: 90,
      medium: 365,
      high: 1825,  // 5 años
      critical: 3650 // 10 años
    };
    return retention[severity] || 90;
  }

  async findAll(filters: AuditLogFilters): Promise<PaginatedResult<AuditLog>> {
    const qb = this.auditRepo.createQueryBuilder('a');

    if (filters.startDate) {
      qb.andWhere('a.timestamp >= :start', { start: filters.startDate });
    }

    if (filters.endDate) {
      qb.andWhere('a.timestamp <= :end', { end: filters.endDate });
    }

    if (filters.userId) {
      qb.andWhere('a.user_id = :userId', { userId: filters.userId });
    }

    if (filters.action) {
      qb.andWhere('a.action = :action', { action: filters.action });
    }

    if (filters.module) {
      qb.andWhere('a.module = :module', { module: filters.module });
    }

    if (filters.severity) {
      qb.andWhere('a.severity = :severity', { severity: filters.severity });
    }

    qb.orderBy('a.timestamp', 'DESC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit)
    };
  }
}
```

### audit.interceptor.ts (Logging automático)

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const duration = Date.now() - startTime;
        
        // Solo auditar operaciones críticas
        if (this.shouldAudit(request)) {
          await this.auditService.log({
            userId: user.id,
            userName: user.fullName,
            userEmail: user.email,
            userRole: user.role,
            constructoraId: user.constructoraId,
            action: this.getAction(request.method),
            module: this.getModule(request.url),
            entityType: this.getEntityType(request.url),
            entityId: data?.id,
            ipAddress: request.ip,
            userAgent: request.get('user-agent'),
            sessionId: user.sessionId,
            severity: this.getSeverity(request),
            success: true,
            duration
          });
        }
      }),
      catchError(async (error) => {
        await this.auditService.log({
          userId: user?.id,
          action: this.getAction(request.method),
          module: this.getModule(request.url),
          success: false,
          errorMessage: error.message,
          severity: 'high'
        });

        throw error;
      })
    );
  }

  private shouldAudit(request: any): boolean {
    const criticalActions = ['POST', 'PATCH', 'DELETE'];
    return criticalActions.includes(request.method);
  }
}
```

---

## 🎨 Frontend

### AuditLogViewer.tsx

```typescript
export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    action: '',
    module: '',
    severity: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    const response = await api.get('/admin/audit-logs', { params: filters });
    setLogs(response.data.items);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bitácora de Auditoría</h1>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-4 gap-4">
        <DateRangePicker
          value={[filters.startDate, filters.endDate]}
          onChange={([start, end]) => setFilters({ ...filters, startDate: start, endDate: end })}
        />
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="px-4 py-2 border rounded"
        >
          <option value="">Todas las acciones</option>
          <option value="create">Crear</option>
          <option value="update">Actualizar</option>
          <option value="delete">Eliminar</option>
          <option value="approve">Aprobar</option>
        </select>

        <select
          value={filters.module}
          onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          className="px-4 py-2 border rounded"
        >
          <option value="">Todos los módulos</option>
          <option value="projects">Proyectos</option>
          <option value="budgets">Presupuestos</option>
          <option value="estimations">Estimaciones</option>
        </select>

        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="px-4 py-2 border rounded"
        >
          <option value="">Todas las severidades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="bg-white border rounded-lg">
        {logs.map(log => (
          <div key={log.id} className="border-b p-4 hover:bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500">
                {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    log.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.severity}
                  </span>

                  <span className="font-medium">{log.userName}</span>
                  <span className="text-gray-500">({log.userRole})</span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">{log.action}</span> en{' '}
                  <span className="font-medium">{log.module}</span>
                  {log.entityType && ` - ${log.entityType}`}
                </div>

                {log.changes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    {log.changes.map((change, i) => (
                      <div key={i}>
                        <span className="font-medium">{change.field}:</span>{' '}
                        <span className="text-red-600">{change.oldValue}</span> →{' '}
                        <span className="text-green-600">{change.newValue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {log.ipAddress}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
