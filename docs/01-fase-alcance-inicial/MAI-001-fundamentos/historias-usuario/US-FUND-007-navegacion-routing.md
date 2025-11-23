# US-FUND-007: Navegación y Routing

**Epic:** MAI-001 - Fundamentos del Sistema
**Story Points:** 5
**Prioridad:** Baja
**Dependencias:**
- US-FUND-004 (Infraestructura Base)
- US-FUND-001 (Autenticación JWT)

**Estado:** Pendiente
**Asignado a:** Frontend Lead

---

## 📋 Historia de Usuario

**Como** usuario del sistema
**Quiero** navegar de forma fluida entre las diferentes secciones de la aplicación
**Para** acceder rápidamente a las funcionalidades que necesito según mi rol.

---

## 🎯 Contexto y Objetivos

### Contexto

Este documento define la estructura de navegación y routing de la aplicación frontend. Incluye:

- **Estructura de rutas** por módulo
- **Layouts** reutilizables (Auth, Dashboard)
- **Rutas protegidas** (autenticación requerida)
- **Guards por rol** (acceso basado en permisos)
- **Navegación lateral** (sidebar con menú dinámico)
- **Breadcrumbs** para orientación del usuario
- **404 y manejo de errores** de navegación

### Objetivos

1. ✅ Rutas organizadas por módulo de negocio
2. ✅ Protección de rutas que requieren autenticación
3. ✅ Restricción de rutas por rol (RBAC)
4. ✅ Sidebar dinámico según rol del usuario
5. ✅ Breadcrumbs actualizados automáticamente
6. ✅ Deep linking funcional (URLs compartibles)
7. ✅ 404 page para rutas inexistentes

---

## ✅ Criterios de Aceptación

### CA-1: Estructura de Rutas

**Dado** la aplicación frontend
**Cuando** se examinan las rutas configuradas
**Entonces**:

- ✅ Rutas públicas (no requieren auth):
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password/:token`

- ✅ Rutas protegidas (requieren auth):
  - `/dashboard`
  - `/profile`
  - `/projects`
  - `/projects/:id`
  - `/budgets`
  - `/purchases`
  - `/hr` (solo HR)
  - `/finance` (solo Finance)
  - `/post-sales` (solo Post-Sales)

---

### CA-2: Rutas Protegidas por Autenticación

**Dado** un usuario no autenticado
**Cuando** intenta acceder a `/dashboard`
**Entonces**:

- ✅ Es redirigido a `/login`
- ✅ URL de destino se guarda en query param: `/login?redirect=/dashboard`
- ✅ Después de login, es redirigido a `/dashboard`

---

### CA-3: Rutas Protegidas por Rol

**Dado** un usuario con rol `resident`
**Cuando** intenta acceder a `/budgets` (solo Director/Engineer)
**Entonces**:

- ✅ Es redirigido a `/dashboard`
- ✅ Toast muestra: "No tienes permisos para acceder a esta sección"
- ✅ No se muestra contenido de la ruta restringida

---

### CA-4: Sidebar Dinámico

**Dado** un usuario autenticado
**Cuando** visualiza el sidebar
**Entonces**:

- ✅ Solo muestra secciones permitidas para su rol
- ✅ Sección activa está resaltada
- ✅ Iconos representativos para cada sección
- ✅ Sidebar colapsable en pantallas pequeñas

**Ejemplo para rol `engineer`:**
- ✅ Dashboard ✔️
- ✅ Proyectos ✔️
- ✅ Presupuestos ✔️
- ✅ Compras ✔️
- ❌ Finanzas (oculto)
- ❌ RRHH (oculto)
- ❌ Post-venta (oculto)

---

### CA-5: Breadcrumbs

**Dado** un usuario en `/projects/123e4567-e89b-12d3-a456-426614174000`
**Cuando** visualiza los breadcrumbs
**Entonces**:

- ✅ Muestra: `Dashboard > Proyectos > Residencial Las Palmas`
- ✅ Cada nivel es clickeable (excepto el actual)
- ✅ Click en "Proyectos" navega a `/projects`
- ✅ Click en "Dashboard" navega a `/dashboard`

---

### CA-6: Deep Linking

**Dado** un usuario autenticado
**Cuando** accede directamente a `/projects/123e4567-e89b-12d3-a456-426614174000` (URL copiada)
**Entonces**:

- ✅ La página carga correctamente
- ✅ Sidebar muestra "Proyectos" como activo
- ✅ Breadcrumbs muestra la ruta completa
- ✅ Datos del proyecto se cargan desde la API

---

### CA-7: 404 Not Found

**Dado** un usuario autenticado
**Cuando** accede a `/ruta-inexistente`
**Entonces**:

- ✅ Se muestra página 404 personalizada
- ✅ Mensaje: "La página que buscas no existe"
- ✅ Botón "Ir al Dashboard" redirige a `/dashboard`
- ✅ URL en el navegador sigue siendo `/ruta-inexistente`

---

## 🔧 Especificación Técnica Detallada

### 1. Estructura de Rutas

**Archivo:** `apps/frontend/src/routes/routes.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Guards
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';

// Pages - Auth
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';

// Pages - Dashboard
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

// Pages - Projects
import { ProjectsListPage } from '@/features/projects/pages/ProjectsListPage';
import { ProjectDetailPage } from '@/features/projects/pages/ProjectDetailPage';
import { CreateProjectPage } from '@/features/projects/pages/CreateProjectPage';

// Pages - Budgets
import { BudgetsListPage } from '@/features/budgets/pages/BudgetsListPage';
import { BudgetDetailPage } from '@/features/budgets/pages/BudgetDetailPage';

// Pages - Purchases
import { PurchasesListPage } from '@/features/purchases/pages/PurchasesListPage';
import { SuppliersPage } from '@/features/purchases/pages/SuppliersPage';

// Pages - HR
import { HrDashboardPage } from '@/features/hr/pages/HrDashboardPage';
import { EmployeesPage } from '@/features/hr/pages/EmployeesPage';
import { AttendancePage } from '@/features/hr/pages/AttendancePage';

// Pages - Finance
import { FinanceDashboardPage } from '@/features/finance/pages/FinanceDashboardPage';
import { CashFlowPage } from '@/features/finance/pages/CashFlowPage';

// Pages - Post-Sales
import { PostSalesDashboardPage } from '@/features/post-sales/pages/PostSalesDashboardPage';
import { WarrantiesPage } from '@/features/post-sales/pages/WarrantiesPage';

// Pages - Errors
import { NotFoundPage } from '@/features/errors/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* ==================== PROTECTED ROUTES ==================== */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - Todos los roles */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Projects - Director, Engineer, Resident */}
        <Route
          path="/projects"
          element={
            <RoleGuard allowedRoles={['director', 'engineer', 'resident']}>
              <ProjectsListPage />
            </RoleGuard>
          }
        />
        <Route
          path="/projects/new"
          element={
            <RoleGuard allowedRoles={['director']}>
              <CreateProjectPage />
            </RoleGuard>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <RoleGuard allowedRoles={['director', 'engineer', 'resident']}>
              <ProjectDetailPage />
            </RoleGuard>
          }
        />

        {/* Budgets - Director, Engineer */}
        <Route
          path="/budgets"
          element={
            <RoleGuard allowedRoles={['director', 'engineer']}>
              <BudgetsListPage />
            </RoleGuard>
          }
        />
        <Route
          path="/budgets/:id"
          element={
            <RoleGuard allowedRoles={['director', 'engineer']}>
              <BudgetDetailPage />
            </RoleGuard>
          }
        />

        {/* Purchases - Director, Engineer, Purchases */}
        <Route
          path="/purchases"
          element={
            <RoleGuard allowedRoles={['director', 'engineer', 'purchases']}>
              <PurchasesListPage />
            </RoleGuard>
          }
        />
        <Route
          path="/suppliers"
          element={
            <RoleGuard allowedRoles={['director', 'purchases']}>
              <SuppliersPage />
            </RoleGuard>
          }
        />

        {/* HR - Director, HR */}
        <Route
          path="/hr"
          element={
            <RoleGuard allowedRoles={['director', 'hr']}>
              <HrDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <RoleGuard allowedRoles={['director', 'hr']}>
              <EmployeesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <RoleGuard allowedRoles={['director', 'hr']}>
              <AttendancePage />
            </RoleGuard>
          }
        />

        {/* Finance - Director, Finance */}
        <Route
          path="/finance"
          element={
            <RoleGuard allowedRoles={['director', 'finance']}>
              <FinanceDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/finance/cash-flow"
          element={
            <RoleGuard allowedRoles={['director', 'finance']}>
              <CashFlowPage />
            </RoleGuard>
          }
        />

        {/* Post-Sales - Director, Post-Sales */}
        <Route
          path="/post-sales"
          element={
            <RoleGuard allowedRoles={['director', 'post_sales']}>
              <PostSalesDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/post-sales/warranties"
          element={
            <RoleGuard allowedRoles={['director', 'post_sales']}>
              <WarrantiesPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* ==================== REDIRECTS ==================== */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ==================== 404 NOT FOUND ==================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

---

### 2. Protected Route Guard

**Archivo:** `apps/frontend/src/components/guards/ProtectedRoute.tsx`

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir a login con URL de retorno
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
}
```

---

### 3. Role Guard

**Archivo:** `apps/frontend/src/components/guards/RoleGuard.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      toast.error('No tienes permisos para acceder a esta sección');
    }
  }, [user, allowedRoles]);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
```

---

### 4. Dashboard Layout con Sidebar

**Archivo:** `apps/frontend/src/components/layout/DashboardLayout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        <div className="border-b bg-white px-6 py-3">
          <Breadcrumbs />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

### 5. Sidebar con Menú Dinámico

**Archivo:** `apps/frontend/src/components/layout/Sidebar.tsx`

```typescript
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  ShoppingCart,
  Users,
  DollarSign,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  allowedRoles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['director', 'engineer', 'resident', 'purchases', 'finance', 'hr', 'post_sales'],
  },
  {
    label: 'Proyectos',
    path: '/projects',
    icon: FolderKanban,
    allowedRoles: ['director', 'engineer', 'resident'],
  },
  {
    label: 'Presupuestos',
    path: '/budgets',
    icon: FileText,
    allowedRoles: ['director', 'engineer'],
  },
  {
    label: 'Compras',
    path: '/purchases',
    icon: ShoppingCart,
    allowedRoles: ['director', 'engineer', 'purchases'],
  },
  {
    label: 'RRHH',
    path: '/hr',
    icon: Users,
    allowedRoles: ['director', 'hr'],
  },
  {
    label: 'Finanzas',
    path: '/finance',
    icon: DollarSign,
    allowedRoles: ['director', 'finance'],
  },
  {
    label: 'Post-venta',
    path: '/post-sales',
    icon: Headphones,
    allowedRoles: ['director', 'post_sales'],
  },
];

export function Sidebar() {
  const { user } = useAuthStore();

  // Filtrar menú según rol
  const visibleItems = menuItems.filter((item) =>
    item.allowedRoles.includes(user?.role || ''),
  );

  return (
    <aside className="w-64 border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">Gestión de Obra</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

---

### 6. Breadcrumbs Component

**Archivo:** `apps/frontend/src/components/layout/Breadcrumbs.tsx`

```typescript
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useMemo } from 'react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

// Mapa de rutas a labels
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Proyectos',
  budgets: 'Presupuestos',
  purchases: 'Compras',
  suppliers: 'Proveedores',
  hr: 'RRHH',
  employees: 'Empleados',
  attendance: 'Asistencias',
  finance: 'Finanzas',
  'cash-flow': 'Flujo de Caja',
  'post-sales': 'Post-venta',
  warranties: 'Garantías',
  profile: 'Mi Perfil',
  new: 'Nuevo',
};

export function Breadcrumbs() {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);

    const items: BreadcrumbItem[] = [];
    let currentPath = '';

    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Si es un UUID, obtener nombre del recurso (requiere data del contexto)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment,
      );

      if (isUUID) {
        // TODO: Obtener nombre real del recurso desde el store o API
        items.push({
          label: 'Detalles',
          path: currentPath,
        });
      } else {
        items.push({
          label: routeLabels[segment] || segment,
          path: currentPath,
        });
      }
    });

    return items;
  }, [location.pathname]);

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span>Inicio</span>
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={item.path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            {isLast ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
```

---

### 7. 404 Not Found Page

**Archivo:** `apps/frontend/src/features/errors/pages/NotFoundPage.tsx`

```typescript
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>

        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Página no encontrada
        </p>

        <p className="mt-2 text-gray-600">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>

          <Button onClick={() => navigate('/dashboard')}>
            <Home className="mr-2 h-4 w-4" />
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### 8. Login Redirect After Auth

**Archivo:** `apps/frontend/src/features/auth/pages/LoginPage.tsx` (fragmento)

```typescript
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens } = useAuthStore();

  const handleLogin = async (credentials: LoginDto) => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);

      setTokens(response.accessToken, response.refreshToken);

      // Redirigir a la URL original o al dashboard
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      navigate(redirectUrl);

      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Credenciales inválidas');
    }
  };

  return (
    // ... form
  );
}
```

---

## 🧪 Test Cases

### TC-NAV-001: Redirección a Login

**Pre-condiciones:**
- Usuario no autenticado

**Pasos:**
1. Navegar a `/dashboard`

**Resultado esperado:**
- ✅ Redirige a `/login?redirect=/dashboard`
- ✅ No se muestra contenido del dashboard

---

### TC-NAV-002: Login con Redirect

**Pre-condiciones:**
- Usuario en `/login?redirect=/projects/123`

**Pasos:**
1. Completar login exitoso

**Resultado esperado:**
- ✅ Redirige a `/projects/123`
- ✅ Página de proyecto carga correctamente

---

### TC-NAV-003: Restricción por Rol

**Pre-condiciones:**
- Usuario con rol `resident` autenticado

**Pasos:**
1. Navegar a `/budgets` (solo Director/Engineer)

**Resultado esperado:**
- ✅ Redirige a `/dashboard`
- ✅ Toast: "No tienes permisos para acceder a esta sección"

---

### TC-NAV-004: Sidebar Dinámico

**Pre-condiciones:**
- Usuario con rol `engineer` autenticado

**Pasos:**
1. Observar el sidebar

**Resultado esperado:**
- ✅ Visible: Dashboard, Proyectos, Presupuestos, Compras
- ❌ Oculto: RRHH, Finanzas, Post-venta

---

### TC-NAV-005: Navegación Activa

**Pre-condiciones:**
- Usuario en `/projects`

**Pasos:**
1. Observar el sidebar

**Resultado esperado:**
- ✅ Item "Proyectos" resaltado con bg-primary
- ✅ Otros items con estilo normal

---

### TC-NAV-006: Breadcrumbs

**Pre-condiciones:**
- Usuario en `/projects/123/budgets/456`

**Pasos:**
1. Observar breadcrumbs

**Resultado esperado:**
- ✅ Muestra: `Inicio > Proyectos > Detalles > Presupuestos > Detalles`
- ✅ "Inicio" clickeable → navega a `/dashboard`
- ✅ "Proyectos" clickeable → navega a `/projects`
- ✅ Último elemento NO clickeable (activo)

---

### TC-NAV-007: 404 Page

**Pre-condiciones:**
- Usuario autenticado

**Pasos:**
1. Navegar a `/ruta-que-no-existe`

**Resultado esperado:**
- ✅ Se muestra página 404
- ✅ Título: "404"
- ✅ Botón "Volver atrás" navega a página anterior
- ✅ Botón "Ir al Dashboard" navega a `/dashboard`

---

## 📋 Tareas de Implementación

### Frontend

- [ ] **NAV-FE-001:** Configurar React Router v6
  - Estimado: 1h

- [ ] **NAV-FE-002:** Crear archivo de rutas (routes.tsx)
  - Estimado: 2h

- [ ] **NAV-FE-003:** Implementar ProtectedRoute guard
  - Estimado: 1h

- [ ] **NAV-FE-004:** Implementar RoleGuard
  - Estimado: 1.5h

- [ ] **NAV-FE-005:** Crear DashboardLayout con sidebar
  - Estimado: 2h

- [ ] **NAV-FE-006:** Crear AuthLayout
  - Estimado: 1h

- [ ] **NAV-FE-007:** Implementar Sidebar con menú dinámico
  - Estimado: 2h

- [ ] **NAV-FE-008:** Implementar Breadcrumbs component
  - Estimado: 2h

- [ ] **NAV-FE-009:** Crear NotFoundPage
  - Estimado: 1h

- [ ] **NAV-FE-010:** Implementar redirect después de login
  - Estimado: 1h

### Testing

- [ ] **NAV-TEST-001:** Unit tests para guards
  - Estimado: 2h

- [ ] **NAV-TEST-002:** E2E tests para navegación
  - Estimado: 2h

**Total estimado:** ~18.5 horas

---

## 🔗 Dependencias

### Depende de

- ✅ US-FUND-004 (Infraestructura Base)
- ✅ US-FUND-001 (Autenticación JWT)

### Bloqueante para

- Todas las páginas y features del sistema
- UX completa

---

## 📊 Definición de Hecho (DoD)

- ✅ React Router v6 configurado
- ✅ Rutas públicas y protegidas definidas
- ✅ ProtectedRoute guard funcional
- ✅ RoleGuard funcional
- ✅ Sidebar muestra menú dinámico según rol
- ✅ Breadcrumbs actualizados automáticamente
- ✅ 404 page implementada
- ✅ Deep linking funcional
- ✅ Redirect después de login funcional
- ✅ Todos los test cases (TC-NAV-001 a TC-NAV-007) pasan
- ✅ Navegación fluida sin flickering

---

## 📝 Notas Adicionales

### Mobile Responsive

- ✅ Sidebar colapsable en pantallas < 768px
- ✅ Menú hamburguesa en mobile
- ✅ Breadcrumbs ocultos en mobile (opcional)

### Accesibilidad

- ✅ Navegación con teclado (Tab, Enter)
- ✅ ARIA labels en links
- ✅ Focus visible en elementos

### Performance

- ✅ Lazy loading de páginas con React.lazy()
- ✅ Code splitting por ruta
- ✅ Suspense boundaries para cargas asíncronas

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
