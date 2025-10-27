import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtGuard } from 'src/core/guard';

@UseGuards(JwtGuard)
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
