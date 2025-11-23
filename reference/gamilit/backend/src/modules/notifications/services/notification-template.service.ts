import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/multichannel/notification-template.entity';

/**
 * NotificationTemplateService
 *
 * @description Gestión de plantillas de notificaciones multi-canal (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Responsabilidades:
 * - CRUD de templates
 * - Interpolación de variables en templates (Mustache-style)
 * - Validación de variables requeridas
 * - Renderizado completo de templates (subject, body, HTML)
 *
 * Características:
 * - Soporte para interpolación {{variable_name}}
 * - Validación automática de variables requeridas
 * - Renderizado de subject, body y HTML
 * - Filtrado por is_active
 *
 * Templates de producción (8 cargados en seeds):
 * 1. welcome_message
 * 2. achievement_unlocked
 * 3. rank_up
 * 4. assignment_due_reminder
 * 5. friend_request
 * 6. mission_completed
 * 7. system_announcement
 * 8. password_reset
 */
@Injectable()
export class NotificationTemplateService {
  constructor(
    @InjectRepository(NotificationTemplate, 'notifications')
    private readonly templateRepository: Repository<NotificationTemplate>,
  ) {}

  /**
   * Obtener template por key
   *
   * @param templateKey - Identificador único del template (ej: 'welcome_message')
   * @returns Template encontrado
   * @throws NotFoundException si el template no existe o está inactivo
   *
   * @example
   * const template = await this.templateService.findByKey('achievement_unlocked');
   */
  async findByKey(templateKey: string): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({
      where: { templateKey, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(
        `Template with key '${templateKey}' not found or is inactive`,
      );
    }

    return template;
  }

  /**
   * Obtener todos los templates
   *
   * @param filters - Filtros opcionales
   * @param filters.isActive - Filtrar por estado activo (default: solo activos)
   * @param filters.search - Buscar en name o description
   * @returns Lista de templates
   *
   * @example
   * const templates = await this.templateService.findAll({ isActive: true });
   */
  async findAll(filters?: {
    isActive?: boolean;
    search?: string;
  }): Promise<NotificationTemplate[]> {
    const query = this.templateRepository.createQueryBuilder('template');

    // Filtro por isActive (default: solo activos)
    if (filters?.isActive !== undefined) {
      query.andWhere('template.isActive = :isActive', { isActive: filters.isActive });
    } else {
      query.andWhere('template.isActive = true');
    }

    // Búsqueda en name o description
    if (filters?.search) {
      query.andWhere(
        '(template.name ILIKE :search OR template.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('template.name', 'ASC');

    return query.getMany();
  }

  /**
   * Validar que todas las variables requeridas estén presentes
   *
   * @param requiredVariables - Array de nombres de variables requeridas
   * @param providedVariables - Objeto con variables proporcionadas
   * @throws BadRequestException si falta alguna variable requerida
   *
   * @example
   * this.validateVariables(
   *   ['user_name', 'achievement_name'],
   *   { user_name: 'Juan', achievement_name: 'Maestro' }
   * ); // OK
   *
   * this.validateVariables(
   *   ['user_name', 'achievement_name'],
   *   { user_name: 'Juan' }
   * ); // Throws: Missing variables: achievement_name
   */
  validateVariables(
    requiredVariables: string[],
    providedVariables: Record<string, string>,
  ): void {
    if (!requiredVariables || requiredVariables.length === 0) {
      return; // No hay variables requeridas
    }

    const missingVariables = requiredVariables.filter(
      (variable) => !(variable in providedVariables),
    );

    if (missingVariables.length > 0) {
      throw new BadRequestException(
        `Missing required variables: ${missingVariables.join(', ')}`,
      );
    }

    // Validar que las variables proporcionadas no estén vacías
    const emptyVariables = requiredVariables.filter(
      (variable) =>
        providedVariables[variable] === undefined ||
        providedVariables[variable] === null ||
        providedVariables[variable] === '',
    );

    if (emptyVariables.length > 0) {
      throw new BadRequestException(
        `Empty values for required variables: ${emptyVariables.join(', ')}`,
      );
    }
  }

  /**
   * Interpolar variables en un template string
   *
   * Soporta formato Mustache-style: {{variable_name}}
   *
   * @param template - String del template con placeholders
   * @param variables - Objeto con variables a reemplazar
   * @returns String con variables interpoladas
   *
   * @example
   * const result = this.interpolate(
   *   'Hola {{user_name}}, has desbloqueado {{achievement_name}}',
   *   { user_name: 'Juan', achievement_name: 'Maestro del Pensamiento' }
   * );
   * // Result: "Hola Juan, has desbloqueado Maestro del Pensamiento"
   */
  interpolate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      if (value === undefined) {
        // Si la variable no está en el objeto, dejar el placeholder
        return match;
      }
      return String(value);
    });
  }

  /**
   * Renderizar template completo (subject, body y HTML)
   *
   * 1. Obtiene el template por key
   * 2. Valida que todas las variables requeridas estén presentes
   * 3. Interpola variables en subject, body y HTML
   * 4. Retorna objeto con los 3 strings renderizados
   *
   * @param templateKey - Identificador del template
   * @param variables - Variables a interpolar
   * @returns Objeto con subject, body y html renderizados
   * @throws NotFoundException si el template no existe
   * @throws BadRequestException si faltan variables requeridas
   *
   * @example
   * const rendered = await this.templateService.renderTemplate(
   *   'achievement_unlocked',
   *   {
   *     user_name: 'Juan',
   *     achievement_name: 'Maestro del Pensamiento Crítico',
   *     achievement_icon: '🏆'
   *   }
   * );
   * // rendered.subject: "¡Felicidades Juan! Has desbloqueado un logro 🏆"
   * // rendered.body: "Has desbloqueado el logro 'Maestro del Pensamiento Crítico'..."
   * // rendered.html: "<html>...</html>"
   */
  async renderTemplate(
    templateKey: string,
    variables: Record<string, string>,
  ): Promise<{ subject: string; body: string; html: string }> {
    // 1. Obtener template
    const template = await this.findByKey(templateKey);

    // 2. Validar variables requeridas
    if (template.variables && template.variables.length > 0) {
      this.validateVariables(template.variables, variables);
    }

    // 3. Interpolar subject
    const subject = this.interpolate(template.subjectTemplate, variables);

    // 4. Interpolar body
    const body = this.interpolate(template.bodyTemplate, variables);

    // 5. Interpolar HTML (si existe)
    const html = template.htmlTemplate
      ? this.interpolate(template.htmlTemplate, variables)
      : body; // Fallback al body si no hay HTML

    return { subject, body, html };
  }

  /**
   * Activar o desactivar un template
   *
   * Templates inactivos no pueden ser usados para enviar notificaciones
   * Útil para deshabilitar temporalmente sin eliminar
   *
   * @param templateKey - Identificador del template
   * @param isActive - true para activar, false para desactivar
   * @throws NotFoundException si el template no existe
   *
   * @example
   * await this.templateService.toggleActive('system_announcement', false);
   */
  async toggleActive(templateKey: string, isActive: boolean): Promise<void> {
    const template = await this.templateRepository.findOne({
      where: { templateKey },
    });

    if (!template) {
      throw new NotFoundException(`Template with key '${templateKey}' not found`);
    }

    template.isActive = isActive;
    await this.templateRepository.save(template);
  }

  /**
   * Actualizar template
   *
   * IMPORTANTE: Solo admin puede actualizar templates
   * Templates de producción deben ser actualizados con cuidado
   *
   * @param templateKey - Identificador del template
   * @param updates - Campos a actualizar
   * @returns Template actualizado
   * @throws NotFoundException si el template no existe
   *
   * @example
   * const updated = await this.templateService.update('welcome_message', {
   *   subjectTemplate: 'Bienvenido {{user_name}} a GAMILIT',
   *   bodyTemplate: 'Hola {{user_name}}, te damos la bienvenida...'
   * });
   */
  async update(
    templateKey: string,
    updates: Partial<NotificationTemplate>,
  ): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({
      where: { templateKey },
    });

    if (!template) {
      throw new NotFoundException(`Template with key '${templateKey}' not found`);
    }

    // Aplicar updates
    Object.assign(template, updates);

    // No permitir cambiar el templateKey
    template.templateKey = templateKey;

    return this.templateRepository.save(template);
  }
}
