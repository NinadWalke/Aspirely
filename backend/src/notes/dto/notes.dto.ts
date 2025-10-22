import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NotesDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsOptional()
  tags: string;
}
