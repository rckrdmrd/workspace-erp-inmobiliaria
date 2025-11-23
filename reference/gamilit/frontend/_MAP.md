# _MAP: apps/frontend/

**Última actualización:** 2025-11-07
**Estado:** 🟢 En desarrollo activo
**Versión:** 2.0

---

## 📋 Propósito

Frontend SPA multi-portal de GAMILIT con 3 aplicaciones (Student, Teacher, Admin) en React + Vite + TypeScript.

**Audiencia:** Desarrolladores Frontend, UX Designers, Tech Leads

---

## 🗂️ Estructura

```
frontend/
├── src/
│   ├── app/                  # App configuration
│   │   ├── layouts/          # Layout components
│   │   ├── providers/        # Context providers
│   │   └── routes/           # React Router config
│   ├── features/             # Features por dominio
│   │   ├── auth/             # Autenticación
│   │   └── exercises/        # 33 mecánicas educativas
│   ├── pages/                # Pages/Views
│   │   ├── auth/             # Login, Register
│   │   └── teacher/          # Teacher portal pages
│   ├── components/           # Componentes de dominio
│   │   ├── achievements/     # Achievements UI
│   │   ├── dashboard/        # Dashboard components
│   │   ├── feedback/         # Feedback UI
│   │   ├── navigation/       # Navigation components
│   │   └── teacher/          # Teacher-specific components
│   ├── shared/               # Código compartido
│   │   ├── components/       # UI components reutilizables
│   │   ├── constants/        # Constants (API endpoints, ENUMs)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Shared layouts
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── styles/           # Global styles
│   │   ├── themes/           # Tailwind themes
│   │   ├── types/            # TypeScript types (sync con backend)
│   │   └── utils/            # Utilidades
│   ├── services/             # API services
│   ├── lib/                  # Libraries
│   │   └── api/              # Axios API client
│   ├── hooks/                # App-level hooks
│   ├── test/                 # Test utilities
│   ├── App.tsx               # App principal
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── dist/                     # Build output
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| **Archivos TS/TSX** | 142 |
| **LOC** | ~85,000 |
| **Componentes** | 180+ |
| **Mecánicas educativas** | 33 |
| **Páginas** | 40+ |
| **Tests** | 15 (objetivo: 60) |
| **Coverage** | ~13% (objetivo: 70%) |

---

## 🎯 Features Principales

### Student Portal
- Dashboard gamificado
- 33 mecánicas educativas
- Progress tracking
- ML Coins & Achievements

### Teacher Portal
- Classroom management
- Student progress monitoring
- Grading interface

### Admin Portal (planeado)
- User management
- System configuration

---

## 🚨 Issues P0

- **Test coverage bajo:** 13% vs 70%
- **Sin PWA configurado** (ready pero no activado)
- **Accesibilidad WCAG:** Parcialmente implementada

---

## 🚀 Scripts

```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # Build production
npm run preview      # Preview build
npm test             # Vitest
npm run lint         # ESLint
npm run format       # Prettier
```

---

## 📐 Path Aliases

```json
{
  "@/*": ["src/*"],
  "@shared/*": ["src/shared/*"],
  "@components/*": ["src/shared/components/*"],
  "@hooks/*": ["src/shared/hooks/*"],
  "@utils/*": ["src/shared/utils/*"],
  "@types/*": ["src/shared/types/*"]
}
```

---

## 🔗 Interdependencias

- **Backend (apps/backend/):** Consume API REST + WebSocket
- **DevOps (apps/devops/):** ENUMs sincronizados automáticamente
- **Docs:** [docs/03-desarrollo/frontend/](../../docs/03-desarrollo/frontend/)

---

**Generado:** 2025-11-07
**Método:** Sistema SIMCO - Fase 3
**Versión:** 1.0.0
