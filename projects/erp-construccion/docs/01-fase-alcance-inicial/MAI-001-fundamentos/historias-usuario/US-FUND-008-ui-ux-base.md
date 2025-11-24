# US-FUND-008: UI/UX Base y Sistema de Diseño

**Epic:** MAI-001 - Fundamentos del Sistema
**Story Points:** 3
**Prioridad:** Baja
**Dependencias:**
- US-FUND-004 (Infraestructura Base)

**Estado:** Pendiente
**Asignado a:** Frontend Lead + UI/UX Designer

---

## 📋 Historia de Usuario

**Como** usuario del sistema
**Quiero** una interfaz intuitiva, consistente y visualmente atractiva
**Para** navegar y trabajar de forma eficiente en la plataforma de gestión de obra.

---

## 🎯 Contexto y Objetivos

### Contexto

Este documento define el sistema de diseño base de la aplicación. Incluye:

- **Paleta de colores** (primary, secondary, neutrals)
- **Tipografía** (fuentes, tamaños, weights)
- **Espaciado y grid** (sistema de 8px)
- **Componentes reutilizables** (Button, Input, Card, etc.)
- **Estados de carga** (Skeletons, Spinners)
- **Estados vacíos** (Empty States)
- **Notificaciones** (Toasts, Alerts)
- **Responsive design** (mobile-first)

### Objetivos

1. ✅ Diseño consistente en toda la aplicación
2. ✅ Componentes reutilizables para acelerar desarrollo
3. ✅ Paleta de colores definida y documentada
4. ✅ Tipografía clara y legible
5. ✅ Estados de loading bien definidos
6. ✅ Responsive en desktop, tablet y mobile
7. ✅ Accesible (WCAG 2.1 AA)

---

## ✅ Criterios de Aceptación

### CA-1: Paleta de Colores

**Dado** la aplicación en ejecución
**Cuando** se visualizan componentes
**Entonces**:

- ✅ Color primario (construcción/obra):
  - Primary: `#E97A20` (naranja construcción)
  - Primary Hover: `#D46B17`
  - Primary Light: `#FFF4E6`

- ✅ Colores de estado:
  - Success: `#10B981` (verde)
  - Warning: `#F59E0B` (amarillo)
  - Error: `#EF4444` (rojo)
  - Info: `#3B82F6` (azul)

- ✅ Colores neutrales:
  - Gray-50 a Gray-900 (escala de grises)

---

### CA-2: Tipografía

**Dado** cualquier página de la aplicación
**Cuando** se visualiza texto
**Entonces**:

- ✅ Fuente principal: `Inter` (Google Fonts)
- ✅ Fallback: `system-ui, -apple-system, sans-serif`
- ✅ Tamaños de texto:
  - `text-xs`: 12px
  - `text-sm`: 14px
  - `text-base`: 16px
  - `text-lg`: 18px
  - `text-xl`: 20px
  - `text-2xl`: 24px
  - `text-3xl`: 30px
  - `text-4xl`: 36px

- ✅ Pesos (weights):
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

---

### CA-3: Componentes Reutilizables

**Dado** el sistema de componentes
**Cuando** se utiliza en cualquier página
**Entonces** están disponibles:

- ✅ **Button** (variants: primary, secondary, outline, ghost, destructive)
- ✅ **Input** (text, email, password, number)
- ✅ **Select** (dropdown)
- ✅ **Checkbox** y **Radio**
- ✅ **Card** (contenedor con sombra)
- ✅ **Badge** (etiquetas de estado)
- ✅ **Table** (tablas de datos)
- ✅ **Modal/Dialog**
- ✅ **Dropdown Menu**
- ✅ **Tabs**
- ✅ **Tooltip**

---

### CA-4: Estados de Loading

**Dado** una operación asíncrona en ejecución
**Cuando** se están cargando datos
**Entonces**:

- ✅ Botones muestran spinner cuando están en loading
- ✅ Listas muestran skeleton loaders
- ✅ Páginas completas muestran spinner centrado
- ✅ No se permiten doble-clicks durante loading

---

### CA-5: Estados Vacíos

**Dado** una lista sin datos
**Cuando** se visualiza la página
**Entonces**:

- ✅ Se muestra ilustración o icono grande
- ✅ Mensaje descriptivo: "No hay proyectos todavía"
- ✅ Call-to-action: Botón "Crear Proyecto"
- ✅ No se muestra tabla/grid vacío

---

### CA-6: Notificaciones (Toasts)

**Dado** una acción exitosa/fallida
**Cuando** se completa
**Entonces**:

- ✅ Toast aparece en top-right
- ✅ Auto-dismiss después de 5 segundos
- ✅ Se puede cerrar manualmente (X)
- ✅ Iconos según tipo (success: ✓, error: ✗, warning: ⚠, info: ℹ)
- ✅ Colores según tipo

---

### CA-7: Responsive Design

**Dado** la aplicación en diferentes dispositivos
**Cuando** se ajusta el viewport
**Entonces**:

- ✅ Desktop (≥1024px):
  - Sidebar visible
  - Grid de 12 columnas
  - Tablas completas

- ✅ Tablet (768px - 1023px):
  - Sidebar colapsable
  - Grid de 8 columnas
  - Tablas con scroll horizontal

- ✅ Mobile (<768px):
  - Sidebar como menú hamburguesa
  - Grid de 4 columnas
  - Tablas adaptadas (cards)
  - Inputs full-width

---

## 🔧 Especificación Técnica Detallada

### 1. Tailwind Configuration

**Archivo:** `apps/frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#E97A20',
          foreground: '#FFFFFF',
          hover: '#D46B17',
          light: '#FFF4E6',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        error: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

### 2. CSS Variables

**Archivo:** `apps/frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}
```

---

### 3. Button Component (shadcn/ui)

**Archivo:** `apps/frontend/src/components/ui/button.tsx`

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Uso:**

```typescript
<Button>Default Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>
<Button loading>Guardando...</Button>
```

---

### 4. Card Component

**Archivo:** `apps/frontend/src/components/ui/card.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**Uso:**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Proyecto Residencial</CardTitle>
    <CardDescription>150 unidades habitacionales</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenido del proyecto...</p>
  </CardContent>
  <CardFooter>
    <Button>Ver Detalles</Button>
  </CardFooter>
</Card>
```

---

### 5. Skeleton Loader

**Archivo:** `apps/frontend/src/components/ui/skeleton.tsx`

```typescript
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export { Skeleton };
```

**Archivo:** `apps/frontend/src/components/skeletons/ProjectCardSkeleton.tsx`

```typescript
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
```

**Uso:**

```typescript
{isLoading ? (
  <ProjectCardSkeleton />
) : (
  <ProjectCard project={project} />
)}
```

---

### 6. Empty State Component

**Archivo:** `apps/frontend/src/components/ui/empty-state.tsx`

```typescript
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>

      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}

      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

**Uso:**

```typescript
import { FolderKanban } from 'lucide-react';

{projects.length === 0 && (
  <EmptyState
    icon={FolderKanban}
    title="No hay proyectos todavía"
    description="Comienza creando tu primer proyecto de construcción"
    action={{
      label: 'Crear Proyecto',
      onClick: () => navigate('/projects/new'),
    }}
  />
)}
```

---

### 7. Toast Notifications (Sonner)

**Instalación:**

```bash
npm install sonner
```

**Configuración en App.tsx:**

```typescript
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* App content */}
      <Toaster position="top-right" richColors />
    </>
  );
}
```

**Uso:**

```typescript
import { toast } from 'sonner';

// Success
toast.success('Proyecto creado exitosamente');

// Error
toast.error('Error al guardar los cambios');

// Warning
toast.warning('El presupuesto excede el límite');

// Info
toast.info('Nuevo comentario en el proyecto');

// Loading
const toastId = toast.loading('Guardando cambios...');
// ... después de completar
toast.success('Cambios guardados', { id: toastId });

// Con acción
toast.success('Proyecto actualizado', {
  action: {
    label: 'Ver',
    onClick: () => navigate(`/projects/${id}`),
  },
});
```

---

### 8. Badge Component

**Archivo:** `apps/frontend/src/components/ui/badge.tsx`

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        error: 'border-transparent bg-error text-error-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

**Uso para estados de proyecto:**

```typescript
const statusBadgeVariant = {
  planning: 'secondary',
  active: 'success',
  completed: 'default',
  cancelled: 'error',
};

<Badge variant={statusBadgeVariant[project.status]}>
  {project.status}
</Badge>
```

---

### 9. Confirmation Dialog Component

**Archivo:** `apps/frontend/src/components/ui/confirmation-dialog.tsx`

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  variant = 'default',
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-error hover:bg-error/90' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Uso:**

```typescript
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

<ConfirmationDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  title="¿Eliminar proyecto?"
  description="Esta acción no se puede deshacer. El proyecto será eliminado permanentemente."
  confirmLabel="Eliminar"
  cancelLabel="Cancelar"
  variant="destructive"
  onConfirm={async () => {
    await deleteProject(projectId);
    toast.success('Proyecto eliminado');
  }}
/>
```

---

## 🧪 Test Cases

### TC-UI-001: Botones con Loading

**Pasos:**
1. Click en botón "Guardar"
2. Observar estado durante request

**Resultado esperado:**
- ✅ Botón muestra spinner
- ✅ Botón está deshabilitado
- ✅ Texto cambia a "Guardando..."
- ✅ Doble-click no ejecuta acción dos veces

---

### TC-UI-002: Empty State

**Pasos:**
1. Navegar a `/projects` sin proyectos creados

**Resultado esperado:**
- ✅ Se muestra icono de carpeta grande
- ✅ Título: "No hay proyectos todavía"
- ✅ Descripción visible
- ✅ Botón "Crear Proyecto" presente

---

### TC-UI-003: Toast Notifications

**Pasos:**
1. Crear un proyecto exitosamente
2. Observar notificación

**Resultado esperado:**
- ✅ Toast aparece en top-right
- ✅ Color verde (success)
- ✅ Icono de checkmark
- ✅ Auto-dismiss después de 5 segundos
- ✅ Se puede cerrar manualmente

---

### TC-UI-004: Responsive Design

**Pasos:**
1. Abrir app en desktop (1920px)
2. Reducir viewport a tablet (768px)
3. Reducir viewport a mobile (375px)

**Resultado esperado:**
- ✅ Desktop: Sidebar visible, grid 12 columnas
- ✅ Tablet: Sidebar colapsable, grid 8 columnas
- ✅ Mobile: Menú hamburguesa, grid 4 columnas

---

### TC-UI-005: Skeleton Loaders

**Pasos:**
1. Navegar a `/projects`
2. Observar durante carga

**Resultado esperado:**
- ✅ Se muestran 3 skeletons de cards
- ✅ Animación de pulse
- ✅ Una vez cargados, se reemplazan por cards reales

---

## 📋 Tareas de Implementación

### Frontend

- [ ] **UI-FE-001:** Configurar Tailwind CSS con theme custom
  - Estimado: 1h

- [ ] **UI-FE-002:** Instalar y configurar shadcn/ui
  - Estimado: 1h

- [ ] **UI-FE-003:** Crear componentes base (Button, Input, Card)
  - Estimado: 2h

- [ ] **UI-FE-004:** Crear Skeleton loaders para cards y tablas
  - Estimado: 1.5h

- [ ] **UI-FE-005:** Crear EmptyState component
  - Estimado: 1h

- [ ] **UI-FE-006:** Configurar Sonner para toasts
  - Estimado: 0.5h

- [ ] **UI-FE-007:** Crear Badge component con variants
  - Estimado: 0.5h

- [ ] **UI-FE-008:** Crear ConfirmationDialog component
  - Estimado: 1h

- [ ] **UI-FE-009:** Documentar sistema de diseño en Storybook (opcional)
  - Estimado: 3h

### Design

- [ ] **UI-DESIGN-001:** Definir paleta de colores final
  - Estimado: 2h

- [ ] **UI-DESIGN-002:** Crear design tokens en Figma
  - Estimado: 2h

**Total estimado:** ~15.5 horas

---

## 🔗 Dependencias

### Depende de

- ✅ US-FUND-004 (Infraestructura Base)

### Bloqueante para

- Todas las páginas y features del sistema
- UX completa

---

## 📊 Definición de Hecho (DoD)

- ✅ Tailwind configurado con paleta de colores
- ✅ Componentes base instalados (shadcn/ui)
- ✅ Button component con loading state
- ✅ Card component funcional
- ✅ Skeleton loaders implementados
- ✅ EmptyState component reutilizable
- ✅ Toasts configurados (Sonner)
- ✅ Badge component con variants
- ✅ ConfirmationDialog funcional
- ✅ Responsive en desktop, tablet, mobile
- ✅ Todos los test cases (TC-UI-001 a TC-UI-005) pasan

---

## 📝 Notas Adicionales

### Accesibilidad

- ✅ Contraste de colores WCAG AA (4.5:1)
- ✅ Focus visible en todos los elementos interactivos
- ✅ ARIA labels en iconos
- ✅ Keyboard navigation funcional

### Dark Mode (Opcional)

- ✅ CSS variables preparadas para dark mode
- ✅ Toggle en user settings
- ✅ Persistencia en localStorage

### Icons

- ✅ Librería: Lucide React
- ✅ Tamaños estándar: 16px, 20px, 24px
- ✅ Stroke width: 2px

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
