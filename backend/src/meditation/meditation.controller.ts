import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { MeditationService } from './meditation.service';

@Controller('meditation')
export class MeditationController {
  constructor(private meditationService: MeditationService) {}
  @Post() createANewMeditationLog() {}
  @Get() getAllMeditationLogs() {}
  @Get(':id') getSpecificMeditationLog() {}
  @Put(':id') updateSpecificMeditationLog() {}
  @Delete(':id') deleteSpecificMeditationLog() {}
}
