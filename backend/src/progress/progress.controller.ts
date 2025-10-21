import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}
  @Get()
  getOverallProgress() {}
  @Post()
  addANewCustomProgressRecord() {}
  @Get(':id')
  getDetailsOfACustomProgressRecord() {}
  @Put(':id')
  updateACustomProgressRecord() {}
  @Delete(':id')
  deleteACustomProgressRecord() {}
}
