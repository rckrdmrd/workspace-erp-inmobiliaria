# ET-ADM-004: Backups y Disaster Recovery

**ID:** ET-ADM-004  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-005

---

## 📋 Base de Datos

### Tabla: backups

```sql
CREATE TABLE admin.backup_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Tipo
  backup_type VARCHAR(20) NOT NULL, -- 'full', 'incremental', 'files', 'snapshot'
  
  -- Ubicación
  storage_path TEXT NOT NULL,
  s3_url TEXT,
  storage_tier VARCHAR(20),
  
  -- Tamaño
  size_bytes BIGINT NOT NULL,
  size_compressed BIGINT,
  
  -- Integridad
  checksum VARCHAR(64) NOT NULL,
  checksum_algorithm VARCHAR(10) DEFAULT 'sha256',
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration INT,
  
  -- Retención
  retention_days INT NOT NULL,
  expires_at DATE NOT NULL,
  
  -- Errores
  error_message TEXT,
  
  -- Metadata
  database_version VARCHAR(50),
  schema_version VARCHAR(20)
);

CREATE INDEX idx_backups_timestamp ON admin.backup_records(timestamp DESC);
CREATE INDEX idx_backups_type ON admin.backup_records(backup_type);
CREATE INDEX idx_backups_status ON admin.backup_records(status);
CREATE INDEX idx_backups_expires ON admin.backup_records(expires_at);
```

---

## 🔧 Backend

### backup.service.ts

```typescript
@Injectable()
export class BackupService {
  constructor(
    @InjectRepository(BackupRecord)
    private backupsRepo: Repository<BackupRecord>,
    private configService: ConfigService,
  ) {}

  @Cron('0 3 * * *') // Diario 3 AM
  async createFullBackup(): Promise<BackupRecord> {
    const backupId = uuidv4();
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const filename = `backup-full-${timestamp}.dump`;
    const storagePath = `/backups/full/${filename}`;

    // Crear registro
    const record = this.backupsRepo.create({
      backupType: BackupType.FULL,
      storagePath,
      status: BackupStatus.IN_PROGRESS,
      startedAt: new Date(),
      retentionDays: 7,
      expiresAt: addDays(new Date(), 7)
    });

    await this.backupsRepo.save(record);

    try {
      // Ejecutar pg_dump
      const { stdout, stderr } = await exec(`
        pg_dump -h ${this.configService.get('DB_HOST')} \
          -U ${this.configService.get('DB_USER')} \
          -F c \
          -f ${storagePath} \
          ${this.configService.get('DB_NAME')}
      `);

      // Calcular checksum
      const checksum = await this.calculateChecksum(storagePath);

      // Obtener tamaño
      const stats = await fs.stat(storagePath);
      const sizeBytes = stats.size;

      // Subir a S3
      const s3Url = await this.uploadToS3(storagePath, filename);

      // Actualizar registro
      record.status = BackupStatus.COMPLETED;
      record.completedAt = new Date();
      record.duration = differenceInSeconds(record.completedAt, record.startedAt);
      record.sizeBytes = sizeBytes;
      record.checksum = checksum;
      record.s3Url = s3Url;
      record.databaseVersion = await this.getDatabaseVersion();

      await this.backupsRepo.save(record);

      // Enviar notificación éxito
      await this.sendBackupNotification(record, true);

      return record;
    } catch (error) {
      record.status = BackupStatus.FAILED;
      record.errorMessage = error.message;
      await this.backupsRepo.save(record);

      // Enviar alerta crítica
      await this.sendBackupAlert(record, error);

      throw error;
    }
  }

  @Cron('0 */6 * * *') // Cada 6 horas
  async createIncrementalBackup(): Promise<BackupRecord> {
    // Similar a full pero usando rsync para cambios
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const storagePath = `/backups/incremental/backup-${timestamp}`;

    // Ejecutar rsync con --link-dest al backup anterior
    await exec(`
      rsync -av --delete --link-dest=/backups/previous \
        /var/lib/postgresql/data \
        ${storagePath}
    `);

    // Crear registro...
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private async uploadToS3(localPath: string, filename: string): Promise<string> {
    const s3 = new S3Client({
      region: this.configService.get('AWS_REGION')
    });

    const fileStream = fs.createReadStream(localPath);

    const uploadParams = {
      Bucket: this.configService.get('BACKUPS_BUCKET'),
      Key: `backups/${filename}`,
      Body: fileStream,
      ServerSideEncryption: 'AES256',
      StorageClass: 'STANDARD_IA'
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return `s3://${uploadParams.Bucket}/${uploadParams.Key}`;
  }

  async restore(backupId: string): Promise<void> {
    const backup = await this.backupsRepo.findOne({ where: { id: backupId } });

    if (!backup) {
      throw new NotFoundException('Backup not found');
    }

    // Validar checksum antes de restaurar
    const calculatedChecksum = await this.calculateChecksum(backup.storagePath);

    if (calculatedChecksum !== backup.checksum) {
      throw new BadRequestException('Backup file corrupted (checksum mismatch)');
    }

    // Detener aplicación
    await this.stopApplication();

    try {
      // Restaurar desde dump
      await exec(`
        pg_restore -h ${this.configService.get('DB_HOST')} \
          -U ${this.configService.get('DB_USER')} \
          --clean --if-exists \
          -d ${this.configService.get('DB_NAME')} \
          ${backup.storagePath}
      `);

      // Reiniciar aplicación
      await this.startApplication();

      // Notificar éxito
      await this.sendRestoreNotification(backup, true);
    } catch (error) {
      // Notificar fallo crítico
      await this.sendRestoreAlert(backup, error);
      throw error;
    }
  }

  @Cron('0 2 1 * *') // Primer domingo de cada mes 2 AM
  async runRestoreTest(): Promise<void> {
    const latestBackup = await this.backupsRepo.findOne({
      where: { status: BackupStatus.COMPLETED },
      order: { timestamp: 'DESC' }
    });

    if (!latestBackup) {
      throw new Error('No backup available for testing');
    }

    // Crear base de datos temporal
    await exec('createdb backup_test');

    try {
      // Restaurar en DB temporal
      await exec(`
        pg_restore -d backup_test ${latestBackup.storagePath}
      `);

      // Ejecutar queries de validación
      const isValid = await this.validateBackup('backup_test');

      if (isValid) {
        latestBackup.isVerified = true;
        latestBackup.verifiedAt = new Date();
        await this.backupsRepo.save(latestBackup);

        await this.sendTestReport(latestBackup, true);
      } else {
        throw new Error('Backup validation failed');
      }
    } finally {
      // Limpiar
      await exec('dropdb backup_test');
    }
  }

  @Cron('0 4 * * *') // Diario 4 AM
  async cleanupExpiredBackups(): Promise<void> {
    const expired = await this.backupsRepo.find({
      where: {
        expiresAt: LessThan(new Date())
      }
    });

    for (const backup of expired) {
      // Eliminar archivo local
      await fs.unlink(backup.storagePath).catch(() => {});

      // Eliminar de S3 (opcional, S3 lifecycle puede manejarlo)
      // await this.deleteFromS3(backup.s3Url);

      // Marcar como eliminado (o eliminar registro)
      await this.backupsRepo.delete(backup.id);
    }
  }

  private async sendBackupAlert(backup: BackupRecord, error: Error): Promise<void> {
    // Enviar email crítico a admin + SMS
    await this.emailService.send({
      to: this.configService.get('ADMIN_EMAIL'),
      subject: '🚨 CRÍTICO: Backup Fallido',
      template: 'backup-failed',
      context: {
        backup,
        error: error.message,
        timestamp: new Date()
      }
    });
  }
}
```

### backup.controller.ts

```typescript
@Controller('admin/backups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BackupsController {
  constructor(private backupService: BackupService) {}

  @Get()
  @RequirePermissions('admin', PermissionAction.READ)
  async findAll(@Query() filters: any) {
    return this.backupService.findAll(filters);
  }

  @Post()
  @RequirePermissions('admin', PermissionAction.CREATE)
  async create(@Body() dto: { type: BackupType }) {
    if (dto.type === BackupType.FULL) {
      return this.backupService.createFullBackup();
    } else if (dto.type === BackupType.INCREMENTAL) {
      return this.backupService.createIncrementalBackup();
    }
  }

  @Post(':id/restore')
  @RequirePermissions('admin', PermissionAction.APPROVE)
  async restore(@Param('id') id: string) {
    await this.backupService.restore(id);
    return { message: 'Restore initiated successfully' };
  }

  @Post('test')
  @RequirePermissions('admin', PermissionAction.APPROVE)
  async test() {
    await this.backupService.runRestoreTest();
    return { message: 'Restore test completed' };
  }
}
```

---

## 🎨 Frontend

### BackupManager.tsx

```typescript
export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    const response = await api.get('/admin/backups');
    setBackups(response.data);
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await api.post('/admin/backups', { type: 'full' });
      toast.success('Backup iniciado');
      fetchBackups();
    } catch (error) {
      toast.error('Error al crear backup');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!confirm('¿Está seguro de restaurar este backup? Esto detendrá el sistema.')) {
      return;
    }

    try {
      await api.post(`/admin/backups/${backupId}/restore`);
      toast.success('Restauración iniciada');
    } catch (error) {
      toast.error('Error al restaurar');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Backups</h1>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {creating ? 'Creando...' : 'Crear Backup Manual'}
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Fecha/Hora</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Tamaño</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Verificado</th>
              <th className="px-6 py-3 text-left">Expira</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.id} className="border-t">
                <td className="px-6 py-4">
                  {format(new Date(backup.timestamp), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {backup.backupType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {(backup.sizeBytes / 1024 / 1024 / 1024).toFixed(2)} GB
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                    backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {backup.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {backup.isVerified ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {formatDistanceToNow(new Date(backup.expiresAt))}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRestore(backup.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Restaurar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
