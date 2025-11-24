/**
 * Sync ENUMs: Backend → Frontend
 *
 * @description Copia enums.constants.ts de Backend a Frontend automáticamente.
 * @usage npm run sync:enums
 *
 * IMPORTANTE:
 * - Ejecutar SIEMPRE antes de commit
 * - Integrado en postinstall (automático)
 * - Backend es la fuente de verdad
 *
 * @see /docs/03-desarrollo/CONSTANTS-ARCHITECTURE.md
 */

import * as fs from 'fs';
import * as path from 'path';

const BACKEND_ENUMS = path.resolve(__dirname, '../../backend/src/shared/constants/enums.constants.ts');
const FRONTEND_ENUMS = path.resolve(__dirname, '../../frontend/src/shared/constants/enums.constants.ts');

async function syncEnums() {
  console.log('🔄 Sincronizando ENUMs: Backend → Frontend...\n');

  try {
    // 1. Verificar que archivo Backend existe
    if (!fs.existsSync(BACKEND_ENUMS)) {
      console.error('❌ Error: No existe Backend enums.constants.ts');
      console.error(`   Ruta esperada: ${BACKEND_ENUMS}`);
      process.exit(1);
    }

    // 2. Leer contenido Backend
    const content = fs.readFileSync(BACKEND_ENUMS, 'utf-8');

    // 3. Modificar header JSDoc (Backend → Frontend)
    const modifiedContent = content.replace(
      /ENUMs Constants - Shared \(Backend\)/g,
      'ENUMs Constants - Shared (Frontend)'
    ).replace(
      /@see \/apps\/backend\/src\/shared\/constants\/enums\.constants\.ts/g,
      '@see /apps/backend/src/shared/constants/enums.constants.ts'
    );

    // 4. Crear directorio Frontend si no existe
    const frontendDir = path.dirname(FRONTEND_ENUMS);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
      console.log(`📁 Creado directorio: ${frontendDir}`);
    }

    // 5. Escribir archivo Frontend
    fs.writeFileSync(FRONTEND_ENUMS, modifiedContent, 'utf-8');

    // 6. Verificar sincronización
    const backendSize = fs.statSync(BACKEND_ENUMS).size;
    const frontendSize = fs.statSync(FRONTEND_ENUMS).size;

    console.log('✅ ENUMs sincronizados exitosamente!');
    console.log(`   Backend:  ${BACKEND_ENUMS} (${backendSize} bytes)`);
    console.log(`   Frontend: ${FRONTEND_ENUMS} (${frontendSize} bytes)`);
    console.log(`   Diferencia: ${Math.abs(backendSize - frontendSize)} bytes (esperado por cambio de header)\n`);

  } catch (error) {
    console.error('❌ Error al sincronizar ENUMs:', error);
    process.exit(1);
  }
}

syncEnums();
