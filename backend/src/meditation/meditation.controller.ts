import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MeditationService } from './meditation.service';
import { JwtGuard } from 'src/core/guard';
import { EditMeditationDto, MeditationDto } from './dto';
import { GetUser } from 'src/core/decorator';
import type { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('meditation')
export class MeditationController {
  constructor(private meditationService: MeditationService) {}
  @Post()
  createANewMeditationLog(@GetUser() user: User, @Body() dto: MeditationDto) {
    const userId = user?.id;
    if (!userId)
      return { statusCode: 404, message: 'User missing from the server' };
    return this.meditationService.createANewMeditationLog(userId, dto);
  }
  @Get() getAllMeditationLogs(@GetUser() user: User) {
    const userId = user?.id;
    if (!userId)
      return { statusCode: 404, message: 'User missing from the server' };
    return this.meditationService.getAllMeditationLogs(userId);
  }
  @Get(':id') getSpecificMeditationLog(@Param('id') id: string) {
    return this.meditationService.getSpecificMeditationLog(id);
  }
  @Put(':id') updateSpecificMeditationLog(
    @Param('id') id: string,
    @Body() dto: EditMeditationDto,
  ) {
    return this.meditationService.updateSpecificMeditationLog(id, dto);
  }
  @Delete(':id') deleteSpecificMeditationLog(@Param('id') id: string) {
    return this.meditationService.deleteSpecificMeditationLog(id);
  }
}
