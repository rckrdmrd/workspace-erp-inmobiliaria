import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MediaFile } from '../entities';
import { CreateMediaFileDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants';
import { ProcessingStatusEnum } from '@shared/constants/enums.constants';

/**
 * MediaFilesService
 *
 * @description Gestión completa de archivos multimedia del sistema.
 *              - CRUD de archivos multimedia
 *              - Filtrado por tipo, estado, tags
 *              - Workflow de procesamiento (uploading → processing → ready/error)
 *              - Estadísticas de almacenamiento y uso
 *              - Generación de thumbnails
 */
@Injectable()
export class MediaFilesService {
  constructor(
    @InjectRepository(MediaFile, 'content')
    private readonly mediaRepo: Repository<MediaFile>,
  ) {}

  /**
   * Registra un nuevo archivo multimedia
   *
   * @param dto - Datos del archivo
   * @returns Archivo registrado
   */
  async create(dto: CreateMediaFileDto): Promise<MediaFile> {
    const mediaFile = this.mediaRepo.create(dto);
    return await this.mediaRepo.save(mediaFile);
  }

  /**
   * Obtiene todos los archivos con filtros opcionales
   *
   * @param fileType - Tipo de archivo (opcional)
   * @param status - Estado de procesamiento (opcional)
   * @returns Lista de archivos
   */
  async findAll(fileType?: string, status?: string): Promise<MediaFile[]> {
    const query = this.mediaRepo.createQueryBuilder('mf');

    if (fileType) {
      query.andWhere('mf.media_type = :fileType', { fileType });
    }

    if (status) {
      query.andWhere('mf.processing_status = :status', { status });
    }

    return await query.orderBy('mf.created_at', 'DESC').getMany();
  }

  /**
   * Busca un archivo por ID
   *
   * @param id - ID del archivo
   * @returns Archivo encontrado
   * @throws NotFoundException si no existe
   */
  async findById(id: string): Promise<MediaFile> {
    const mediaFile = await this.mediaRepo.findOne({
      where: { id },
    });

    if (!mediaFile) {
      throw new NotFoundException(`Media file ${id} not found`);
    }

    return mediaFile;
  }

  /**
   * Actualiza metadata de un archivo
   *
   * @param id - ID del archivo
   * @param dto - Datos parciales a actualizar
   * @returns Archivo actualizado
   * @throws NotFoundException si no existe
   */
  async update(id: string, dto: Partial<CreateMediaFileDto>): Promise<MediaFile> {
    const mediaFile = await this.findById(id);

    Object.assign(mediaFile, dto);

    return await this.mediaRepo.save(mediaFile);
  }

  /**
   * Elimina un archivo del sistema
   * Note: En producción también debería eliminar el archivo físico del storage
   *
   * @param id - ID del archivo
   * @returns void
   * @throws NotFoundException si no existe
   */
  async delete(id: string): Promise<void> {
    const mediaFile = await this.findById(id);

    // TODO: Implementar eliminación del archivo físico del storage
    // await this.storageService.deleteFile(mediaFile.storage_path);

    await this.mediaRepo.remove(mediaFile);
  }

  /**
   * Busca archivos por tipo de media
   *
   * @param fileType - Tipo de archivo (image, video, audio, document, etc.)
   * @returns Lista de archivos del tipo especificado
   */
  async findByType(fileType: string): Promise<MediaFile[]> {
    return await this.mediaRepo.find({
      where: { media_type: fileType as any },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Busca archivos por tags (búsqueda por intersección)
   *
   * @param tags - Lista de tags a buscar
   * @returns Lista de archivos que contienen alguno de los tags
   */
  async findByTags(tags: string[]): Promise<MediaFile[]> {
    const query = this.mediaRepo
      .createQueryBuilder('mf')
      .where('mf.tags && :tags', { tags });

    return await query.orderBy('mf.created_at', 'DESC').getMany();
  }

  /**
   * Actualiza el estado de procesamiento de un archivo
   *
   * @param id - ID del archivo
   * @param status - Nuevo estado (uploading, processing, ready, error, optimizing)
   * @returns Archivo con estado actualizado
   * @throws NotFoundException si no existe
   */
  async updateProcessingStatus(id: string, status: ProcessingStatusEnum): Promise<MediaFile> {
    const mediaFile = await this.findById(id);

    mediaFile.processing_status = status;

    return await this.mediaRepo.save(mediaFile);
  }

  /**
   * Obtiene estadísticas de almacenamiento
   *
   * @returns Estadísticas agregadas (tamaño total, conteos por tipo)
   */
  async getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    countsByType: Record<string, number>;
    avgFileSize: number;
  }> {
    // Total de archivos
    const totalFiles = await this.mediaRepo.count();

    // Tamaño total en bytes
    const sizeResult = await this.mediaRepo
      .createQueryBuilder('mf')
      .select('SUM(mf.file_size_bytes)', 'total')
      .getRawOne();

    const totalSize = parseInt(sizeResult?.total || '0', 10);

    // Conteos por tipo
    const typeResults = await this.mediaRepo
      .createQueryBuilder('mf')
      .select('mf.media_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('mf.media_type')
      .getRawMany();

    const countsByType: Record<string, number> = {};
    typeResults.forEach((row) => {
      countsByType[row.type] = parseInt(row.count, 10);
    });

    const avgFileSize = totalFiles > 0 ? Math.floor(totalSize / totalFiles) : 0;

    return {
      totalFiles,
      totalSize,
      countsByType,
      avgFileSize,
    };
  }

  /**
   * Busca archivos subidos por un usuario específico
   *
   * @param uploaderId - ID del usuario uploader
   * @returns Lista de archivos subidos por el usuario
   */
  async findByUploader(uploaderId: string): Promise<MediaFile[]> {
    return await this.mediaRepo.find({
      where: { uploaded_by: uploaderId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Genera o actualiza thumbnail para un archivo (placeholder)
   * Note: Implementación real requeriría integración con servicio de procesamiento de imágenes/videos
   *
   * @param id - ID del archivo
   * @returns Archivo con thumbnail actualizado
   * @throws NotFoundException si no existe
   */
  async generateThumbnail(id: string): Promise<MediaFile> {
    const mediaFile = await this.findById(id);

    // TODO: Implementar generación real de thumbnails
    // Para imágenes: resize con sharp/imagemagick
    // Para videos: extraer frame con ffmpeg
    // Actualizar thumbnail_url con la URL generada

    // Placeholder: marcar como procesado
    mediaFile.processing_status = ProcessingStatusEnum.READY;

    return await this.mediaRepo.save(mediaFile);
  }

  /**
   * Incrementa contadores de uso del archivo
   *
   * @param id - ID del archivo
   * @param counterType - Tipo de contador ('usage' | 'download' | 'view')
   * @returns Archivo con contador actualizado
   * @throws NotFoundException si no existe
   */
  async incrementCounter(
    id: string,
    counterType: 'usage' | 'download' | 'view',
  ): Promise<MediaFile> {
    const mediaFile = await this.findById(id);

    switch (counterType) {
      case 'usage':
        mediaFile.usage_count += 1;
        break;
      case 'download':
        mediaFile.download_count += 1;
        break;
      case 'view':
        mediaFile.view_count += 1;
        break;
    }

    return await this.mediaRepo.save(mediaFile);
  }
}
