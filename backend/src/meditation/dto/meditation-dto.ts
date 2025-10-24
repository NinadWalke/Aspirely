import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  ArrayUnique,
} from 'class-validator';

export class MeditationDto {
  // Core session data
  @IsInt()
  @Min(1)
  duration: number; // in minutes, must be >= 1

  @IsString()
  @IsNotEmpty()
  technique: string; // e.g. "Mindfulness", "Breathing"

  @IsBoolean()
  @IsOptional()
  guided?: boolean;

  @IsString()
  @IsOptional()
  source?: string; // e.g. "Headspace", "YouTube"

  // Context and reflection
  @IsString()
  @IsOptional()
  moodBefore?: string;

  @IsString()
  @IsOptional()
  moodAfter?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  stressLevelBefore?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  stressLevelAfter?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  tags?: string[];
}
