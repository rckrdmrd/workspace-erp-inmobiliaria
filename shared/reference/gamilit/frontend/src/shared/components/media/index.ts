/**
 * Media Components
 * Components for handling images, videos, and other media
 *
 * TODO: Stub file - needs full implementation
 */

// Placeholder exports to unblock compilation
export interface MediaUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
}

export interface MediaGalleryProps {
  items: Array<{ id: string; url: string; type: string }>;
  onSelect?: (id: string) => void;
}

export interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ExportButtonProps {
  data: unknown;
  filename?: string;
}

// Export placeholder components
export const MediaUploader = (_props: MediaUploaderProps) => null;
export const MediaGallery = (_props: MediaGalleryProps) => null;
export const FileUploader = (_props: FileUploaderProps) => null;
export const ExportButton = (_props: ExportButtonProps) => null;
export const VideoPlayer = () => null; // Placeholder for module5
