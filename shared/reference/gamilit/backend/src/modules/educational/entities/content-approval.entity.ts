import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ContentApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
}

export enum ContentApprovalType {
  MODULE = 'module',
  EXERCISE = 'exercise',
  ASSIGNMENT = 'assignment',
  RESOURCE = 'resource',
}

@Entity({ schema: 'educational_content', name: 'content_approvals' })
export class ContentApproval {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ContentApprovalType,
  })
  content_type!: ContentApprovalType;

  @Column('uuid')
  content_id!: string;

  @Column('uuid')
  submitted_by!: string;

  // NOTE: Cannot use @ManyToOne relation here because User is in 'auth' datasource
  // and ContentApproval is in 'educational' datasource.
  // TypeORM multi-datasource does not support cross-datasource relations.
  // Relation must be handled manually in service layer.

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  submitted_at!: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by?: string;

  // NOTE: Same as above - relation to User must be handled in service layer.

  @Column({ type: 'timestamp with time zone', nullable: true })
  reviewed_at?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ContentApprovalStatus,
    default: ContentApprovalStatus.PENDING,
  })
  status!: ContentApprovalStatus;

  @Column({ type: 'text', nullable: true })
  reviewer_notes?: string;

  @Column({ type: 'text', nullable: true })
  revision_notes?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
