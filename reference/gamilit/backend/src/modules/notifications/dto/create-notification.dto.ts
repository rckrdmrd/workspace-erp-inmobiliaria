import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsObject,
  MaxLength,
} from 'class-validator';
import { NotificationTypeEnum, NotificationData } from '@shared/constants/enums.constants';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send notification to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    enum: NotificationTypeEnum,
    description: 'Type of notification',
    example: NotificationTypeEnum.MISSION_COMPLETED,
  })
  @IsEnum(NotificationTypeEnum)
  type!: NotificationTypeEnum;

  @ApiProperty({
    description: 'Notification title',
    example: 'Mission Completed!',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'You completed the "5 Daily Exercises" mission. Claim your rewards!',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  message!: string;

  @ApiProperty({
    description: 'Additional notification data',
    required: false,
    example: {
      missionId: '123e4567-e89b-12d3-a456-426614174002',
      rewardType: 'ml_coins',
      amount: 50,
      icon: 'trophy',
      action: {
        type: 'navigate',
        url: '/missions/123e4567-e89b-12d3-a456-426614174002',
      },
    },
  })
  @IsOptional()
  @IsObject()
  data?: NotificationData;
}
