# US-FUND-006: API RESTful Básica

**Epic:** MAI-001 - Fundamentos del Sistema
**Story Points:** 8
**Prioridad:** Alta
**Dependencias:**
- US-FUND-004 (Infraestructura Base)

**Estado:** Pendiente
**Asignado a:** Backend Lead + Backend Dev

---

## 📋 Historia de Usuario

**Como** desarrollador frontend
**Quiero** consumir una API RESTful bien estructurada y documentada
**Para** integrar el frontend con el backend de manera eficiente, predecible y con manejo de errores robusto.

---

## 🎯 Contexto y Objetivos

### Contexto

Este documento define los estándares y convenciones para TODAS las APIs del sistema de construcción. Incluye:

- **Convenciones REST** (verbos HTTP, códigos de estado, naming)
- **Formato de respuestas** estándar
- **Manejo de errores** consistente
- **Validación de requests** con DTOs
- **Paginación, filtrado y ordenamiento**
- **Documentación Swagger** automática
- **Rate limiting** para prevenir abuso
- **Versionado de API**

### Objetivos

1. ✅ Todas las APIs siguen convenciones REST estándar
2. ✅ Respuestas consistentes (mismo formato en todos los endpoints)
3. ✅ Errores informativos con códigos HTTP apropiados
4. ✅ Validación automática con class-validator
5. ✅ Paginación estándar para listados
6. ✅ Swagger docs generadas automáticamente
7. ✅ Rate limiting configurado globalmente

---

## ✅ Criterios de Aceptación

### CA-1: Convenciones REST

**Dado** un endpoint de la API
**Cuando** se diseña siguiendo las convenciones REST
**Entonces**:

- ✅ Usa los verbos HTTP correctos:
  - `GET`: Obtener recursos (sin side effects)
  - `POST`: Crear recursos
  - `PUT`: Actualizar recurso completo
  - `PATCH`: Actualizar recurso parcial
  - `DELETE`: Eliminar recurso
- ✅ URLs en plural: `/api/projects`, `/api/budgets`, `/api/users`
- ✅ IDs en la URL: `/api/projects/:id`
- ✅ Recursos anidados cuando corresponde: `/api/projects/:id/budgets`
- ✅ Query params para filtros: `/api/projects?status=active&page=2`

---

### CA-2: Códigos de Estado HTTP

**Dado** una respuesta de la API
**Cuando** se retorna al cliente
**Entonces** usa el código HTTP apropiado:

- ✅ **200 OK**: Operación exitosa (GET, PUT, PATCH)
- ✅ **201 Created**: Recurso creado (POST)
- ✅ **204 No Content**: Operación exitosa sin contenido (DELETE)
- ✅ **400 Bad Request**: Validación falló o parámetros inválidos
- ✅ **401 Unauthorized**: No autenticado (token faltante o inválido)
- ✅ **403 Forbidden**: Autenticado pero sin permisos
- ✅ **404 Not Found**: Recurso no existe
- ✅ **409 Conflict**: Conflicto (ej: email duplicado)
- ✅ **429 Too Many Requests**: Rate limit excedido
- ✅ **500 Internal Server Error**: Error del servidor

---

### CA-3: Formato de Respuesta Estándar

**Dado** cualquier endpoint exitoso
**Cuando** retorna datos
**Entonces** sigue este formato:

```typescript
{
  "statusCode": 200,
  "message": "Mensaje descriptivo",
  "data": { ... } // o [ ... ] para listas
}
```

**Para errores:**

```typescript
{
  "statusCode": 400,
  "message": "Mensaje de error",
  "error": "Bad Request",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects",
  "validationErrors": [ // Opcional, solo para errores de validación
    {
      "field": "name",
      "message": "El nombre es requerido"
    }
  ]
}
```

---

### CA-4: Paginación Estándar

**Dado** un endpoint que retorna listas
**Cuando** se solicitan datos paginados
**Entonces**:

- ✅ Acepta query params: `?page=1&limit=20`
- ✅ Defaults: `page=1`, `limit=20`, `maxLimit=100`
- ✅ Retorna metadata de paginación:

```typescript
{
  "statusCode": 200,
  "message": "Proyectos obtenidos exitosamente",
  "data": {
    "items": [ ... ],
    "meta": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

### CA-5: Filtrado y Ordenamiento

**Dado** un endpoint de listado
**Cuando** se aplican filtros y orden
**Entonces**:

- ✅ Filtros con query params: `?status=active&role=engineer`
- ✅ Ordenamiento: `?sortBy=createdAt&order=DESC`
- ✅ Búsqueda: `?search=proyecto+nuevo`
- ✅ Rango de fechas: `?startDate=2025-01-01&endDate=2025-12-31`

---

### CA-6: Validación con DTOs

**Dado** un request con datos inválidos
**Cuando** se envía al endpoint
**Entonces**:

- ✅ Validación se ejecuta automáticamente (ValidationPipe)
- ✅ Retorna 400 Bad Request
- ✅ Muestra errores específicos por campo
- ✅ Mensajes en español y descriptivos

---

### CA-7: Documentación Swagger

**Dado** la aplicación en modo desarrollo
**Cuando** accedo a `/api/docs`
**Entonces**:

- ✅ Swagger UI carga correctamente
- ✅ Todos los endpoints están documentados
- ✅ DTOs muestran sus propiedades y validaciones
- ✅ Responses documentadas con ejemplos
- ✅ Autenticación JWT configurada
- ✅ Es posible ejecutar requests desde Swagger

---

### CA-8: Rate Limiting

**Dado** un cliente realizando múltiples requests
**Cuando** excede el límite permitido
**Entonces**:

- ✅ Retorna 429 Too Many Requests
- ✅ Headers incluyen información del límite:
  - `X-RateLimit-Limit`: Límite máximo
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Timestamp de reset
- ✅ Límite por defecto: 100 requests/minuto por IP

---

## 🔧 Especificación Técnica Detallada

### 1. Response Transform Interceptor

**Archivo:** `apps/backend/src/common/interceptors/transform.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Si el controller ya retorna el formato esperado, no transformar
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return data;
        }

        // Transformar a formato estándar
        return {
          statusCode: response.statusCode,
          message: data?.message || 'Operación exitosa',
          data: data?.data !== undefined ? data.data : data,
        };
      }),
    );
  }
}
```

---

### 2. HTTP Exception Filter

**Archivo:** `apps/backend/src/common/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ValidationError {
  field: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let validationErrors: ValidationError[] | undefined;

    // Manejo de HttpException (NestJS)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;

        // Errores de validación
        if (Array.isArray(responseObj.message)) {
          validationErrors = this.formatValidationErrors(responseObj.message);
          message = 'Error de validación';
        }
      }
    }
    // Manejo de errores de TypeORM
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleDatabaseError(exception);
      error = 'Database Error';
    }
    // Otros errores
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Respuesta al cliente
    const errorResponse: any = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (validationErrors) {
      errorResponse.validationErrors = validationErrors;
    }

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(errors: any[]): ValidationError[] {
    return errors.map((err) => ({
      field: err.property || 'unknown',
      message: Object.values(err.constraints || {}).join(', '),
    }));
  }

  private handleDatabaseError(error: QueryFailedError): string {
    const message = error.message;

    // Unique constraint violation
    if (message.includes('unique constraint')) {
      if (message.includes('email')) {
        return 'El email ya está registrado';
      }
      if (message.includes('rfc')) {
        return 'El RFC ya está registrado';
      }
      return 'El valor ya existe en la base de datos';
    }

    // Foreign key constraint violation
    if (message.includes('foreign key constraint')) {
      return 'El registro está relacionado con otros datos y no puede ser eliminado';
    }

    // Not null constraint violation
    if (message.includes('null value')) {
      return 'Falta un campo requerido';
    }

    return 'Error en la base de datos';
  }
}
```

---

### 3. Pagination DTO

**Archivo:** `apps/backend/src/common/dto/pagination.dto.ts`

```typescript
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número de página (inicia en 1)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

export class SortDto {
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'createdAt',
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Orden (ASC o DESC)',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';
}

export class PaginatedDto<T> extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda',
    example: 'proyecto nuevo',
  })
  @IsOptional()
  search?: string;
}
```

**Archivo:** `apps/backend/src/common/dto/paginated-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Elementos por página', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total de elementos', example: 150 })
  totalItems: number;

  @ApiProperty({ description: 'Total de páginas', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Tiene página siguiente', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Tiene página anterior', example: false })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Lista de elementos', isArray: true })
  items: T[];

  @ApiProperty({ description: 'Metadata de paginación', type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;

    const totalPages = Math.ceil(total / limit);

    this.meta = {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
```

---

### 4. Ejemplo de Controller con Todas las Convenciones

**Archivo:** `apps/backend/src/modules/projects/projects.controller.ts`

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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConstructionRole } from '../../common/enums/construction-role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentConstructora } from '../../common/decorators/current-constructora.decorator';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Listar proyectos con paginación, filtros y ordenamiento
   */
  @Get()
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER, ConstructionRole.FINANCE)
  @ApiOperation({ summary: 'Listar proyectos con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de proyectos',
    type: PaginatedResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false, enum: ['planning', 'active', 'completed'] })
  @ApiQuery({ name: 'search', required: false, example: 'proyecto nuevo' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @CurrentConstructora() constructoraId?: string,
  ) {
    const { items, total } = await this.projectsService.findAll({
      ...paginationDto,
      status,
      search,
      constructoraId,
    });

    return {
      statusCode: 200,
      message: 'Proyectos obtenidos exitosamente',
      data: new PaginatedResponseDto(items, total, paginationDto.page, paginationDto.limit),
    };
  }

  /**
   * Obtener proyecto por ID
   */
  @Get(':id')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER, ConstructionRole.RESIDENT)
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto encontrado',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectsService.findOne(id);

    return {
      statusCode: 200,
      message: 'Proyecto obtenido exitosamente',
      data: project,
    };
  }

  /**
   * Crear nuevo proyecto
   */
  @Post()
  @Roles(ConstructionRole.DIRECTOR)
  @ApiOperation({ summary: 'Crear nuevo proyecto' })
  @ApiResponse({
    status: 201,
    description: 'Proyecto creado exitosamente',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string,
    @CurrentConstructora() constructoraId: string,
  ) {
    const project = await this.projectsService.create({
      ...createProjectDto,
      constructoraId,
      createdBy: userId,
    });

    return {
      statusCode: 201,
      message: 'Proyecto creado exitosamente',
      data: project,
    };
  }

  /**
   * Actualizar proyecto completo (PUT)
   */
  @Put(':id')
  @Roles(ConstructionRole.DIRECTOR)
  @ApiOperation({ summary: 'Actualizar proyecto completo' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto actualizado exitosamente',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);

    return {
      statusCode: 200,
      message: 'Proyecto actualizado exitosamente',
      data: project,
    };
  }

  /**
   * Actualizar proyecto parcial (PATCH)
   */
  @Patch(':id')
  @Roles(ConstructionRole.DIRECTOR, ConstructionRole.ENGINEER)
  @ApiOperation({ summary: 'Actualizar proyecto parcialmente' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto actualizado exitosamente',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async partialUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: Partial<UpdateProjectDto>,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);

    return {
      statusCode: 200,
      message: 'Proyecto actualizado exitosamente',
      data: project,
    };
  }

  /**
   * Eliminar proyecto (soft delete)
   */
  @Delete(':id')
  @Roles(ConstructionRole.DIRECTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar proyecto (soft delete)' })
  @ApiResponse({ status: 204, description: 'Proyecto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.projectsService.remove(id);
    // No retorna data (204 No Content)
  }
}
```

---

### 5. Ejemplo de DTO con Validaciones

**Archivo:** `apps/backend/src/modules/projects/dto/create-project.dto.ts`

```typescript
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Length,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'Residencial Las Palmas',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 255, { message: 'El nombre debe tener entre 3 y 255 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del proyecto',
    example: 'Desarrollo habitacional de 150 unidades',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @ApiProperty({
    description: 'Estado del proyecto',
    enum: ProjectStatus,
    example: ProjectStatus.PLANNING,
  })
  @IsEnum(ProjectStatus, { message: 'Estado inválido' })
  status: ProjectStatus;

  @ApiProperty({
    description: 'Fecha de inicio estimada',
    example: '2025-01-15',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida (YYYY-MM-DD)' })
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin estimada',
    example: '2026-06-30',
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser válida (YYYY-MM-DD)' })
  endDate: string;

  @ApiProperty({
    description: 'Presupuesto total en MXN',
    example: 45000000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  budget: number;

  @ApiPropertyOptional({
    description: 'Ubicación del proyecto',
    example: 'Av. Reforma 123, CDMX',
  })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Ingeniero responsable (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del ingeniero debe ser un UUID válido' })
  engineerId?: string;
}
```

---

### 6. Rate Limiting Configuration

**Archivo:** `apps/backend/src/common/guards/throttle.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottleGuard extends NestThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Rate limiting por usuario autenticado (si existe)
    if (req.user?.sub) {
      return `user-${req.user.sub}`;
    }

    // Rate limiting por IP para requests no autenticados
    return req.ip;
  }
}
```

**Configuración en AppModule:**

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

---

### 7. Custom Decorators para Documentación

**Archivo:** `apps/backend/src/common/decorators/api-paginated-response.decorator.ts`

```typescript
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              statusCode: { type: 'number', example: 200 },
              message: { type: 'string', example: 'Operación exitosa' },
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: {
                    properties: {
                      page: { type: 'number', example: 1 },
                      limit: { type: 'number', example: 20 },
                      totalItems: { type: 'number', example: 150 },
                      totalPages: { type: 'number', example: 8 },
                      hasNextPage: { type: 'boolean', example: true },
                      hasPreviousPage: { type: 'boolean', example: false },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
```

**Uso:**

```typescript
@Get()
@ApiPaginatedResponse(ProjectResponseDto)
async findAll() {
  // ...
}
```

---

## 🧪 Test Cases

### TC-API-001: Respuesta Exitosa

**Request:**
```http
GET /api/projects/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

**Resultado esperado:**
```json
{
  "statusCode": 200,
  "message": "Proyecto obtenido exitosamente",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Residencial Las Palmas",
    "status": "active",
    ...
  }
}
```

---

### TC-API-002: Error de Validación

**Request:**
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "AB",  // Muy corto (mínimo 3)
  "status": "invalid_status",  // Estado inválido
  "budget": -1000  // Negativo
}
```

**Resultado esperado:**
```json
{
  "statusCode": 400,
  "message": "Error de validación",
  "error": "Bad Request",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects",
  "validationErrors": [
    {
      "field": "name",
      "message": "El nombre debe tener entre 3 y 255 caracteres"
    },
    {
      "field": "status",
      "message": "Estado inválido"
    },
    {
      "field": "budget",
      "message": "El presupuesto no puede ser negativo"
    }
  ]
}
```

---

### TC-API-003: Paginación

**Request:**
```http
GET /api/projects?page=2&limit=10&status=active&sortBy=createdAt&order=DESC
Authorization: Bearer <token>
```

**Resultado esperado:**
```json
{
  "statusCode": 200,
  "message": "Proyectos obtenidos exitosamente",
  "data": {
    "items": [ ... ], // 10 proyectos
    "meta": {
      "page": 2,
      "limit": 10,
      "totalItems": 45,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

---

### TC-API-004: Rate Limiting

**Pasos:**
1. Realizar 101 requests en < 60 segundos
2. Observar respuesta del request #101

**Resultado esperado:**
```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "ThrottlerException"
}
```

**Headers de respuesta:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1700123456
```

---

### TC-API-005: Recurso No Encontrado

**Request:**
```http
GET /api/projects/00000000-0000-0000-0000-000000000000
Authorization: Bearer <token>
```

**Resultado esperado:**
```json
{
  "statusCode": 404,
  "message": "Proyecto no encontrado",
  "error": "Not Found",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects/00000000-0000-0000-0000-000000000000"
}
```

---

### TC-API-006: Sin Permisos

**Request:**
```http
POST /api/projects
Authorization: Bearer <token-de-residente>  // Solo DIRECTOR puede crear
Content-Type: application/json

{
  "name": "Nuevo Proyecto",
  "status": "planning",
  ...
}
```

**Resultado esperado:**
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción",
  "error": "Forbidden",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/api/projects"
}
```

---

## 📋 Tareas de Implementación

### Backend

- [ ] **API-BE-001:** Implementar TransformInterceptor
  - Estimado: 1h

- [ ] **API-BE-002:** Implementar HttpExceptionFilter
  - Estimado: 2h

- [ ] **API-BE-003:** Crear DTOs de paginación (PaginationDto, PaginatedResponseDto)
  - Estimado: 1.5h

- [ ] **API-BE-004:** Configurar ThrottlerGuard globalmente
  - Estimado: 1h

- [ ] **API-BE-005:** Crear decorator @ApiPaginatedResponse
  - Estimado: 1h

- [ ] **API-BE-006:** Configurar ValidationPipe global con mensajes en español
  - Estimado: 1h

- [ ] **API-BE-007:** Documentar todos los endpoints con Swagger decorators
  - Estimado: 3h

### Testing

- [ ] **API-TEST-001:** Unit tests para TransformInterceptor
  - Estimado: 1h

- [ ] **API-TEST-002:** Unit tests para HttpExceptionFilter
  - Estimado: 1.5h

- [ ] **API-TEST-003:** Integration tests para paginación
  - Estimado: 2h

- [ ] **API-TEST-004:** E2E tests para rate limiting
  - Estimado: 1.5h

### Documentation

- [ ] **API-DOC-001:** Crear guía de convenciones REST para el equipo
  - Estimado: 2h

- [ ] **API-DOC-002:** Documentar formato de respuestas estándar
  - Estimado: 1h

**Total estimado:** ~20 horas

---

## 🔗 Dependencias

### Depende de

- ✅ US-FUND-004 (Infraestructura Base)

### Bloqueante para

- Todos los módulos de negocio (Projects, Budgets, Purchases, etc.)
- Frontend (necesita API estable y predecible)

---

## 📊 Definición de Hecho (DoD)

- ✅ TransformInterceptor aplicado globalmente
- ✅ HttpExceptionFilter aplicado globalmente
- ✅ ValidationPipe configurado con mensajes en español
- ✅ ThrottlerGuard funcionando (100 req/min)
- ✅ Paginación implementada en al menos 3 endpoints
- ✅ Swagger docs accesibles en `/api/docs`
- ✅ Todos los test cases (TC-API-001 a TC-API-006) pasan
- ✅ Code coverage > 80% en interceptors y filters
- ✅ Guía de convenciones REST documentada

---

## 📝 Notas Adicionales

### Versionado de API

Para futuras versiones:

```typescript
@Controller({ path: 'projects', version: '1' })
export class ProjectsV1Controller {}

@Controller({ path: 'projects', version: '2' })
export class ProjectsV2Controller {}
```

Acceso: `/api/v1/projects`, `/api/v2/projects`

### HATEOAS (Opcional)

Para nivel de madurez REST avanzado:

```typescript
{
  "statusCode": 200,
  "data": {
    "id": "123",
    "name": "Proyecto X",
    "_links": {
      "self": "/api/projects/123",
      "budgets": "/api/projects/123/budgets",
      "update": "/api/projects/123",
      "delete": "/api/projects/123"
    }
  }
}
```

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
