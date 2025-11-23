# Glosario de Términos - ERP Construcción SaaS

**Versión:** 2.0 SaaS
**Fecha:** 2025-11-17
**Propósito:** Unificar terminología entre documentación técnica, negocio y código

---

## 🎯 Términos Clave

### Multi-tenancy Concepts

#### Tenant (Término Técnico SaaS)

**Definición:**
Entidad de aislamiento lógico en una arquitectura SaaS multi-tenant. En nuestro sistema, **tenant = constructora**.

**Uso:**
- **Documentación técnica:** Usar cuando se habla de arquitectura SaaS genérica
- **Código:** Usar en nombres de variables/funciones cuando el contexto es claro
- **Comunicación con clientes:** ❌ Evitar, usar "constructora" en su lugar

**Sinónimos:**
- Constructora (término de negocio)
- Cliente (en contexto de suscripción SaaS)
- Empresa (en contexto general)

**Ejemplos:**
```typescript
// ✅ Aceptable en código técnico
interface TenantConfig {
  id: string;
  plan: SubscriptionPlan;
}

// ✅ Mejor para dominio de negocio
interface ConstructoraConfig {
  id: string;
  plan: SubscriptionPlan;
}
```

---

#### Constructora (Término de Negocio)

**Definición:**
Empresa de construcción que es cliente del sistema SaaS. Es el equivalente de "tenant" en el dominio de negocio.

**Uso:**
- **Documentación de negocio:** Usar siempre
- **Comunicación con usuarios:** Usar siempre
- **Base de datos:** Tabla `constructoras.constructoras`
- **API:** Endpoint `/api/constructoras`

**Atributos principales:**
- `id` (UUID): Identificador único
- `nombre`: Nombre comercial (ej: "Constructora ABC")
- `razon_social`: Razón social legal
- `rfc`: Registro Federal de Contribuyentes (México)
- `subdomain`: Subdominio asignado (ej: "constructora-abc")
- `plan`: Plan de suscripción (Básico, Profesional, Enterprise)

**Ejemplos:**
```sql
-- ✅ Tabla en BD
CREATE TABLE constructoras.constructoras (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE
);
```

```typescript
// ✅ En servicios de negocio
export class ConstructoraService {
  async findBySubdomain(subdomain: string): Promise<Constructora> {
    // ...
  }
}
```

**Relación con usuarios:**
- Un usuario puede pertenecer a múltiples constructoras
- La relación se gestiona en `auth_management.user_constructoras`
- Cada relación tiene un rol específico (director, engineer, resident, etc.)

---

### Modelo de Aislamiento

#### Row-Level Security (RLS)

**Definición:**
Mecanismo de PostgreSQL que aplica políticas de seguridad a nivel de fila para aislar datos entre constructoras.

**Funcionamiento:**
1. Cada tabla multi-tenant tiene columna `constructora_id`
2. Se configuran RLS policies que filtran por `constructora_id`
3. El contexto se establece por sesión: `app.current_constructora_id`
4. PostgreSQL aplica automáticamente las políticas

**Ventajas:**
- ✅ Aislamiento lógico robusto
- ✅ Escalabilidad ilimitada
- ✅ Migraciones simples
- ✅ Reutilización de código GAMILIT (90%)

**Ejemplo:**
```sql
-- Política RLS en tabla projects
CREATE POLICY "projects_select_own_constructora"
ON projects.projects
FOR SELECT
TO authenticated
USING (
  constructora_id::text = current_setting('app.current_constructora_id', true)
);
```

```typescript
// Establecer contexto al inicio del request
await dataSource.query(`
  SELECT set_config('app.current_constructora_id', $1, true)
`, [constructoraId]);
```

---

#### Columna Discriminadora

**Definición:**
Columna `constructora_id` (tipo UUID) presente en todas las tablas que contienen datos específicos de una constructora.

**Uso:**
- **Foreign Key:** Apunta a `constructoras.constructoras(id)`
- **Indexada:** Para performance en queries filtrados
- **NOT NULL:** En tablas multi-tenant
- **Nullable:** En tablas compartidas (catálogos globales)

**Tablas con discriminador:**
```sql
-- Ejemplos
projects.projects.constructora_id
budgets.budgets.constructora_id
purchases.purchase_orders.constructora_id
hr.employees.constructora_id
auth_management.profiles.constructora_id
```

**Tablas SIN discriminador (compartidas):**
```sql
-- Catálogos globales
public.countries
public.currencies
public.units_of_measure
```

---

### Roles y Permisos

#### Roles de Construcción

**Definición:**
7 roles específicos del dominio de construcción, definidos en ENUM `construction_role`.

**Lista completa:**
1. **`director`**: Director general/proyectos
2. **`engineer`**: Ingeniero de planeación/control
3. **`resident`**: Residente de obra/supervisor
4. **`purchases`**: Compras/almacén
5. **`finance`**: Administración/finanzas
6. **`hr`**: Recursos humanos
7. **`post_sales`**: Postventa/garantías

**Uso en RLS:**
```sql
CREATE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_role', true);
END;
$$ LANGUAGE plpgsql STABLE;

-- Política que considera el rol
CREATE POLICY "budgets_directors_see_margins"
ON budgets.budgets
FOR SELECT
TO authenticated
USING (
  constructora_id::text = current_setting('app.current_constructora_id', true)
  AND (
    get_current_user_role() IN ('director', 'finance')
    OR hide_margins = false
  )
);
```

---

#### Relación Usuario-Constructora

**Definición:**
Asociación many-to-many entre usuarios y constructoras, gestionada en `auth_management.user_constructoras`.

**Atributos:**
- `user_id`: FK a `auth_management.profiles`
- `constructora_id`: FK a `constructoras.constructoras`
- `role`: Rol del usuario en esta constructora
- `is_primary`: Si es la constructora principal del usuario
- `active`: Si la relación está activa

**Casos de uso:**
1. Usuario trabaja en múltiples constructoras
2. Cambio de rol sin perder historial
3. Desactivación temporal (sin borrado)
4. Usuario externo (consultor, auditor)

**Ejemplo:**
```typescript
// Usuario puede tener múltiples constructoras
const userConstructoras = await db.query(`
  SELECT c.*, uc.role, uc.is_primary
  FROM constructoras.constructoras c
  INNER JOIN auth_management.user_constructoras uc ON uc.constructora_id = c.id
  WHERE uc.user_id = $1 AND uc.active = true
`, [userId]);

// Usuario selecciona constructora activa al login
const switchConstructora = async (userId, constructoraId) => {
  // Validar acceso
  const hasAccess = await userHasAccessToConstructora(userId, constructoraId);
  if (!hasAccess) throw new ForbiddenException();

  // Actualizar JWT con nuevo constructoraId
  return generateJWT({ userId, constructoraId, role });
};
```

---

### Arquitectura SaaS

#### Subdominio

**Definición:**
Identificador único en formato de subdominio DNS usado para acceder a la instancia de una constructora.

**Formato:**
```
https://{subdomain}.erp-construccion.com
```

**Ejemplos:**
- `constructora-abc.erp-construccion.com`
- `viviendas-xyz.erp-construccion.com`
- `desarrollos-norte.erp-construccion.com`

**Validaciones:**
- Solo lowercase, números y guiones
- Sin espacios ni caracteres especiales
- Único en toda la plataforma
- Mínimo 3, máximo 50 caracteres

**Lookup:**
```typescript
// Resolver constructora desde subdomain
const subdomain = req.hostname.split('.')[0]; // "constructora-abc"
const constructora = await db.query(`
  SELECT * FROM constructoras.constructoras WHERE subdomain = $1
`, [subdomain]);
```

---

#### Plan de Suscripción

**Definición:**
Nivel de servicio contratado por la constructora.

**Opciones:**
1. **Básico** ($399/mes): 10 usuarios, 6 módulos core
2. **Profesional** ($799/mes): 25 usuarios, 12 módulos
3. **Enterprise** ($1,499/mes): 100 usuarios, todos los módulos (18)

**Atributos por plan:**
- Límite de usuarios
- Módulos incluidos
- Módulos disponibles como add-on
- Almacenamiento
- Nivel de soporte
- SLA de uptime

**Activación de módulos:**
```typescript
// Feature flag basado en plan
export class FeatureFlagsService {
  async isModuleEnabled(
    moduleCode: string,
    constructoraId: string
  ): Promise<boolean> {
    const constructora = await this.getConstructora(constructoraId);

    // Verificar si módulo está incluido en el plan
    const planModules = this.getModulesForPlan(constructora.plan);
    if (planModules.includes(moduleCode)) return true;

    // Verificar si está habilitado como add-on
    const addOns = await this.getActiveAddOns(constructoraId);
    return addOns.includes(moduleCode);
  }
}
```

---

### Contexto de Ejecución

#### Contexto RLS

**Definición:**
Variables de sesión PostgreSQL que almacenan el contexto del request actual para aplicar RLS policies.

**Variables principales:**
- `app.current_constructora_id`: UUID de la constructora activa
- `app.current_user_id`: UUID del usuario autenticado
- `app.current_user_role`: Rol del usuario

**Ciclo de vida:**
1. **Request inicia:** Middleware extrae `constructoraId` del JWT
2. **Contexto se establece:** `set_config()` antes de queries
3. **RLS se aplica:** PostgreSQL usa variables en policies
4. **Request termina:** Contexto se limpia automáticamente

**Implementación:**
```typescript
// Interceptor global NestJS
@Injectable()
export class SetRlsContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { constructoraId, userId, role } = request.user;

    return from(
      this.dataSource.query(`
        SELECT
          set_config('app.current_constructora_id', $1, true),
          set_config('app.current_user_id', $2, true),
          set_config('app.current_user_role', $3, true)
      `, [constructoraId, userId, role])
    ).pipe(
      switchMap(() => next.handle())
    );
  }
}
```

**Funciones helper:**
```sql
-- Obtener constructora del contexto
CREATE FUNCTION get_current_constructora_id() RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_constructora_id', true)::UUID;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

### Módulos y Features

#### Módulo

**Definición:**
Unidad funcional del sistema que puede activarse/desactivarse por constructora según su plan.

**Estructura:**
```
MAI-XXX: Módulos de Fase 1 (Alcance Inicial)
MAE-XXX: Módulos de Fase 2 (Enterprise Básico)
MAA-XXX: Módulos de Fase 3 (Avanzada con IA)
```

**Estados por constructora:**
- **Incluido:** Módulo incluido en el plan base
- **Add-on:** Disponible por pago adicional
- **No disponible:** No compatible con el plan
- **Activo:** Módulo contratado y funcional
- **Inactivo:** Módulo no habilitado

**Ejemplo:**
```yaml
# Configuración de módulo MAI-007 (RRHH)
modules:
  MAI-007:
    name: "RRHH, Asistencias y Nómina"
    plans:
      basic: addon  # Add-on $100/mes
      professional: included
      enterprise: included
    dependencies:
      - MAI-001  # Requiere Fundamentos
```

---

#### Feature Flag

**Definición:**
Bandera de configuración que habilita/deshabilita funcionalidades específicas sin necesidad de deploy.

**Niveles:**
1. **Global:** Afecta a toda la plataforma
2. **Por constructora:** Específico de un cliente
3. **Por módulo:** Asociado a un módulo
4. **Por usuario:** Experimental para usuarios específicos

**Casos de uso:**
- Gradual rollout de nuevas features
- A/B testing
- Habilitación de features enterprise
- Deprecación controlada

**Implementación:**
```typescript
// Decorador para proteger endpoint con feature flag
@Get('ai-insights')
@RequiresFeature('ai_risk_prediction')
@RequiresPlan(['enterprise'])
async getAIInsights() {
  // Solo accesible si:
  // 1. Constructora tiene plan Enterprise
  // 2. Feature flag 'ai_risk_prediction' está habilitado
}
```

---

## 📖 Conversiones Terminológicas

### De Términos Técnicos a Negocio

| Término Técnico (SaaS) | Término de Negocio (ERP) | Contexto de uso |
|------------------------|--------------------------|-----------------|
| Tenant | Constructora | Siempre en docs de negocio |
| Tenant ID | ID de Constructora | Base de datos, API |
| Multi-tenancy | Multi-empresa | Comunicación con clientes |
| Tenant isolation | Aislamiento de datos por constructora | Seguridad |
| Tenant admin | Administrador de constructora | Roles de usuario |
| Tenant provisioning | Alta de constructora | Onboarding |
| Cross-tenant access | Acceso entre constructoras | Auditoría de seguridad |
| Schema-level isolation | ❌ Ya no se usa | Arquitectura legacy |
| Row-level security (RLS) | Aislamiento por filas | Arquitectura actual |

---

### De Jerga de Construcción a Sistema

| Término de Construcción | Término en Sistema | Tabla/Módulo |
|------------------------|-------------------|--------------|
| Obra | Proyecto | `projects.projects` |
| Partida | Concepto de presupuesto | `budgets.budget_items` |
| Estimación | Estimación de obra | `estimations.estimations` |
| Cuadrilla | Cuadrilla/Equipo | `hr.crews` |
| Frente de trabajo | Frente | `construction.work_fronts` |
| Residente | Usuario con rol `resident` | Rol de sistema |
| Avance | Avance físico/financiero | `construction.progress` |
| OC (Orden de Compra) | Purchase Order | `purchases.purchase_orders` |
| Requisición | Requisición de materiales | `purchases.requisitions` |
| Tarjeta (asistencia) | Registro de asistencia | `hr.attendances` |

---

## 🔄 Migración de Términos Legacy

### Si encuentras estos términos, reemplaza:

| ❌ Término Antiguo | ✅ Término Correcto | Razón |
|-------------------|-------------------|-------|
| `tenant_schema` | `constructora_id` | Ya no usamos schemas separados |
| `tenant_001` | UUID único | IDs descriptivos cambiaron a UUIDs |
| `search_path` | Contexto RLS (`set_config`) | Cambio de arquitectura |
| `setTenantSchema()` | `setRLSContext()` | Nueva implementación |
| `TenantConnectionService` | ❌ Eliminar | Ya no se necesita |
| `schema: tenant_${id}` | ❌ Eliminar | Configuración legacy |

---

## 📝 Guías de Estilo

### En Código (TypeScript/SQL)

**✅ Preferir:**
```typescript
// Variables de dominio
const constructora = await getConstructora(id);
const constructoraId = user.constructoraId;

// Servicios
export class ConstructoraService { }

// DTOs
export class CreateConstructoraDto { }
```

**⚠️ Aceptable en contexto técnico:**
```typescript
// Cuando el contexto SaaS es claro
interface TenantConfig { }
class TenantGuard implements CanActivate { }
```

**❌ Evitar:**
```typescript
// Ambiguo o confuso
const company = ...;  // ¿Empresa cliente? ¿Empresa del sistema?
const client = ...;   // ¿Cliente del tenant? ¿Tenant mismo?
```

---

### En Documentación

**Documentación técnica (arquitectura, código):**
- ✅ Usar "tenant" cuando se habla de patrones SaaS genéricos
- ✅ Siempre aclarar: "tenant (constructora)"
- ✅ Definir en primera mención

**Documentación de negocio (requerimientos, casos de uso):**
- ✅ Usar "constructora" exclusivamente
- ❌ Evitar "tenant"
- ✅ Usar términos del dominio de construcción

**Documentación de usuario (manuales, FAQs):**
- ✅ Usar "su empresa", "su constructora"
- ❌ Nunca usar "tenant"
- ✅ Lenguaje natural y cercano

---

## 🧪 Testing y Validación

### Nomenclatura de Tests

**✅ Tests de RLS:**
```typescript
describe('RLS Isolation - Constructora', () => {
  it('should prevent cross-constructora data access', () => {
    // ...
  });

  it('should allow multi-constructora user to switch context', () => {
    // ...
  });
});
```

**✅ Tests de autorización:**
```typescript
describe('ConstructoraGuard', () => {
  it('should deny access if user does not belong to constructora', () => {
    // ...
  });
});
```

---

## 📚 Referencias

**Documentos relacionados:**
- [ARQUITECTURA-SAAS.md](./ARQUITECTURA-SAAS.md) - Arquitectura SaaS completa
- [RF-AUTH-003-multi-tenancy.md](../01-fase-alcance-inicial/MAI-001-fundamentos/requerimientos/RF-AUTH-003-multi-tenancy.md) - Especificación de multi-tenancy
- [TRACEABILITY.yml](../01-fase-alcance-inicial/MAI-001-fundamentos/implementacion/TRACEABILITY.yml) - Trazabilidad de implementación

**Decisiones arquitectónicas:**
- **2025-11-17:** Adopción de Row-Level Security (RLS) en lugar de schema-level isolation
  - Razón: Escalabilidad ilimitada, migraciones simples, 90% de reutilización de GAMILIT
  - Impacto: Cambio de `tenant_XXX` schemas a `constructora_id` discriminador

---

**Generado:** 2025-11-17
**Versión:** 2.0 SaaS
**Mantenedores:** @tech-lead @documentation-team
