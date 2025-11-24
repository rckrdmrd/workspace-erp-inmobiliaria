import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationTypeEnum, NotificationData } from '@shared/constants/enums.constants';

export class NotificationResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Notification ID',
  })
  id!: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'User ID',
  })
  userId!: string;

  @ApiProperty({
    enum: NotificationTypeEnum,
    example: NotificationTypeEnum.MISSION_COMPLETED,
    description: 'Type of notification',
  })
  type!: NotificationTypeEnum;

  @ApiProperty({
    example: 'Mission Completed!',
    description: 'Notification title',
  })
  title!: string;

  @ApiProperty({
    example: 'You completed the "5 Daily Exercises" mission',
    description: 'Notification message',
  })
  message!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: {
      missionId: '123e4567-e89b-12d3-a456-426614174002',
      rewardType: 'ml_coins',
      amount: 50,
      action: {
        type: 'navigate',
        url: '/missions/123e4567-e89b-12d3-a456-426614174002',
      },
    },
    description: 'Additional notification data',
  })
  data!: NotificationData | null;

  @ApiProperty({
    example: false,
    description: 'Whether notification has been read',
  })
  read!: boolean;

  @ApiProperty({
    example: '2025-11-02T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2025-11-02T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}
