import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { JwtGuard } from 'src/core/guard';

@UseGuards(JwtGuard)
@Controller('fitness')
export class FitnessController {
  constructor(private fitnessService: FitnessService) {}
  @Post('progress')
  addNewLog() {}
  @Get('progress')
  listAllProgressLogs() {}
  @Get('progress/:id')
  getASingleProgressRecord(@Param('id') id: string) {}
  @Put('progress/:id')
  updateAProgressRecord(@Param('id') id: string) {}
  @Delete('progress/:id')
  deleteAProgressRecord(@Param('id') id: string) {}
  @Get('workouts')
  getAllWorkouts() {}
  @Post('workouts')
  createANewWorkout() {}
  @Put('workouts/:id')
  updateAWorkoutPlan(@Param('id') id: string) {}
  @Delete('workouts/:id')
  deleteAWorkoutPlan(@Param('id') id: string) {}
}
 