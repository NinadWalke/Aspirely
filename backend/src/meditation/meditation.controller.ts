import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { MeditationService } from './meditation.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('meditation')
export class MeditationController {
  constructor(private meditationService: MeditationService) {}
  @Post() createANewMeditationLog() {}
  @Get() getAllMeditationLogs() {}
  @Get(':id') getSpecificMeditationLog() {}
  @Put(':id') updateSpecificMeditationLog() {}
  @Delete(':id') deleteSpecificMeditationLog() {}
}
