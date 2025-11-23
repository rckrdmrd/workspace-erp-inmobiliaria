# Frontend Web - MVP Sistema Administración de Obra

**Stack:** React 18 + Vite + TypeScript + Zustand
**Versión:** 1.0.0
**Fecha:** 2025-11-20

---

## 📋 DESCRIPCIÓN

Aplicación web del sistema de administración de obra e INFONAVIT.

**Portales incluidos:**
- **Admin:** Portal administrativo completo
- **Supervisor:** Portal para supervisores de obra
- **Obra:** Portal para personal en sitio

---

## 🚀 SETUP INICIAL

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🏗️ ESTRUCTURA

```
src/
├── shared/                    # Código compartido entre portales
│   ├── components/
│   │   ├── ui/               # Componentes UI base (Button, Input, etc.)
│   │   └── layout/           # Componentes de layout (Header, Sidebar, etc.)
│   ├── hooks/                # Custom hooks
│   ├── stores/               # Zustand stores
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilities
│   └── constants/            # Constantes
└── apps/                     # Portales específicos
    ├── admin/                # Portal administrador
    │   ├── pages/
    │   ├── components/
    │   └── routes.tsx
    ├── supervisor/           # Portal supervisor
    └── obra/                 # Portal obra
```

---

## 📝 SCRIPTS

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (port 5173) |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Ejecuta ESLint y corrige |
| `npm run type-check` | Verifica tipos TypeScript |

---

## 🎨 CONVENCIONES

### Nomenclatura

Seguir **ESTANDARES-NOMENCLATURA.md**:
- Componentes: `PascalCase.tsx`
- Páginas: `PascalCasePage.tsx`
- Hooks: `useCamelCase.ts`
- Stores: `camelCase.store.ts`
- Tipos: `camelCase.types.ts`

### Path Aliases

```typescript
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { projectStore } from '@stores/project.store';
import type { Project } from '@types/project.types';
```

---

## 📚 REFERENCIAS

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [ESTANDARES-NOMENCLATURA.md](../../orchestration/directivas/ESTANDARES-NOMENCLATURA.md)

---

**Mantenido por:** Frontend-Agent
**Última actualización:** 2025-11-20
