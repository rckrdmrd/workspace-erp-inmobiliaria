/**
 * HTML Sanitizer Utility
 *
 * Sanitización de HTML basada en roles de usuario
 * Protección contra XSS, DOM clobbering y otros ataques
 */

import sanitizeHtml from 'sanitize-html';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Configuraciones de sanitización por rol
 */
const SANITIZE_CONFIGS = {
  [UserRole.STUDENT]: {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'span',
      'div',
      'ul',
      'ol',
      'li',
    ],
    allowedAttributes: {
      '*': ['class', 'id'],
      span: ['style'], // Permitir estilos básicos inline
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,6}$/i, /^rgb\(/],
        'text-align': [/^left$/, /^right$/, /^center$/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
      },
    },
  },
  [UserRole.TEACHER]: {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'span',
      'div',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'code',
      'pre',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      '*': ['class', 'id'],
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      span: ['style'],
      div: ['style'],
      table: ['border', 'cellpadding', 'cellspacing'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
        'text-align': [/^left$/, /^right$/, /^center$/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        'background-color': [/^#[0-9a-f]{3,6}$/i, /^rgb\(/, /^rgba\(/],
      },
    },
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target === '_blank' ? '_blank' : '',
        },
      }),
    },
  },
  [UserRole.ADMIN]: {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'iframe',
      'video',
      'audio',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow'],
      video: ['src', 'controls', 'width', 'height'],
      audio: ['src', 'controls'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowedIframeHostnames: [
      'www.youtube.com',
      'player.vimeo.com',
      'www.google.com',
    ],
  },
  [UserRole.SUPER_ADMIN]: {
    // Super admin tiene acceso completo, pero aún con protección básica
    allowedTags: false as any, // Permitir todos los tags
    allowedAttributes: false as any, // Permitir todos los atributos
    allowProtocolRelative: false,
  },
};

/**
 * Sanitiza HTML basado en el rol del usuario
 */
export function sanitizeHtmlByRole(
  html: string,
  role: UserRole = UserRole.STUDENT,
): string {
  const config = SANITIZE_CONFIGS[role] || SANITIZE_CONFIGS[UserRole.STUDENT];

  return sanitizeHtml(html, config as any);
}

/**
 * Sanitiza HTML con configuración personalizada
 */
export function sanitizeHtmlCustom(
  html: string,
  options: sanitizeHtml.IOptions,
): string {
  return sanitizeHtml(html, options);
}

/**
 * Sanitiza URLs para prevenir XSS
 */
export function sanitizeUrl(url: string): string {
  const allowedProtocols = ['http:', 'https:', 'mailto:'];

  try {
    const parsedUrl = new URL(url);

    // Verificar protocolo permitido
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return '#';
    }

    // Prevenir javascript: protocol
    if (parsedUrl.protocol === 'javascript:') {
      return '#';
    }

    return url;
  } catch {
    // Si no es una URL válida, devolver placeholder
    return '#';
  }
}

/**
 * Valida que un string no contenga scripts maliciosos
 */
export function containsMaliciousCode(input: string): boolean {
  const maliciousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /<iframe[^>]*>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi, // IE CSS expressions
  ];

  return maliciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Escapa caracteres especiales HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Desescapa caracteres HTML
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };

  return text.replace(/&(?:amp|lt|gt|quot|#039);/g, (entity) => map[entity] || entity);
}

/**
 * Strip HTML tags completamente
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Trunca HTML de manera segura manteniendo tags cerrados
 */
export function truncateHtml(
  html: string,
  maxLength: number,
  suffix: string = '...',
): string {
  const stripped = stripHtml(html);

  if (stripped.length <= maxLength) {
    return html;
  }

  const truncated = stripped.substring(0, maxLength) + suffix;
  return escapeHtml(truncated);
}
