import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaResource } from '../entities';
import { DB_SCHEMAS } from '@shared/constants';
import { ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * MediaService
 *
 * Servicio para gestionar recursos multimedia (imágenes, videos, audio, documentos).
 * Incluye operaciones CRUD y gestión de estado de procesamiento.
 */
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaResource, 'educational')
    private readonly mediaRepo: Repository<MediaResource>,
  ) {}

  /**
   * Obtener todos los recursos multimedia
   */
  async findAll(): Promise<MediaResource[]> {
    return await this.mediaRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener un recurso multimedia por ID
   */
  async findById(id: string): Promise<MediaResource | null> {
    return await this.mediaRepo.findOne({ where: { id } });
  }

  /**
   * Crear un nuevo recurso multimedia
   */
  async create(mediaData: Partial<MediaResource>): Promise<MediaResource> {
    // Validar que la URL esté presente
    if (!mediaData.url) {
      throw new BadRequestException('URL is required for media resource');
    }

    const media = this.mediaRepo.create(mediaData);
    return await this.mediaRepo.save(media);
  }

  /**
   * Actualizar un recurso multimedia existente
   */
  async update(
    id: string,
    mediaData: Partial<MediaResource>,
  ): Promise<MediaResource> {
    const media = await this.findById(id);
    if (!media) {
      throw new NotFoundException(`Media resource with ID ${id} not found`);
    }

    await this.mediaRepo.update(id, mediaData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Media resource with ID ${id} not found after update`);
    }
    return updated;
  }

  /**
   * Eliminar un recurso multimedia
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.mediaRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Actualizar el estado de procesamiento de un recurso multimedia
   * Permite cambiar el estado: uploading -> processing -> ready (o error)
   */
  async updateProcessingStatus(
    id: string,
    status: ProcessingStatusEnum,
    metadata?: Record<string, any>,
  ): Promise<MediaResource> {
    const media = await this.findById(id);
    if (!media) {
      throw new NotFoundException(`Media resource with ID ${id} not found`);
    }

    // Validar transición de estado
    this.validateStatusTransition(media.processing_status, status);

    const updateData: Partial<MediaResource> = {
      processing_status: status,
    };

    // Si hay metadata, incluirla
    if (metadata) {
      updateData.metadata = {
        ...media.metadata,
        ...metadata,
      };
    }

    await this.mediaRepo.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Media resource with ID ${id} not found after update`);
    }
    return updated;
  }

  /**
   * Validar la transición de estado de procesamiento
   */
  private validateStatusTransition(
    currentStatus: ProcessingStatusEnum,
    newStatus: ProcessingStatusEnum,
  ): void {
    const validTransitions: Record<ProcessingStatusEnum, ProcessingStatusEnum[]> =
      {
        [ProcessingStatusEnum.UPLOADING]: [
          ProcessingStatusEnum.PROCESSING,
          ProcessingStatusEnum.ERROR,
        ],
        [ProcessingStatusEnum.PROCESSING]: [
          ProcessingStatusEnum.READY,
          ProcessingStatusEnum.OPTIMIZING,
          ProcessingStatusEnum.ERROR,
        ],
        [ProcessingStatusEnum.OPTIMIZING]: [
          ProcessingStatusEnum.READY,
          ProcessingStatusEnum.ERROR,
        ],
        [ProcessingStatusEnum.READY]: [
          ProcessingStatusEnum.OPTIMIZING,
          ProcessingStatusEnum.ERROR,
        ],
        [ProcessingStatusEnum.ERROR]: [
          ProcessingStatusEnum.UPLOADING,
          ProcessingStatusEnum.PROCESSING,
        ],
      };

    if (
      !validTransitions[currentStatus] ||
      !validTransitions[currentStatus].includes(newStatus)
    ) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  /**
   * Obtener recursos multimedia activos
   */
  async findActive(): Promise<MediaResource[]> {
    return await this.mediaRepo.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener recursos multimedia por categoría
   */
  async findByCategory(category: string): Promise<MediaResource[]> {
    return await this.mediaRepo.find({
      where: { category },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Obtener recursos multimedia públicos (listos para estudiantes)
   */
  async findPublic(): Promise<MediaResource[]> {
    return await this.mediaRepo.find({
      where: {
        is_public: true,
        is_active: true,
        processing_status: ProcessingStatusEnum.READY,
      },
      order: { created_at: 'DESC' },
    });
  }
}
