/**
 * Content Management DTOs - Barrel Export
 *
 * @description Exporta todos los DTOs del módulo Content Management.
 * @usage import { CreateContentTemplateDto, ContentTemplateResponseDto, ... } from '@modules/content/dto';
 */

// Content Templates DTOs
export { CreateContentTemplateDto } from './create-content-template.dto';
export { ContentTemplateResponseDto } from './content-template-response.dto';

// Marie Curie Content DTOs
export { CreateMarieCurieContentDto } from './create-marie-curie-content.dto';
export { MarieCurieContentResponseDto } from './marie-curie-content-response.dto';

// Media Files DTOs
export { CreateMediaFileDto } from './create-media-file.dto';
export { MediaFileResponseDto } from './media-file-response.dto';

// Content Authors DTOs ✨ NUEVO - P2
export { CreateContentAuthorDto } from './create-content-author.dto';
export { UpdateContentAuthorDto } from './update-content-author.dto';

// Content Categories DTOs ✨ NUEVO - P2
export { CreateContentCategoryDto } from './create-content-category.dto';
export { UpdateContentCategoryDto } from './update-content-category.dto';
