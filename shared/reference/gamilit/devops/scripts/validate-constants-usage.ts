/**
 * Validate Constants Usage (Detect Hardcoding - SSOT Violations)
 *
 * @description Script para detectar hardcoding de nombres y valores (violaciones SSOT)
 * @usage npm run validate:constants
 *
 * @project GAMILIT
 * @subagent SA-SCRIPTS-02
 * @created 2025-11-02
 *
 * @see /docs-analysis/.../CONSTANTS-ARCHITECTURE.md
 * @see /docs-analysis/.../POLITICA-CONSTANTS-SSOT.md
 */

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

/**
 * Tipos de violaciones
 */
interface ViolationType {
  file: string;
  pattern: string;
  message: string;
  severity: 'P0' | 'P1' | 'P2';
  matches: string[];
  count: number;
  lineNumbers?: number[];
  suggestion?: string;
}

interface PatternConfig {
  pattern: RegExp;
  message: string;
  severity: 'P0' | 'P1' | 'P2';
  exclude: string[];
  suggestion?: string;
}

/**
 * Patrones a detectar (hardcoding)
 * Agrupados por categoría y ordenados por severidad
 */
const PATTERNS_TO_DETECT: PatternConfig[] = [
  // ========================================
  // P0 - CRÍTICO: DATABASE SCHEMAS
  // ========================================
  {
    pattern: /['"]auth_management['"]/g,
    message: 'Hardcoded schema "auth_management"',
    severity: 'P0',
    exclude: ['database.constants.ts', '.sql', 'ddl/', 'migrations/', 'schema.constants.ts'],
    suggestion: 'Usa DB_SCHEMAS.AUTH en su lugar',
  },
  {
    pattern: /['"]gamification_system['"]/g,
    message: 'Hardcoded schema "gamification_system"',
    severity: 'P0',
    exclude: ['database.constants.ts', '.sql', 'ddl/', 'migrations/', 'schema.constants.ts'],
    suggestion: 'Usa DB_SCHEMAS.GAMIFICATION en su lugar',
  },
  {
    pattern: /['"]educational_content['"]/g,
    message: 'Hardcoded schema "educational_content"',
    severity: 'P0',
    exclude: ['database.constants.ts', '.sql', 'ddl/', 'migrations/', 'schema.constants.ts'],
    suggestion: 'Usa DB_SCHEMAS.EDUCATIONAL en su lugar',
  },
  {
    pattern: /['"]analytics_tracking['"]/g,
    message: 'Hardcoded schema "analytics_tracking"',
    severity: 'P0',
    exclude: ['database.constants.ts', '.sql', 'ddl/', 'migrations/', 'schema.constants.ts'],
    suggestion: 'Usa DB_SCHEMAS.ANALYTICS en su lugar',
  },
  {
    pattern: /['"]public['"]\s*\.\s*['"]users['"]/g,
    message: 'Hardcoded schema.table reference "public"."users"',
    severity: 'P0',
    exclude: ['database.constants.ts', '.sql', 'migrations/'],
    suggestion: 'Usa DB_SCHEMAS y DB_TABLES constants',
  },

  // ========================================
  // P0 - CRÍTICO: DATABASE TABLES
  // ========================================
  {
    pattern: /['"]users['"](?!\s*[:}])/g,
    message: 'Hardcoded table "users"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.AUTH.USERS en su lugar',
  },
  {
    pattern: /['"]tenants['"](?!\s*[:}])/g,
    message: 'Hardcoded table "tenants"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.AUTH.TENANTS en su lugar',
  },
  {
    pattern: /['"]roles['"](?!\s*[:}])/g,
    message: 'Hardcoded table "roles"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.AUTH.ROLES en su lugar',
  },
  {
    pattern: /['"]permissions['"](?!\s*[:}])/g,
    message: 'Hardcoded table "permissions"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.AUTH.PERMISSIONS en su lugar',
  },
  {
    pattern: /['"]achievements['"](?!\s*[:}])/g,
    message: 'Hardcoded table "achievements"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.GAMIFICATION.ACHIEVEMENTS en su lugar',
  },
  {
    pattern: /['"]badges['"](?!\s*[:}])/g,
    message: 'Hardcoded table "badges"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.GAMIFICATION.BADGES en su lugar',
  },
  {
    pattern: /['"]user_progress['"](?!\s*[:}])/g,
    message: 'Hardcoded table "user_progress"',
    severity: 'P0',
    exclude: ['database.constants.ts', 'table.constants.ts', '.sql', 'test/', 'spec.ts', '__tests__/'],
    suggestion: 'Usa DB_TABLES.GAMIFICATION.USER_PROGRESS en su lugar',
  },

  // ========================================
  // P0 - CRÍTICO: BACKEND CONTROLLERS
  // ========================================
  {
    pattern: /@Controller\(\s*['"][^{]+['"]\s*\)/g,
    message: 'Hardcoded @Controller() path',
    severity: 'P0',
    exclude: ['routes.constants.ts', 'api-routes.constants.ts'],
    suggestion: 'Usa API_ROUTES constants en su lugar',
  },

  // ========================================
  // P0 - CRÍTICO: FRONTEND API URLS
  // ========================================
  {
    pattern: /fetch\(\s*['"]http:\/\/localhost:3000[^'"]+['"]/g,
    message: 'Hardcoded localhost API URL in fetch()',
    severity: 'P0',
    exclude: ['api-endpoints.ts', 'api.constants.ts', 'test/', 'spec.ts', '__tests__/', '.spec.tsx'],
    suggestion: 'Usa API_ENDPOINTS constants con baseURL del config',
  },
  {
    pattern: /fetch\(\s*['"]http:\/\/localhost:4000[^'"]+['"]/g,
    message: 'Hardcoded localhost API URL in fetch()',
    severity: 'P0',
    exclude: ['api-endpoints.ts', 'api.constants.ts', 'test/', 'spec.ts', '__tests__/', '.spec.tsx'],
    suggestion: 'Usa API_ENDPOINTS constants con baseURL del config',
  },
  {
    pattern: /axios\.(get|post|put|delete|patch)\(\s*['"]http[^'"]+['"]/g,
    message: 'Hardcoded API URL in axios',
    severity: 'P0',
    exclude: ['api-endpoints.ts', 'api.constants.ts', 'test/', 'spec.ts', '__tests__/', '.spec.tsx'],
    suggestion: 'Usa API_ENDPOINTS constants con axios instance configurado',
  },
  {
    pattern: /fetch\(\s*['"]\/(api|auth|users|gamification|educational)[^'"]+['"]/g,
    message: 'Hardcoded relative API path in fetch()',
    severity: 'P0',
    exclude: ['api-endpoints.ts', 'api.constants.ts', 'test/', 'spec.ts', '__tests__/', '.spec.tsx'],
    suggestion: 'Usa API_ENDPOINTS constants en su lugar',
  },
  {
    pattern: /axios\.(get|post|put|delete|patch)\(\s*['"]\/(api|auth|users)[^'"]+['"]/g,
    message: 'Hardcoded relative API path in axios',
    severity: 'P0',
    exclude: ['api-endpoints.ts', 'api.constants.ts', 'test/', 'spec.ts', '__tests__/', '.spec.tsx'],
    suggestion: 'Usa API_ENDPOINTS constants en su lugar',
  },

  // ========================================
  // P1 - IMPORTANTE: ROUTE DECORATORS
  // ========================================
  {
    pattern: /@(Get|Post|Put|Delete|Patch)\(\s*['"][a-z0-9/-]+['"]\s*\)/g,
    message: 'Hardcoded route decorator path',
    severity: 'P1',
    exclude: ['routes.constants.ts', 'api-routes.constants.ts'],
    suggestion: 'Considera usar API_ROUTES constants (aceptable para rutas internas simples)',
  },

  // ========================================
  // P1 - IMPORTANTE: AUTH PROVIDERS
  // ========================================
  {
    pattern: /['"]local['"].*provider/gi,
    message: 'Hardcoded auth provider "local"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'auth-provider.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa AuthProviderEnum.LOCAL',
  },
  {
    pattern: /['"]google['"].*provider/gi,
    message: 'Hardcoded auth provider "google"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'auth-provider.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa AuthProviderEnum.GOOGLE',
  },
  {
    pattern: /['"]github['"].*provider/gi,
    message: 'Hardcoded auth provider "github"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'auth-provider.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa AuthProviderEnum.GITHUB',
  },

  // ========================================
  // P1 - IMPORTANTE: SUBSCRIPTION TIERS
  // ========================================
  {
    pattern: /subscriptionTier\s*[=:]\s*['"]free['"]/gi,
    message: 'Hardcoded subscription tier "free"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'subscription.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa SubscriptionTierEnum.FREE',
  },
  {
    pattern: /subscriptionTier\s*[=:]\s*['"]pro['"]/gi,
    message: 'Hardcoded subscription tier "pro"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'subscription.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa SubscriptionTierEnum.PRO',
  },
  {
    pattern: /subscriptionTier\s*[=:]\s*['"]enterprise['"]/gi,
    message: 'Hardcoded subscription tier "enterprise"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'subscription.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Usa SubscriptionTierEnum.ENTERPRISE',
  },

  // ========================================
  // P1 - IMPORTANTE: USER ROLES
  // ========================================
  {
    pattern: /role\s*[=:]\s*['"]admin['"]/gi,
    message: 'Hardcoded role "admin"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'role.constants.ts', 'test/', 'spec.ts', 'seed'],
    suggestion: 'Usa UserRoleEnum.ADMIN',
  },
  {
    pattern: /role\s*[=:]\s*['"]user['"]/gi,
    message: 'Hardcoded role "user"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'role.constants.ts', 'test/', 'spec.ts', 'seed'],
    suggestion: 'Usa UserRoleEnum.USER',
  },
  {
    pattern: /role\s*[=:]\s*['"]teacher['"]/gi,
    message: 'Hardcoded role "teacher"',
    severity: 'P1',
    exclude: ['enums.constants.ts', 'role.constants.ts', 'test/', 'spec.ts', 'seed'],
    suggestion: 'Usa UserRoleEnum.TEACHER',
  },

  // ========================================
  // P1 - IMPORTANTE: ENVIRONMENT VARIABLES
  // ========================================
  {
    pattern: /process\.env\.[A-Z_]+(?!\s*\|\|)/g,
    message: 'Direct process.env access without fallback',
    severity: 'P1',
    exclude: ['config/', 'env.constants.ts', '.config.ts', 'test/'],
    suggestion: 'Usa ENV_CONFIG constants con validación y fallbacks',
  },

  // ========================================
  // P2 - MENOR: HTTP STATUS CODES
  // ========================================
  {
    pattern: /\.status\(\s*(200|201|204|400|401|403|404|500)\s*\)/g,
    message: 'Hardcoded HTTP status code',
    severity: 'P2',
    exclude: ['http-status.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Considera usar HttpStatus enum de NestJS o constants propias',
  },

  // ========================================
  // P2 - MENOR: MIME TYPES
  // ========================================
  {
    pattern: /['"]application\/json['"]/g,
    message: 'Hardcoded MIME type "application/json"',
    severity: 'P2',
    exclude: ['mime.constants.ts', 'test/', 'spec.ts'],
    suggestion: 'Considera usar MIME_TYPES constants',
  },
];

/**
 * Configuración de rutas a escanear
 */
const PATHS_TO_SCAN = [
  'gamilit/projects/gamilit/apps/backend/src/**/*.ts',
  'gamilit/projects/gamilit/apps/frontend/src/**/*.ts',
  'gamilit/projects/gamilit/apps/frontend/src/**/*.tsx',
];

/**
 * Archivos y directorios a excluir globalmente
 */
const GLOBAL_EXCLUDES = [
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.git',
  '*.min.js',
  '*.bundle.js',
];

/**
 * Extraer números de línea donde aparece el patrón
 */
function findLineNumbers(content: string, pattern: RegExp): number[] {
  const lines = content.split('\n');
  const lineNumbers: number[] = [];

  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1); // Line numbers start at 1
    }
    // Reset regex lastIndex for next iteration
    pattern.lastIndex = 0;
  });

  return lineNumbers;
}

/**
 * Validar un archivo
 */
async function validateFile(filePath: string): Promise<ViolationType[]> {
  let content: string;

  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`⚠️  No se pudo leer ${filePath}: ${error}`);
    return [];
  }

  const violations: ViolationType[] = [];

  for (const config of PATTERNS_TO_DETECT) {
    const { pattern, message, severity, exclude, suggestion } = config;

    // Skip if file is in exclude list
    if (exclude && exclude.some((ex) => filePath.includes(ex))) {
      continue;
    }

    // Skip if file is in global excludes
    if (GLOBAL_EXCLUDES.some((ex) => filePath.includes(ex))) {
      continue;
    }

    // Create a fresh regex to avoid lastIndex issues
    const regexCopy = new RegExp(pattern.source, pattern.flags);
    const matches = content.match(regexCopy);

    if (matches && matches.length > 0) {
      const lineNumbers = findLineNumbers(content, new RegExp(pattern.source, pattern.flags));

      violations.push({
        file: filePath,
        pattern: pattern.toString(),
        message,
        severity,
        matches: matches.slice(0, 5), // Primeros 5 matches
        count: matches.length,
        lineNumbers: lineNumbers.slice(0, 5), // Primeros 5 números de línea
        suggestion,
      });
    }
  }

  return violations;
}

/**
 * Expandir glob patterns a lista de archivos
 */
async function expandGlobPattern(pathPattern: string, basePath: string): Promise<string[]> {
  try {
    // Convertir el glob pattern a find command
    const parts = pathPattern.split('/');
    const lastPart = parts[parts.length - 1];
    const dirPath = parts.slice(0, -1).join('/');

    let findCmd: string;

    if (lastPart === '**/*.ts') {
      findCmd = `find ${basePath}/${dirPath} -type f -name "*.ts" 2>/dev/null`;
    } else if (lastPart === '**/*.tsx') {
      findCmd = `find ${basePath}/${dirPath} -type f -name "*.tsx" 2>/dev/null`;
    } else {
      findCmd = `find ${basePath}/${dirPath} -type f \\( -name "*.ts" -o -name "*.tsx" \\) 2>/dev/null`;
    }

    const { stdout } = await execAsync(findCmd);
    const files = stdout
      .trim()
      .split('\n')
      .filter((f) => {
        if (!f) return false;
        // Excluir node_modules y otros directorios globales
        return !GLOBAL_EXCLUDES.some((ex) => f.includes(ex));
      });

    return files;
  } catch (error) {
    console.warn(`⚠️  Error al expandir patrón ${pathPattern}: ${error}`);
    return [];
  }
}

/**
 * Generar reporte detallado
 */
function generateReport(violations: ViolationType[]): void {
  // Agrupar por severidad
  const p0Violations = violations.filter((v) => v.severity === 'P0');
  const p1Violations = violations.filter((v) => v.severity === 'P1');
  const p2Violations = violations.filter((v) => v.severity === 'P2');

  console.log('\n' + '='.repeat(80));
  console.log('📊 REPORTE DE VALIDACIÓN DE CONSTANTES (SSOT)');
  console.log('='.repeat(80) + '\n');

  if (violations.length === 0) {
    console.log('✅ ¡EXCELENTE! No se encontraron violaciones de hardcoding.\n');
    console.log('   Todas las constantes están correctamente utilizadas según SSOT.');
    console.log('   El código cumple con la política de constants-first.\n');
    return;
  }

  // P0 - Violaciones Críticas
  if (p0Violations.length > 0) {
    console.log(`❌ VIOLACIONES P0 (CRÍTICAS) - BLOQUEAN CI/CD: ${p0Violations.length}\n`);
    console.log('   Estas violaciones DEBEN corregirse antes de hacer merge.\n');

    p0Violations.forEach((v, index) => {
      console.log(`${index + 1}. 📄 ${v.file}`);
      console.log(`   🚨 ${v.message}`);
      if (v.suggestion) {
        console.log(`   💡 ${v.suggestion}`);
      }
      console.log(`   📍 Líneas: ${v.lineNumbers?.join(', ') || 'N/A'}`);
      console.log(`   🔢 Total de ocurrencias: ${v.count}`);
      console.log(`   📝 Ejemplos:`);
      v.matches.slice(0, 3).forEach((m) => console.log(`      - ${m}`));
      console.log();
    });
  }

  // P1 - Violaciones Importantes
  if (p1Violations.length > 0) {
    console.log(`⚠️  VIOLACIONES P1 (IMPORTANTES) - REVISAR: ${p1Violations.length}\n`);
    console.log('   Estas violaciones deben revisarse y corregirse en la medida de lo posible.\n');

    p1Violations.forEach((v, index) => {
      console.log(`${index + 1}. 📄 ${v.file}`);
      console.log(`   ⚠️  ${v.message}`);
      if (v.suggestion) {
        console.log(`   💡 ${v.suggestion}`);
      }
      console.log(`   🔢 Ocurrencias: ${v.count}`);
      console.log();
    });
  }

  // P2 - Violaciones Menores
  if (p2Violations.length > 0) {
    console.log(`ℹ️  VIOLACIONES P2 (MENORES) - INFORMATIVO: ${p2Violations.length}\n`);
    console.log('   Estas violaciones son informativas. Corrígelas cuando sea conveniente.\n');

    // Solo mostrar resumen para P2
    const p2ByType = p2Violations.reduce((acc, v) => {
      acc[v.message] = (acc[v.message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(p2ByType).forEach(([message, count]) => {
      console.log(`   - ${message}: ${count} archivos`);
    });
    console.log();
  }
}

/**
 * Generar resumen final
 */
function generateSummary(violations: ViolationType[]): void {
  const p0Count = violations.filter((v) => v.severity === 'P0').length;
  const p1Count = violations.filter((v) => v.severity === 'P1').length;
  const p2Count = violations.filter((v) => v.severity === 'P2').length;

  console.log('='.repeat(80));
  console.log('📈 RESUMEN:');
  console.log('='.repeat(80));
  console.log(`  P0 (Críticas):    ${p0Count} violaciones`);
  console.log(`  P1 (Importantes): ${p1Count} violaciones`);
  console.log(`  P2 (Menores):     ${p2Count} violaciones`);
  console.log(`  ────────────────────────────────`);
  console.log(`  TOTAL:            ${violations.length} violaciones`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Generar instrucciones de corrección
 */
function generateInstructions(violations: ViolationType[]): void {
  const p0Count = violations.filter((v) => v.severity === 'P0').length;
  const p1Count = violations.filter((v) => v.severity === 'P1').length;

  console.log('📋 PRÓXIMOS PASOS:\n');

  if (p0Count > 0) {
    console.log('1. ❌ URGENTE: Corregir TODAS las violaciones P0 (críticas)');
    console.log('   → Estas bloquean el pipeline de CI/CD');
    console.log('   → Reemplazar hardcoded values por constants del SSOT\n');
  }

  if (p1Count > 0) {
    console.log('2. ⚠️  Revisar y corregir violaciones P1 (importantes)');
    console.log('   → Priorizar antes del merge a main\n');
  }

  console.log('3. ✅ Re-ejecutar validación:');
  console.log('   → npm run validate:constants\n');

  console.log('4. 📚 Consultar documentación:');
  console.log('   → docs-analysis/.../CONSTANTS-ARCHITECTURE.md');
  console.log('   → docs-analysis/.../POLITICA-CONSTANTS-SSOT.md\n');

  console.log('5. 🔍 Ver ubicación de constants:');
  console.log('   → apps/backend/src/shared/constants/');
  console.log('   → apps/frontend/src/shared/constants/\n');
}

/**
 * Determinar exit code
 */
function determineExitCode(violations: ViolationType[]): number {
  const p0Count = violations.filter((v) => v.severity === 'P0').length;
  const p1Count = violations.filter((v) => v.severity === 'P1').length;

  if (p0Count > 0) {
    console.error('❌ FALLÓ: Existen violaciones P0 que bloquean el CI/CD.\n');
    return 1;
  }

  if (p1Count > 5) {
    console.warn('⚠️  ADVERTENCIA: Demasiadas violaciones P1 (>5).\n');
    console.warn('   Se recomienda corregir antes de merge.\n');
    return 1;
  }

  if (violations.length === 0) {
    console.log('✅ ÉXITO: No se encontraron violaciones.\n');
  } else {
    console.log('✅ PASÓ: No hay violaciones críticas (solo P1/P2 menores).\n');
  }

  return 0;
}

/**
 * Main
 */
async function main() {
  console.log('🔍 Validando uso de constantes (detectando hardcoding SSOT)...\n');
  console.log(`📅 Fecha: ${new Date().toISOString()}`);
  console.log(`🤖 Subagente: SA-SCRIPTS-02`);
  console.log(`📦 Proyecto: GAMILIT\n`);

  const basePath = '/home/isem/workspace/workspace-gamilit';
  let allViolations: ViolationType[] = [];
  let totalFilesScanned = 0;

  // Escanear cada path pattern
  for (const pathPattern of PATHS_TO_SCAN) {
    const files = await expandGlobPattern(pathPattern, basePath);

    if (files.length === 0) {
      console.log(`⚠️  No se encontraron archivos para: ${pathPattern}`);
      continue;
    }

    console.log(`📂 Escaneando ${files.length} archivos en: ${pathPattern}`);
    totalFilesScanned += files.length;

    for (const file of files) {
      const violations = await validateFile(file);
      allViolations = allViolations.concat(violations);
    }
  }

  console.log(`\n✅ Escaneados ${totalFilesScanned} archivos en total`);
  console.log(`🔍 Patrones de detección: ${PATTERNS_TO_DETECT.length}`);
  console.log(`📊 Violaciones encontradas: ${allViolations.length}\n`);

  // Generar reportes
  generateReport(allViolations);
  generateSummary(allViolations);
  generateInstructions(allViolations);

  // Determinar exit code
  const exitCode = determineExitCode(allViolations);
  process.exit(exitCode);
}

// Execute
main().catch((error) => {
  console.error('❌ Error fatal durante la validación:', error);
  console.error('\n Stack trace:', error.stack);
  process.exit(1);
});
