/**
 * Validate API Contract: Backend ↔ Frontend
 *
 * @description Valida que routes.constants.ts (Backend) y api-endpoints.ts (Frontend) coincidan.
 * @usage npm run validate:api-contract
 *
 * IMPORTANTE:
 * - Ejecutar antes de merge
 * - Integrado en CI/CD
 * - Backend y Frontend deben tener mismas rutas
 *
 * @see /docs/03-desarrollo/CONSTANTS-ARCHITECTURE.md
 */

import { API_ROUTES } from '../../backend/src/shared/constants/routes.constants';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Aplanar objeto de rutas a array de strings
 */
function flattenRoutes(obj: any, prefix = ''): string[] {
  let routes: string[] = [];

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      routes.push(value);
    } else if (typeof value === 'function') {
      // Ejecutar función con placeholders
      try {
        const result = value(':id', ':moduleId', ':userId'); // Pasar múltiples params
        routes.push(result);
      } catch {
        // Si falla, intentar con diferentes arities
        try {
          routes.push(value(':id'));
        } catch {}
      }
    } else if (typeof value === 'object' && value !== null) {
      routes = routes.concat(flattenRoutes(value, prefix));
    }
  }

  return routes;
}

/**
 * Extraer rutas de Frontend (parsing del archivo)
 */
function extractFrontendRoutes(): string[] {
  const frontendFile = path.resolve(__dirname, '../../frontend/src/shared/constants/api-endpoints.ts');

  if (!fs.existsSync(frontendFile)) {
    console.error('❌ No existe Frontend api-endpoints.ts');
    process.exit(1);
  }

  const content = fs.readFileSync(frontendFile, 'utf-8');

  // Regex para extraer rutas (mejorado)
  const regex = /['"]\$\{API_BASE_URL\}([^'"]+)['"]/g;
  const matches = content.matchAll(regex);

  const routes: string[] = [];
  for (const match of matches) {
    if (match[1]) {
      routes.push(match[1]);
    }
  }

  return routes;
}

/**
 * Normalizar ruta (remover placeholders)
 */
function normalizeRoute(route: string): string {
  return route
    .replace(/:\w+/g, ':id') // :userId → :id
    .replace(/\$\{[^}]+\}/g, ':id'); // ${id} → :id
}

async function validateApiContract() {
  console.log('🔍 Validando API Contract: Backend ↔ Frontend...\n');

  try {
    // 1. Extraer rutas Backend
    const backendRoutes = flattenRoutes(API_ROUTES);
    const backendNormalized = backendRoutes.map(normalizeRoute);

    console.log(`📋 Backend: ${backendRoutes.length} rutas encontradas`);

    // 2. Extraer rutas Frontend
    const frontendRoutes = extractFrontendRoutes();
    const frontendNormalized = frontendRoutes.map(normalizeRoute);

    console.log(`📋 Frontend: ${frontendRoutes.length} rutas encontradas\n`);

    // 3. Comparar
    const backendOnly = backendNormalized.filter(r => !frontendNormalized.includes(r));
    const frontendOnly = frontendNormalized.filter(r => !backendNormalized.includes(r));

    // 4. Reportar discrepancias
    if (backendOnly.length > 0) {
      console.error('❌ Rutas en BACKEND pero NO en FRONTEND:');
      backendOnly.forEach((route, index) => {
        const original = backendRoutes[backendNormalized.indexOf(route)];
        console.error(`   ${index + 1}. ${original}`);
      });
      console.error('');
    }

    if (frontendOnly.length > 0) {
      console.error('❌ Rutas en FRONTEND pero NO en BACKEND:');
      frontendOnly.forEach((route, index) => {
        const original = frontendRoutes[frontendNormalized.indexOf(route)];
        console.error(`   ${index + 1}. ${original}`);
      });
      console.error('');
    }

    // 5. Resultado final
    if (backendOnly.length > 0 || frontendOnly.length > 0) {
      console.error('═'.repeat(80));
      console.error('RESUMEN:');
      console.error(`  Backend Only:  ${backendOnly.length}`);
      console.error(`  Frontend Only: ${frontendOnly.length}`);
      console.error(`  TOTAL DISCREPANCIAS: ${backendOnly.length + frontendOnly.length}`);
      console.error('═'.repeat(80));
      console.error('\n❌ FALLÓ: Existen discrepancias en el API Contract.\n');
      console.error('📋 ACCIÓN REQUERIDA:');
      console.error('1. Revisar rutas faltantes arriba');
      console.error('2. Sincronizar Backend routes.constants.ts y Frontend api-endpoints.ts');
      console.error('3. Ejecutar: npm run validate:api-contract nuevamente\n');
      process.exit(1);
    }

    console.log('✅ ¡EXCELENTE! API Contract validado: Backend ↔ Frontend sincronizados.\n');
    console.log(`   ${backendRoutes.length} rutas verificadas sin discrepancias.`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al validar API Contract:', error);
    process.exit(1);
  }
}

validateApiContract();
