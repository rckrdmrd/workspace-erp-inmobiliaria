# ET-HR-001: Implementación de Empleados y Cuadrillas

**Epic:** MAI-007 - RRHH, Asistencias y Nómina
**RF:** RF-HR-001
**Tipo:** Especificación Técnica
**Prioridad:** Alta
**Estado:** 🚧 En Implementación
**Última actualización:** 2025-11-17

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ EmployeeList │  │ EmployeeForm │  │ CrewManager│ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────┐
│              Backend (NestJS + TypeORM)              │
│  ┌──────────────────────────────────────────────┐   │
│  │            HR Module                          │   │
│  │  ┌──────────────┐  ┌────────────────────┐    │   │
│  │  │EmployeeService│  │CrewService         │    │   │
│  │  └──────────────┘  └────────────────────┘    │   │
│  │  ┌──────────────┐  ┌────────────────────┐    │   │
│  │  │EmployeeCtrl  │  │CrewController      │    │   │
│  │  └──────────────┘  └────────────────────┘    │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────┘
                         │ TypeORM
┌────────────────────────▼────────────────────────────┐
│                PostgreSQL Database                   │
│  Schemas: hr                                         │
│  Tables: employees, crews, crew_members, trades,    │
│          employee_work_assignments, salary_history   │
│  Triggers: generate_employee_code, generate_qr,     │
│           track_salary_changes                       │
└──────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
apps/backend/src/modules/hr/
├── employees/
│   ├── dto/
│   │   ├── create-employee.dto.ts
│   │   ├── update-employee.dto.ts
│   │   └── employee-response.dto.ts
│   ├── entities/
│   │   ├── employee.entity.ts
│   │   ├── trade.entity.ts
│   │   └── salary-history.entity.ts
│   ├── employees.controller.ts
│   ├── employees.service.ts
│   └── employees.module.ts
├── crews/
│   ├── dto/
│   │   ├── create-crew.dto.ts
│   │   └── assign-member.dto.ts
│   ├── entities/
│   │   ├── crew.entity.ts
│   │   └── crew-member.entity.ts
│   ├── crews.controller.ts
│   ├── crews.service.ts
│   └── crews.module.ts
├── enums/
│   ├── employee-status.enum.ts
│   ├── contract-type.enum.ts
│   └── work-shift.enum.ts
└── hr.module.ts

apps/frontend/src/features/hr/
├── employees/
│   ├── components/
│   │   ├── EmployeeList.tsx
│   │   ├── EmployeeForm.tsx
│   │   ├── EmployeeCard.tsx
│   │   └── DocumentUpload.tsx
│   ├── pages/
│   │   ├── EmployeesPage.tsx
│   │   └── EmployeeDetailPage.tsx
│   └── hooks/
│       ├── useEmployees.ts
│       └── useEmployeeMutations.ts
└── crews/
    ├── components/
    │   ├── CrewList.tsx
    │   └── CrewForm.tsx
    └── pages/
        └── CrewsPage.tsx
```

---

## 🔧 Implementación Backend

### 1. Employee Entity

**Archivo:** `apps/backend/src/modules/hr/employees/entities/employee.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Constructora } from '../../../auth/entities/constructora.entity';
import { Trade } from './trade.entity';
import { SalaryHistory } from './salary-history.entity';
import { EmployeeStatus } from '../../enums/employee-status.enum';
import { ContractType } from '../../enums/contract-type.enum';
import { WorkShift } from '../../enums/work-shift.enum';

@Entity('employees', { schema: 'hr' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  employeeCode: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructoraId' })
  constructora: Constructora;

  // Datos personales
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 20 })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'varchar', length: 20, nullable: true })
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';

  // Datos fiscales (CRÍTICOS)
  @Column({ type: 'varchar', length: 18, unique: true })
  curp: string;

  @Column({ type: 'varchar', length: 13 })
  rfc: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  nss: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  infonavitNumber: string;

  // Contacto
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  postalCode: string;

  // Datos laborales
  @Column({ type: 'uuid', nullable: true })
  primaryTradeId: string;

  @ManyToOne(() => Trade)
  @JoinColumn({ name: 'primaryTradeId' })
  primaryTrade: Trade;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({
    type: 'enum',
    enum: ContractType,
    default: ContractType.PERMANENT,
  })
  contractType: ContractType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseDailySalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentSalary: number;

  @Column({
    type: 'enum',
    enum: WorkShift,
    default: WorkShift.DAY,
  })
  workShift: WorkShift;

  // Estado
  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'text', nullable: true })
  terminationReason: string;

  @Column({ type: 'date', nullable: true })
  suspendedUntil: Date;

  @Column({ type: 'text', nullable: true })
  suspensionReason: string;

  // QR para asistencia
  @Column({ type: 'text', unique: true, nullable: true })
  qrCode: string;

  // Documentos (URLs a S3)
  @Column({ type: 'jsonb', default: [] })
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  // Relaciones
  @OneToMany(() => SalaryHistory, (history) => history.employee)
  salaryHistory: SalaryHistory[];

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
```

---

### 2. CreateEmployeeDto

**Archivo:** `apps/backend/src/modules/hr/employees/dto/create-employee.dto.ts`

```typescript
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Length,
  Matches,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractType } from '../../enums/contract-type.enum';
import { WorkShift } from '../../enums/work-shift.enum';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({ example: 'Pérez López' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @ApiProperty({ example: '1990-01-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @ApiPropertyOptional({ enum: ['single', 'married', 'divorced', 'widowed'] })
  @IsOptional()
  @IsEnum(['single', 'married', 'divorced', 'widowed'])
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';

  // Datos fiscales
  @ApiProperty({ example: 'ABCD123456HDFRNN09', description: 'CURP (18 caracteres)' })
  @IsString()
  @Length(18, 18)
  @Matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, {
    message: 'CURP inválido. Formato: 4 letras + 6 dígitos + H/M + 5 letras + 2 dígitos',
  })
  curp: string;

  @ApiProperty({ example: 'ABCD123456ABC', description: 'RFC (13 caracteres)' })
  @IsString()
  @Length(13, 13)
  @Matches(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, {
    message: 'RFC inválido',
  })
  rfc: string;

  @ApiProperty({ example: '12345678901', description: 'NSS (11 dígitos)' })
  @IsString()
  @Length(11, 11)
  @Matches(/^[0-9]{11}$/, {
    message: 'NSS debe tener 11 dígitos',
  })
  nss: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Length(10, 11)
  infonavitNumber?: string;

  // Contacto
  @ApiProperty({ example: '5512345678' })
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'Teléfono debe tener 10 dígitos',
  })
  phone: string;

  @ApiPropertyOptional({ example: 'juan.perez@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  // Datos laborales
  @ApiPropertyOptional({ description: 'UUID del oficio principal' })
  @IsOptional()
  @IsUUID()
  primaryTradeId?: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  hireDate: string;

  @ApiProperty({ enum: ContractType })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty({ example: 350.0, description: 'Salario Diario Integrado (SDI)' })
  @IsNumber()
  @Min(248.93) // Salario mínimo México 2025
  baseDailySalary: number;

  @ApiProperty({ enum: WorkShift })
  @IsEnum(WorkShift)
  workShift: WorkShift;

  @ApiPropertyOptional({ description: 'UUID de constructora (opcional si se infiere del usuario)' })
  @IsOptional()
  @IsUUID()
  constructoraId?: string;
}
```

---

### 3. EmployeeService

**Archivo:** `apps/backend/src/modules/hr/employees/employees.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { EmployeeStatus } from '../enums/employee-status.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  /**
   * Crear nuevo empleado
   */
  async create(createDto: CreateEmployeeDto, userId: string): Promise<Employee> {
    // Validar edad mínima (18 años)
    const birthDate = new Date(createDto.dateOfBirth);
    const age = this.calculateAge(birthDate);
    if (age < 18) {
      throw new BadRequestException('El empleado debe ser mayor de 18 años');
    }

    // Validar NSS único
    const existingNss = await this.employeeRepo.findOne({
      where: { nss: createDto.nss },
    });
    if (existingNss) {
      throw new ConflictException('El NSS ya está registrado');
    }

    // Validar CURP único
    const existingCurp = await this.employeeRepo.findOne({
      where: { curp: createDto.curp },
    });
    if (existingCurp) {
      throw new ConflictException('El CURP ya está registrado');
    }

    // Crear empleado
    const employee = this.employeeRepo.create({
      ...createDto,
      currentSalary: createDto.baseDailySalary,
      status: EmployeeStatus.ACTIVE,
      createdBy: userId,
    });

    // Guardar (triggers de BD generarán employeeCode y qrCode)
    return await this.employeeRepo.save(employee);
  }

  /**
   * Listar empleados con paginación y filtros
   */
  async findAll(
    paginationDto: PaginationDto,
    constructoraId: string,
    filters?: {
      status?: EmployeeStatus;
      search?: string;
      tradeId?: string;
    },
  ) {
    const { page, limit, skip } = paginationDto;

    const query = this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.primaryTrade', 'trade')
      .where('employee.constructoraId = :constructoraId', { constructoraId })
      .andWhere('employee.deletedAt IS NULL');

    // Filtros
    if (filters?.status) {
      query.andWhere('employee.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(employee.firstName ILIKE :search OR employee.lastName ILIKE :search OR employee.employeeCode ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.tradeId) {
      query.andWhere('employee.primaryTradeId = :tradeId', { tradeId: filters.tradeId });
    }

    // Paginación
    const [items, total] = await query
      .orderBy('employee.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  /**
   * Obtener empleado por ID
   */
  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ['primaryTrade', 'salaryHistory'],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return employee;
  }

  /**
   * Actualizar empleado
   */
  async update(id: string, updateDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    // Validar NSS único (si cambió)
    if (updateDto.nss && updateDto.nss !== employee.nss) {
      const existingNss = await this.employeeRepo.findOne({
        where: { nss: updateDto.nss },
      });
      if (existingNss) {
        throw new ConflictException('El NSS ya está registrado');
      }
    }

    // Actualizar
    Object.assign(employee, updateDto);
    return await this.employeeRepo.save(employee);
  }

  /**
   * Modificar salario
   */
  async updateSalary(
    id: string,
    newSalary: number,
    reason: string,
    authorizedBy: string,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // Validar salario mínimo
    if (newSalary < 248.93) {
      throw new BadRequestException('El salario no puede ser menor al salario mínimo');
    }

    // Advertencia si reducción > 20%
    const reduction = ((employee.currentSalary - newSalary) / employee.currentSalary) * 100;
    if (reduction > 20) {
      // Log warning (podría enviar notificación)
      console.warn(`Reducción salarial de ${reduction.toFixed(2)}% para empleado ${id}`);
    }

    employee.currentSalary = newSalary;
    return await this.employeeRepo.save(employee);
    // El trigger de BD guardará en salary_history automáticamente
  }

  /**
   * Suspender empleado
   */
  async suspend(
    id: string,
    reason: string,
    suspendedUntil?: Date,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    employee.status = EmployeeStatus.SUSPENDED;
    employee.suspensionReason = reason;
    employee.suspendedUntil = suspendedUntil;

    return await this.employeeRepo.save(employee);
  }

  /**
   * Reactivar empleado suspendido
   */
  async reactivate(id: string): Promise<Employee> {
    const employee = await this.findOne(id);

    if (employee.status !== EmployeeStatus.SUSPENDED) {
      throw new BadRequestException('El empleado no está suspendido');
    }

    employee.status = EmployeeStatus.ACTIVE;
    employee.suspensionReason = null;
    employee.suspendedUntil = null;

    return await this.employeeRepo.save(employee);
  }

  /**
   * Dar de baja empleado
   */
  async terminate(
    id: string,
    reason: string,
    terminationDate: Date,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // Validar que no haya asistencias futuras (se implementará en RF-HR-002)

    employee.status = EmployeeStatus.TERMINATED;
    employee.terminationReason = reason;
    employee.terminationDate = terminationDate;

    return await this.employeeRepo.save(employee);
  }

  /**
   * Soft delete
   */
  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepo.softRemove(employee);
  }

  /**
   * Generar QR code único
   */
  private generateQrCode(employeeId: string): string {
    const timestamp = Date.now();
    const randomPart = randomBytes(8).toString('hex');
    const payload = `${employeeId}-${timestamp}-${randomPart}`;
    return Buffer.from(payload).toString('base64');
  }

  /**
   * Calcular edad
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
```

---

### 4. EmployeeController

**Archivo:** `apps/backend/src/modules/hr/employees/employees.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ConstructionRole } from '../../../common/enums/construction-role.enum';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentConstructora } from '../../../common/decorators/current-constructora.decorator';
import { EmployeeStatus } from '../enums/employee-status.enum';

@ApiTags('HR - Employees')
@ApiBearerAuth('JWT-auth')
@Controller('hr/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR)
  @ApiOperation({ summary: 'Crear nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado' })
  async create(
    @Body() createDto: CreateEmployeeDto,
    @CurrentUser('id') userId: string,
    @CurrentConstructora() constructoraId: string,
  ) {
    const employee = await this.employeesService.create(
      { ...createDto, constructoraId },
      userId,
    );

    return {
      statusCode: 201,
      message: 'Empleado creado exitosamente',
      data: employee,
    };
  }

  @Get()
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR, ConstructionRole.FINANCE)
  @ApiOperation({ summary: 'Listar empleados' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: EmployeeStatus,
    @Query('search') search?: string,
    @Query('tradeId') tradeId?: string,
    @CurrentConstructora() constructoraId?: string,
  ) {
    const { items, total } = await this.employeesService.findAll(
      paginationDto,
      constructoraId,
      { status, search, tradeId },
    );

    return {
      statusCode: 200,
      message: 'Empleados obtenidos exitosamente',
      data: { items, total, page: paginationDto.page, limit: paginationDto.limit },
    };
  }

  @Get(':id')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR, ConstructionRole.RESIDENT)
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const employee = await this.employeesService.findOne(id);

    return {
      statusCode: 200,
      message: 'Empleado obtenido exitosamente',
      data: employee,
    };
  }

  @Patch(':id')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR)
  @ApiOperation({ summary: 'Actualizar empleado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeesService.update(id, updateDto);

    return {
      statusCode: 200,
      message: 'Empleado actualizado exitosamente',
      data: employee,
    };
  }

  @Patch(':id/salary')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR)
  @ApiOperation({ summary: 'Modificar salario de empleado' })
  async updateSalary(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newSalary') newSalary: number,
    @Body('reason') reason: string,
    @CurrentUser('id') userId: string,
  ) {
    const employee = await this.employeesService.updateSalary(
      id,
      newSalary,
      reason,
      userId,
    );

    return {
      statusCode: 200,
      message: 'Salario actualizado exitosamente',
      data: employee,
    };
  }

  @Patch(':id/suspend')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR)
  @ApiOperation({ summary: 'Suspender empleado' })
  async suspend(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @Body('suspendedUntil') suspendedUntil?: string,
  ) {
    const employee = await this.employeesService.suspend(
      id,
      reason,
      suspendedUntil ? new Date(suspendedUntil) : null,
    );

    return {
      statusCode: 200,
      message: 'Empleado suspendido exitosamente',
      data: employee,
    };
  }

  @Patch(':id/reactivate')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.HR)
  @ApiOperation({ summary: 'Reactivar empleado suspendido' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    const employee = await this.employeesService.reactivate(id);

    return {
      statusCode: 200,
      message: 'Empleado reactivado exitosamente',
      data: employee,
    };
  }

  @Delete(':id')
  @Roles(ConstructionRole.DIRECTOR)
  @ApiOperation({ summary: 'Dar de baja empleado' })
  async terminate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @Body('terminationDate') terminationDate: string,
  ) {
    const employee = await this.employeesService.terminate(
      id,
      reason,
      new Date(terminationDate),
    );

    return {
      statusCode: 200,
      message: 'Empleado dado de baja exitosamente',
      data: employee,
    };
  }
}
```

---

## 🎨 Implementación Frontend

### EmployeeForm Component

**Archivo:** `apps/frontend/src/features/hr/employees/components/EmployeeForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  lastName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['male', 'female', 'other']),
  curp: z
    .string()
    .length(18, 'CURP debe tener 18 caracteres')
    .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, 'CURP inválido'),
  rfc: z
    .string()
    .length(13, 'RFC debe tener 13 caracteres')
    .regex(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'RFC inválido'),
  nss: z
    .string()
    .length(11, 'NSS debe tener 11 dígitos')
    .regex(/^[0-9]{11}$/, 'NSS debe ser numérico'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos'),
  email: z.string().email('Email inválido').optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contractType: z.enum(['permanent', 'temporary', 'per_project']),
  baseDailySalary: z.number().min(248.93, 'No puede ser menor al salario mínimo'),
  workShift: z.enum(['day', 'night', 'mixed']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function EmployeeForm({ onSubmit, initialData }: { onSubmit: (data: EmployeeFormData) => void, initialData?: Partial<EmployeeFormData> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos Personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos Personales</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Nombre(s)</label>
            <Input {...register('firstName')} placeholder="Juan" />
            {errors.firstName && (
              <p className="text-sm text-error">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label>Apellidos</label>
            <Input {...register('lastName')} placeholder="Pérez López" />
            {errors.lastName && (
              <p className="text-sm text-error">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label>Fecha de Nacimiento</label>
            <Input type="date" {...register('dateOfBirth')} />
            {errors.dateOfBirth && (
              <p className="text-sm text-error">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <label>Género</label>
            <Select {...register('gender')}>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Datos Fiscales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos Fiscales</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>CURP</label>
            <Input
              {...register('curp')}
              placeholder="ABCD123456HDFRNN09"
              maxLength={18}
              className="uppercase"
            />
            {errors.curp && <p className="text-sm text-error">{errors.curp.message}</p>}
          </div>

          <div>
            <label>RFC</label>
            <Input
              {...register('rfc')}
              placeholder="ABCD123456ABC"
              maxLength={13}
              className="uppercase"
            />
            {errors.rfc && <p className="text-sm text-error">{errors.rfc.message}</p>}
          </div>

          <div>
            <label>NSS (IMSS)</label>
            <Input {...register('nss')} placeholder="12345678901" maxLength={11} />
            {errors.nss && <p className="text-sm text-error">{errors.nss.message}</p>}
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contacto</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Teléfono</label>
            <Input {...register('phone')} placeholder="5512345678" maxLength={10} />
            {errors.phone && <p className="text-sm text-error">{errors.phone.message}</p>}
          </div>

          <div>
            <label>Email (opcional)</label>
            <Input {...register('email')} type="email" placeholder="juan@example.com" />
            {errors.email && <p className="text-sm text-error">{errors.email.message}</p>}
          </div>
        </div>
      </div>

      {/* Datos Laborales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Datos Laborales</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Fecha de Ingreso</label>
            <Input type="date" {...register('hireDate')} />
            {errors.hireDate && (
              <p className="text-sm text-error">{errors.hireDate.message}</p>
            )}
          </div>

          <div>
            <label>Tipo de Contrato</label>
            <Select {...register('contractType')}>
              <option value="permanent">Planta</option>
              <option value="temporary">Eventual</option>
              <option value="per_project">Por Obra</option>
            </Select>
          </div>

          <div>
            <label>Jornada</label>
            <Select {...register('workShift')}>
              <option value="day">Diurna</option>
              <option value="night">Nocturna</option>
              <option value="mixed">Mixta</option>
            </Select>
          </div>

          <div>
            <label>Salario Diario Integrado</label>
            <Input
              type="number"
              step="0.01"
              {...register('baseDailySalary', { valueAsNumber: true })}
              placeholder="350.00"
            />
            {errors.baseDailySalary && (
              <p className="text-sm text-error">{errors.baseDailySalary.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Mínimo: $248.93 (salario mínimo 2025)
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Actualizar' : 'Crear'} Empleado
        </Button>
      </div>
    </form>
  );
}
```

---

## 🧪 Tests

```typescript
describe('EmployeesService', () => {
  it('should create employee with valid data', async () => {
    const dto = {
      firstName: 'Juan',
      lastName: 'Pérez',
      dateOfBirth: '1990-01-15',
      gender: 'male',
      curp: 'PEPJ900115HDFRNN09',
      rfc: 'PEPJ900115ABC',
      nss: '12345678901',
      phone: '5512345678',
      hireDate: '2025-01-15',
      contractType: ContractType.PERMANENT,
      baseDailySalary: 350.0,
      workShift: WorkShift.DAY,
    };

    const employee = await service.create(dto, 'user-id');
    expect(employee.employeeCode).toMatch(/^EMP-\d{5}$/);
    expect(employee.qrCode).toBeDefined();
    expect(employee.status).toBe(EmployeeStatus.ACTIVE);
  });

  it('should reject employee under 18 years', async () => {
    const dto = {
      // ... otros campos
      dateOfBirth: '2010-01-15', // 15 años
    };

    await expect(service.create(dto, 'user-id')).rejects.toThrow(
      'El empleado debe ser mayor de 18 años',
    );
  });

  it('should reject duplicate NSS', async () => {
    // ... crear empleado
    await expect(
      service.create({ ...dto, curp: 'OTHER123456HDFRNN09' }, 'user-id'),
    ).rejects.toThrow('El NSS ya está registrado');
  });
});
```

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
