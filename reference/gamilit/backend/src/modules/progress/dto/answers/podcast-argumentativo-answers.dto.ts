import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

/**
 * PodcastArgumentativoAnswersDto
 *
 * @description DTO for validating Podcast Argumentativo (Module 3.4) answers
 * Audio/script production exercise
 *
 * Expected format:
 * {
 *   "topicId": "topic1",
 *   "script": "Lengthy podcast script...",
 *   "audioUrl": "https://storage.example.com/podcast.mp3" (optional)
 * }
 */
export class PodcastArgumentativoAnswersDto {
  /**
   * Selected topic ID
   */
  @IsString()
  @IsNotEmpty({ message: 'topicId is required' })
  topicId!: string;

  /**
   * Podcast script (minimum 200 characters)
   */
  @IsString()
  @IsNotEmpty({ message: 'script is required' })
  @MinLength(200, { message: 'script must be at least 200 characters' })
  script!: string;

  /**
   * Optional URL to uploaded audio file
   */
  @IsString()
  @IsOptional()
  audioUrl?: string;
}
