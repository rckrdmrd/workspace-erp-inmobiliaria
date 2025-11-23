/**
 * Content Types
 * Types for content management and templates
 */

// Note: ContentStatus is already exported from educational.types
// Using the existing type to avoid conflicts

export interface ContentItem {
  id: string;
  title: string;
  type: ContentItemType;
  status: string; // Using string to avoid conflict with ContentStatus from educational.types
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type ContentItemType =
  | 'module'
  | 'exercise'
  | 'lesson'
  | 'assessment'
  | 'resource'
  | 'template';

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  type: ContentItemType;
  schema: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ContentApproval {
  id: string;
  contentId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}
