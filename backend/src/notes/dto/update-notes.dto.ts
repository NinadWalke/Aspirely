import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNotesDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  content: string;
  @IsString()
  @IsOptional()
  tags: string;
}
