/**
 * Media Types
 * Types for media files and resources
 */

export interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  name: string;
  size: number;
  mimeType: string;
  tags?: string[];
  uploadedAt: string;
  uploadedBy: string;
  altText?: string;
  description?: string;
  metadata?: MediaMetadata;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  [key: string]: unknown;
}

export interface MediaResource {
  id: string;
  url: string;
  type: string;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UseMediaLibraryResult {
  media: MediaItem[];
  loading: boolean;
  error: Error | null;
  uploadFile: (file: File) => Promise<MediaItem>;
  deleteFile: (id: string) => Promise<void>;
  updateFile: (id: string, updates: Partial<MediaItem>) => Promise<MediaItem>;
}
