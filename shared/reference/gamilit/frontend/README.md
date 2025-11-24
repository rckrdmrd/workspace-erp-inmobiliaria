# GAMILIT Frontend

Frontend para la plataforma educativa gamificada GAMILIT.

## Stack Técnico

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.1.10
- **Language:** TypeScript 5.9.3 (strict mode)
- **Styling:** Tailwind CSS 4.1.14
- **Router:** React Router DOM 7.9.4
- **State Management:** Zustand 5.0.8
- **Forms:** React Hook Form 7.65.0 + Zod 4.1.12
- **HTTP Client:** Axios 1.12.2
- **WebSocket:** Socket.io Client 4.8.1
- **Icons:** Lucide React 0.545.0
- **Animations:** Framer Motion 12.23.24
- **Charts:** Recharts 3.3.0
- **Testing:** Vitest + React Testing Library
- **Storybook:** 7+ (configurado)

## Arquitectura

Feature-Sliced Design (FSD)

```
src/
├── shared/                 # Código compartido (68 hooks, components reutilizables)
├── services/               # API clients (11 servicios), WebSocket
├── app/                    # Providers (AuthContext, layouts, routing)
│   ├── providers/          # AuthContext, ThemeProvider
│   ├── layouts/            # Layouts de aplicación
│   └── routes/             # Configuración de rutas (18 rutas)
├── features/               # Features de negocio (10 features)
│   ├── auth/               # Autenticación (16 componentes, 5 hooks)
│   ├── gamification/       # Gamificación (74 componentes, 15 hooks)
│   └── mechanics/          # Mecánicas educativas (33 tipos implementados)
└── apps/                   # Aplicaciones (student, teacher, admin)
    └── student/pages/      # 28 páginas implementadas
```

## Rutas Implementadas (React Router v7.9.4)

### Públicas (5 rutas)
- `/login` - Login de usuarios
- `/register` - Registro de usuarios
- `/forgot-password` - Recuperación de contraseña
- `/reset-password` - Reset de contraseña
- `/verify-email` - Verificación de email

### Protegidas (13 rutas)
- `/` - Redirect a dashboard
- `/dashboard` - Dashboard principal del estudiante
- `/progress` - Progreso del estudiante
- `/modules/:moduleId` - Detalle de módulo educativo
- `/exercises/:exerciseId` - Ejercicio individual
- `/achievements` - Logros del estudiante
- `/leaderboard` - Tabla de clasificación
- `/missions` - Misiones diarias/semanales
- `/profile` - Perfil del usuario
- `/settings` - Configuración
- `/friends` - Lista de amigos
- `/shop` - Tienda de ML Coins
- `/inventory` - Inventario de powerups
- `/guilds` - Equipos/Gremios

## Sistema de Autenticación

Implementado en `src/app/providers/AuthContext.tsx`:

- Login/Logout con JWT
- Registro de usuarios
- Recuperación y reset de contraseña
- Verificación de email
- Protected routes con componente `ProtectedRoute`
- Persistencia de sesión en localStorage
- Auto-refresh de token

## Scripts

```bash
npm run dev         # Desarrollo
npm run build       # Build producción
npm run preview     # Preview build
npm test            # Tests
npm run test:ui     # Tests con UI
npm run lint        # Linter
npm run format      # Formatear
npm run storybook   # Storybook dev
```

## Path Aliases

- `@/*` → `src/*`
- `@shared/*` → `src/shared/*`
- `@components/*` → `src/shared/components/*`
- `@hooks/*` → `src/shared/hooks/*`
- `@utils/*` → `src/shared/utils/*`
- `@types/*` → `src/shared/types/*`
- `@services/*` → `src/services/*`
- `@app/*` → `src/app/*`
- `@features/*` → `src/features/*`
- `@pages/*` → `src/pages/*`

## Features Implementadas

1. **Autenticación** (auth) - 16 componentes, 5 hooks, 3 stores
2. **Gamificación** (gamification) - 74 componentes, 15 hooks, 11 stores
3. **Mecánicas Educativas** (mechanics) - 33 tipos de ejercicios
4. **Portal de Estudiante** - 28 páginas completas
5. **Sistema de Progreso** - Tracking y analytics
6. **Social Features** - Friends, guilds, classrooms

## Mecánicas Educativas (33 tipos)

El sistema incluye 33 tipos diferentes de ejercicios implementados en `src/features/mechanics/`:

- **Módulo 1 (Literal):** Crucigrama, Línea de Tiempo, Sopa de Letras, Mapa Conceptual, Emparejamiento
- **Módulo 2 (Inferencial):** Puzzle Contexto, Rueda Inferencias, Construcción Hipótesis, Detective Pistas, Análisis Fotografías
- **Módulo 3 (Crítica):** Tribunal Opiniones, Matriz Perspectivas, Análisis Fuentes, Debate Deliberativo, Podcast Argumentativo
- **Módulo 4 (Digital):** Quiz TikTok, Análisis Memes, Fact-Checking, Navegación Crítica, Infográfico Interactivo
- **Módulo 5 (Creativo):** Ensayo Argumentativo, Video Carta, Call to Action

## Testing

- **Tests unitarios:** 8 archivos
- **Coverage actual:** ~13% (necesita mejora urgente)
- **Coverage objetivo:** ≥70%
- **Gap:** -57 puntos

**Tests implementados:**
- EmailVerificationPage.test.tsx
- LoginPage.test.tsx
- RegisterPage.test.tsx
- UserManagementPage.test.tsx
- DeactivateUserModal.test.tsx
- authStore.test.ts
- LiveLeaderboard.test.tsx
- useSanitizedHTML.test.ts

## Guía de Estilo

- Mobile-first responsive design
- Dark mode support (configurado)
- Accesibilidad WCAG 2.1 AA
- Gamificación integrada en toda la UI
- Animaciones con Framer Motion

## Documentación Adicional

- **Inventario completo:** `docs/90-transversal/inventarios/FRONTEND_INVENTORY.yml`
- **Correcciones aplicadas:** Ver sección `corrections_2025_11_09` en inventario
- **Arquitectura de rutas:** Ver sección `routing` en inventario (18 rutas documentadas)
- **Usuarios de prueba:** `USUARIOS-PRUEBA-2025-11-09.md`
