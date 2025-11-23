# US-FUND-002: Perfiles de Usuario de Construcción

**Épica:** MAI-001 - Fundamentos
**Sprint:** Sprint 1-2 (Semanas 1-2)
**Story Points:** 5 SP
**Presupuesto:** $1,800 MXN
**Prioridad:** Alta
**Estado:** 🚧 Planificado

---

## Descripción

Como **usuario del sistema de gestión de obra**, quiero **ver y editar mi perfil profesional** para **mantener mi información de contacto actualizada y mostrar mi rol en la constructora**.

**Contexto del Alcance Inicial:**
El MVP incluye perfiles básicos con información esencial para construcción: nombre, email, rol en constructora(s), foto, teléfono. No incluye currículum, certificaciones, historial de proyectos o configuraciones avanzadas, que se agregarán en extensiones futuras.

**Diferencias con GAMILIT:**
- Multi-tenancy: Usuario puede tener diferentes roles en diferentes constructoras
- Información adicional: teléfono, especialidad (para ingenieros/residentes)
- Sin gamificación (no hay XP, coins, badges en perfil)

---

## Criterios de Aceptación

- [ ] **CA-01:** El usuario puede ver su perfil con: nombre completo, email, teléfono, foto, constructoras asociadas
- [ ] **CA-02:** El usuario puede editar: fullName, phone, foto de perfil
- [ ] **CA-03:** El email NO es editable (requeriría re-verificación)
- [ ] **CA-04:** El rol NO es editable por el usuario (solo admin puede cambiar)
- [ ] **CA-05:** La foto de perfil puede subirse (max 5MB, formatos: jpg, png, webp)
- [ ] **CA-06:** Si no hay foto, se muestra avatar por defecto (iniciales del nombre)
- [ ] **CA-07:** Se muestra lista de constructoras donde el usuario tiene acceso con su rol en cada una
- [ ] **CA-08:** Los cambios se guardan en la base de datos
- [ ] **CA-09:** Se muestra mensaje de confirmación al guardar cambios
- [ ] **CA-10:** Se valida que fullName no esté vacío
- [ ] **CA-11:** Se valida formato de teléfono (10 dígitos, México)
- [ ] **CA-12:** La foto se redimensiona automáticamente a 200x200px
- [ ] **CA-13:** Usuario puede marcar una constructora como "principal" (pre-seleccionada al login)

---

## Especificaciones Técnicas

### Backend (NestJS)

**Endpoints:**
```
GET /api/user/profile
- Headers: Authorization: Bearer {token}
- Response: {
    user: {
      id,
      email,
      fullName,
      phone,
      photoUrl,
      createdAt
    },
    constructoras: [
      {
        constructoraId,
        nombre,
        logoUrl,
        role,
        isPrimary,
        status
      }
    ]
  }

PATCH /api/user/profile
- Headers: Authorization: Bearer {token}
- Body: { fullName?, phone? }
- Response: { user: { ... } }

POST /api/user/profile/photo
- Headers: Authorization: Bearer {token}, Content-Type: multipart/form-data
- Body: FormData with 'photo' file
- Response: { photoUrl: string }

DELETE /api/user/profile/photo
- Headers: Authorization: Bearer {token}
- Response: { message: "Photo deleted" }

PATCH /api/user/set-primary-constructora
- Headers: Authorization: Bearer {token}
- Body: { constructoraId: string }
- Response: { message: "Primary constructora updated" }
```

**Servicios:**
- **ProfileService:** Gestión de perfiles de usuario
- **FileUploadService:** Manejo de uploads de imágenes (reutilizado)
- **ImageProcessingService:** Redimensionamiento de imágenes (reutilizado)
- **ConstructoraService:** Obtener constructoras del usuario

**Entidades:**
```typescript
// Perfil global
@Entity('profiles', { schema: 'auth_management' })
class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string;

  @Column({ name: 'photo_key', nullable: true })
  photoKey?: string; // Para storage local o S3

  @Column({ type: 'enum', enum: UserStatus, default: 'pending' })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// Relación con constructoras (ya existe)
@Entity('user_constructoras', { schema: 'auth_management' })
class UserConstructora {
  // ... campos existentes de ET-AUTH-003
  role: ConstructionRole;
  isPrimary: boolean;
  status: UserStatus;
}
```

**Validaciones:**
```typescript
// apps/backend/src/modules/user/dto/update-profile.dto.ts
import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @Length(3, 255)
  fullName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10}$/, {
    message: 'Teléfono debe tener 10 dígitos (formato México)',
  })
  phone?: string;
}
```

### Frontend (React + Vite)

**Componentes:**
```typescript
// apps/frontend/src/features/profile/ProfileView.tsx
- Muestra información del usuario (solo lectura)
- Lista de constructoras con badges de rol
- Badge especial para constructora principal
- Botón "Editar perfil"

// apps/frontend/src/features/profile/ProfileEditForm.tsx
- Formulario de edición con React Hook Form + Zod
- Campos: fullName, phone
- Validación en tiempo real
- Preview de cambios antes de guardar

// apps/frontend/src/features/profile/PhotoUpload.tsx
- Upload drag-and-drop con react-dropzone
- Preview de imagen
- Crop/ajuste de imagen (opcional en MVP)
- Indicador de progreso

// apps/frontend/src/components/ui/AvatarWithInitials.tsx
- Avatar con iniciales si no hay foto
- Colores generados por hash del nombre
- Tamaños: sm, md, lg, xl

// apps/frontend/src/features/profile/ConstructorasList.tsx
- Lista de constructoras del usuario
- Badge de rol (director, engineer, etc.)
- Icono de estrella para constructora principal
- Click para marcar como principal
```

**Rutas:**
```typescript
/profile             → Página de perfil (vista)
/profile/edit        → Editar perfil
/settings/account    → Configuración de cuenta (incluye perfil)
```

**Estado (Zustand):**
```typescript
// apps/frontend/src/stores/profile-store.ts
interface ProfileStore {
  profile: UserProfile | null;
  constructoras: UserConstructoraAccess[];
  loading: boolean;
  uploadingPhoto: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  deletePhoto: () => Promise<void>;
  setPrimaryConstructora: (constructoraId: string) => Promise<void>;
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  photoUrl: string | null;
  createdAt: string;
}

interface UserConstructoraAccess {
  constructoraId: string;
  nombre: string;
  logoUrl: string | null;
  role: ConstructionRole;
  isPrimary: boolean;
  status: UserStatus;
}
```

**UI/UX:**
- Card con información del usuario
- Grid de 2 columnas: Info personal | Constructoras
- Botones: "Editar perfil", "Cambiar foto"
- Upload drag-and-drop con preview
- Loading states durante operaciones
- Toast notifications para confirmaciones

### Almacenamiento de Archivos

**Opción Inicial (Alcance MVP):**
- Archivos guardados localmente en `/uploads/profile-photos/`
- Nombres generados con UUID: `{userId}-{timestamp}-{uuid}.jpg`
- Public URL servida por Express: `/static/profile-photos/{photoKey}`
- Organización: `/uploads/profile-photos/YYYY/MM/` (por mes)

**Limpieza:**
- Al subir nueva foto, eliminar foto anterior del disco
- Orphan cleanup job: eliminar fotos sin usuario (cron semanal)

**Opción Futura:**
- Migración a AWS S3 o CloudFlare R2 (Fase 2)

---

## Dependencias

**Antes:**
- ✅ US-FUND-001 (Autenticación JWT - requiere usuario autenticado)
- ✅ RF-AUTH-003 (Multi-tenancy - necesita constructoras)

**Después:**
- US-FUND-003 (Dashboard - muestra foto de perfil y nombre)
- Todas las historias usan la foto y nombre del usuario

**Bloqueos:**
- Ninguno (puede implementarse en Sprint 1-2)

---

## Definición de Hecho (DoD)

- [ ] Endpoints implementados y documentados (Swagger)
- [ ] Validaciones en backend (DTO, file size, file type)
- [ ] Upload de archivos funcional con Sharp
- [ ] Redimensionamiento automático a 200x200px
- [ ] Componentes de frontend implementados
- [ ] Zustand store con acciones de perfil
- [ ] Tests unitarios backend (>80% coverage)
- [ ] Tests E2E para edición de perfil
- [ ] Tests frontend (React Testing Library)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Manejo de errores (file too large, invalid format, network error)
- [ ] Loading states y feedback visual
- [ ] Documentación de API en Swagger
- [ ] Code review aprobado
- [ ] Desplegado en staging y validado

---

## Notas del Alcance Inicial

### Incluido en MVP ✅
- ✅ Campos básicos: fullName, email, phone, photo
- ✅ Lista de constructoras con roles
- ✅ Marcar constructora como principal
- ✅ Upload y preview de foto
- ✅ Avatar con iniciales si no hay foto
- ✅ Storage local de imágenes

### NO Incluido en MVP ❌
- ❌ Currículum vitae o bio extensa
- ❌ Certificaciones profesionales (ingeniero civil, arquitecto, etc.)
- ❌ Historial de proyectos completados
- ❌ Estadísticas de desempeño
- ❌ Configuraciones de privacidad
- ❌ Redes sociales (LinkedIn, etc.)
- ❌ Preferencias de notificaciones (en US-FUND-005)
- ❌ Crop avanzado de imagen (solo redimensionamiento)
- ❌ Storage en la nube (S3)

### Extensiones Futuras ⚠️
- ⚠️ **Fase 2:** Perfil profesional extendido (bio, certificaciones, experiencia)
- ⚠️ **Fase 2:** Historial de proyectos y métricas
- ⚠️ **Fase 2:** Integración con LinkedIn
- ⚠️ **Fase 2:** Migración a S3 para storage

---

## Tareas de Implementación

### Backend (Estimado: 10h)

**Total Backend:** 10h (~2.5 SP)

- [ ] **Tarea B.1:** Endpoints de perfil - Estimado: 4h
  - [ ] Subtarea B.1.1: GET /user/profile con datos de perfil + constructoras - 1.5h
  - [ ] Subtarea B.1.2: PATCH /user/profile con validación de DTO - 1h
  - [ ] Subtarea B.1.3: PATCH /user/set-primary-constructora - 1h
  - [ ] Subtarea B.1.4: Documentación Swagger de endpoints - 0.5h

- [ ] **Tarea B.2:** Sistema de upload de archivos - Estimado: 4h
  - [ ] Subtarea B.2.1: Reutilizar FileUploadService de GAMILIT - 0.5h
  - [ ] Subtarea B.2.2: POST /user/profile/photo con validación (5MB, jpg/png/webp) - 1.5h
  - [ ] Subtarea B.2.3: DELETE /user/profile/photo y cleanup de archivo - 1h
  - [ ] Subtarea B.2.4: Organización por mes: /uploads/profile-photos/YYYY/MM/ - 0.5h
  - [ ] Subtarea B.2.5: Cleanup de foto anterior al subir nueva - 0.5h

- [ ] **Tarea B.3:** Procesamiento de imágenes - Estimado: 2h
  - [ ] Subtarea B.3.1: Reutilizar ImageProcessingService con Sharp - 0.5h
  - [ ] Subtarea B.3.2: Redimensionamiento a 200x200 manteniendo aspect ratio - 1h
  - [ ] Subtarea B.3.3: Optimización de calidad y compresión - 0.5h

### Frontend (Estimado: 7h)

**Total Frontend:** 7h (~1.75 SP)

- [ ] **Tarea F.1:** Componentes de perfil - Estimado: 4h
  - [ ] Subtarea F.1.1: ProfileView con grid de info personal + constructoras - 1.5h
  - [ ] Subtarea F.1.2: ProfileEditForm con React Hook Form + Zod - 1.5h
  - [ ] Subtarea F.1.3: AvatarWithInitials reutilizado de GAMILIT - 0.5h
  - [ ] Subtarea F.1.4: ConstructorasList con badges de rol y estrella primary - 1h
  - [ ] Subtarea F.1.5: Navegación /profile y /profile/edit - 0.5h

- [ ] **Tarea F.2:** Upload de foto de perfil - Estimado: 2h
  - [ ] Subtarea F.2.1: PhotoUpload con react-dropzone - 1h
  - [ ] Subtarea F.2.2: Preview de imagen antes de guardar - 0.5h
  - [ ] Subtarea F.2.3: ProfileStore en Zustand con métodos CRUD - 0.5h

- [ ] **Tarea F.3:** Responsive y UX - Estimado: 1h
  - [ ] Subtarea F.3.1: Diseño responsive (mobile-first) - 0.5h
  - [ ] Subtarea F.3.2: Loading states y skeleton loaders - 0.25h
  - [ ] Subtarea F.3.3: Toast notifications para confirmaciones - 0.25h

### Testing (Estimado: 3h)

**Total Testing:** 3h (~0.75 SP)

- [ ] **Tarea T.1:** Tests unitarios backend - Estimado: 1.5h
  - [ ] Subtarea T.1.1: Tests de ProfileService (fetch, update) - 0.5h
  - [ ] Subtarea T.1.2: Tests de FileUploadService (validación) - 0.5h
  - [ ] Subtarea T.1.3: Tests de setPrimaryConstructora - 0.5h

- [ ] **Tarea T.2:** Tests E2E - Estimado: 1h
  - [ ] Subtarea T.2.1: Tests de endpoints GET/PATCH profile - 0.5h
  - [ ] Subtarea T.2.2: Tests de upload de foto (success y errores) - 0.5h

- [ ] **Tarea T.3:** Tests frontend - Estimado: 0.5h
  - [ ] Subtarea T.3.1: Tests de ProfileEditForm (React Testing Library) - 0.25h
  - [ ] Subtarea T.3.2: Tests de PhotoUpload - 0.25h

---

## Resumen de Horas

| Categoría | Estimado | Story Points |
|-----------|----------|--------------|
| Backend | 10h | 2.5 SP |
| Frontend | 7h | 1.75 SP |
| Testing | 3h | 0.75 SP |
| **TOTAL** | **20h** | **5 SP** |

**Validación:** 5 SP × 4h/SP = 20 horas estimadas ✅

---

## Cronograma Propuesto

**Sprint:** Sprint 1-2 (Semanas 1-2)
**Duración:** 2.5 días
**Equipo:**
- 1 Backend developer (10h)
- 1 Frontend developer (7h)
- QA compartido (3h)

**Hitos:**
- Día 1: Endpoints backend + upload de foto
- Día 2: Frontend (componentes + store)
- Día 2.5: Testing + ajustes

---

## Testing

### Tests Unitarios Backend

```typescript
// apps/backend/src/modules/user/services/profile.service.spec.ts
describe('ProfileService', () => {
  it('should fetch user profile with constructoras', async () => {
    const profile = await profileService.getProfile(userId);
    expect(profile.user).toBeDefined();
    expect(profile.constructoras).toBeArray();
  });

  it('should update fullName and phone', async () => {
    const updated = await profileService.updateProfile(userId, {
      fullName: 'Juan Pérez García',
      phone: '5512345678',
    });
    expect(updated.fullName).toBe('Juan Pérez García');
  });

  it('should NOT update email', async () => {
    await expect(
      profileService.updateProfile(userId, { email: 'new@email.com' } as any)
    ).rejects.toThrow();
  });

  it('should handle photo upload', async () => {
    const result = await profileService.uploadPhoto(userId, mockFile);
    expect(result.photoUrl).toContain('/static/profile-photos/');
  });

  it('should delete old photo when uploading new one', async () => {
    await profileService.uploadPhoto(userId, mockFile1);
    const oldPhotoKey = (await getProfile(userId)).photoKey;

    await profileService.uploadPhoto(userId, mockFile2);

    expect(fs.existsSync(`/uploads/profile-photos/${oldPhotoKey}`)).toBe(false);
  });

  it('should set primary constructora', async () => {
    await profileService.setPrimaryConstructora(userId, constructoraId);

    const uc = await getUserConstructora(userId, constructoraId);
    expect(uc.isPrimary).toBe(true);

    // Solo una debe ser primary
    const allUc = await getAllUserConstructoras(userId);
    const primaryCount = allUc.filter(c => c.isPrimary).length;
    expect(primaryCount).toBe(1);
  });
});

describe('FileUploadService', () => {
  it('should validate file size (max 5MB)', async () => {
    const largeFile = createMockFile(6 * 1024 * 1024); // 6MB
    await expect(fileUploadService.validateFile(largeFile)).rejects.toThrow('File too large');
  });

  it('should validate file type (jpg, png, webp)', async () => {
    const pdfFile = createMockFile(1024, 'application/pdf');
    await expect(fileUploadService.validateFile(pdfFile)).rejects.toThrow('Invalid file type');
  });

  it('should generate unique filename', () => {
    const filename1 = fileUploadService.generateFilename(userId, 'image.jpg');
    const filename2 = fileUploadService.generateFilename(userId, 'image.jpg');
    expect(filename1).not.toBe(filename2);
  });
});

describe('ImageProcessingService', () => {
  it('should resize image to 200x200', async () => {
    const processed = await imageService.resize(mockBuffer, 200, 200);
    const metadata = await sharp(processed).metadata();
    expect(metadata.width).toBe(200);
    expect(metadata.height).toBe(200);
  });

  it('should maintain aspect ratio with cover mode', async () => {
    const processed = await imageService.resize(mockWideBuffer, 200, 200);
    const metadata = await sharp(processed).metadata();
    expect(metadata.width).toBe(200);
    expect(metadata.height).toBe(200);
  });
});
```

### Tests E2E

```typescript
// apps/backend/test/user/profile.e2e-spec.ts
describe('Profile API (E2E)', () => {
  let app: INestApplication;
  let user: User;
  let token: string;

  beforeAll(async () => {
    // Setup app
    user = await createUser();
    token = await getAuthToken(user);
  });

  describe('GET /user/profile', () => {
    it('should return user profile with constructoras', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user).toMatchObject({
        id: user.id,
        email: user.email,
        fullName: expect.any(String),
      });

      expect(response.body.constructoras).toBeArray();
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/user/profile')
        .expect(401);
    });
  });

  describe('PATCH /user/profile', () => {
    it('should update fullName and phone', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Juan Pérez Actualizado',
          phone: '5512345678',
        })
        .expect(200);

      expect(response.body.fullName).toBe('Juan Pérez Actualizado');
      expect(response.body.phone).toBe('5512345678');
    });

    it('should reject invalid phone format', async () => {
      await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '123' }) // Muy corto
        .expect(400);
    });

    it('should not allow email change', async () => {
      await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'new@email.com' })
        .expect(400);
    });
  });

  describe('POST /user/profile/photo', () => {
    it('should upload photo successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/profile/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', './test/fixtures/avatar.jpg')
        .expect(201);

      expect(response.body.photoUrl).toMatch(/\/static\/profile-photos\/.+\.jpg$/);
    });

    it('should reject file larger than 5MB', async () => {
      await request(app.getHttpServer())
        .post('/user/profile/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', './test/fixtures/large-image.jpg') // 6MB
        .expect(400);
    });

    it('should reject non-image files', async () => {
      await request(app.getHttpServer())
        .post('/user/profile/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', './test/fixtures/document.pdf')
        .expect(400);
    });
  });

  describe('DELETE /user/profile/photo', () => {
    it('should delete photo and revert to default', async () => {
      // Upload first
      await request(app.getHttpServer())
        .post('/user/profile/photo')
        .set('Authorization', `Bearer ${token}`)
        .attach('photo', './test/fixtures/avatar.jpg');

      // Then delete
      const response = await request(app.getHttpServer())
        .delete('/user/profile/photo')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verify photo is null
      const profile = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profile.body.user.photoUrl).toBeNull();
    });
  });
});
```

### Tests Frontend

```typescript
// apps/frontend/src/features/profile/ProfileEditForm.spec.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileEditForm } from './ProfileEditForm';

describe('ProfileEditForm', () => {
  const mockProfile = {
    id: '123',
    email: 'user@test.com',
    fullName: 'Juan Pérez',
    phone: '5512345678',
  };

  it('renders current user data', () => {
    render(<ProfileEditForm profile={mockProfile} onSave={jest.fn()} />);

    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5512345678')).toBeInTheDocument();
  });

  it('submits updated data on save', async () => {
    const onSave = jest.fn();
    render(<ProfileEditForm profile={mockProfile} onSave={onSave} />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez García' } });

    const saveButton = screen.getByText(/guardar/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        fullName: 'Juan Pérez García',
        phone: '5512345678',
      });
    });
  });

  it('shows validation errors for invalid phone', async () => {
    render(<ProfileEditForm profile={mockProfile} onSave={jest.fn()} />);

    const phoneInput = screen.getByLabelText(/teléfono/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/10 dígitos/i)).toBeInTheDocument();
    });
  });

  it('disables email field', () => {
    render(<ProfileEditForm profile={mockProfile} onSave={jest.fn()} />);

    const emailInput = screen.getByDisplayValue('user@test.com');
    expect(emailInput).toBeDisabled();
  });
});
```

---

## Estimación

**Desglose de Esfuerzo (5 SP = ~2.5 días = 20h):**
- Backend endpoints + validations: 0.5 días (4h)
- File upload + processing: 0.5 días (4h)
- Multi-tenancy (set primary): 0.25 días (2h)
- Frontend components: 0.5 días (4h)
- Photo upload UI: 0.375 días (3h)
- Testing: 0.375 días (3h)

**Riesgos:**
- ⚠️ File upload puede tener edge cases (conexión lenta, archivos corruptos)
- ⚠️ Lógica de "primary constructora" requiere cuidado (constraint unique)
- ⚠️ Cleanup de fotos antiguas debe ser robusto (no eliminar si falla upload)

**Mitigaciones:**
- ✅ Reutilizar FileUploadService y ImageProcessingService de GAMILIT
- ✅ Transacción para cambiar primary constructora
- ✅ Tests E2E exhaustivos de upload

---

## Recursos Externos

**Librerías Backend:**
- `multer` (file upload middleware para Express)
- `sharp` (procesamiento de imágenes - resize, optimize)
- `uuid` (generar nombres únicos de archivo)

**Librerías Frontend:**
- `react-dropzone` (drag & drop upload con preview)
- `react-hook-form` (manejo de formularios)
- `zod` (validación de esquemas)

**Assets:**
- Avatar placeholder SVG (si no hay foto)
- Iconos de cámara para botón de upload

---

**Creado:** 2025-11-17
**Actualizado:** 2025-11-17
**Responsable:** Equipo Fullstack
**Reutilización GAMILIT:** 75% (estructura similar, adaptar multi-tenancy)
