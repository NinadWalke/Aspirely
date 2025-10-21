import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getAllTasks() {}
  @Post()
  createATask(@Body() dto: TaskDto) {}
  @Get('history')
  getTaskHistory() {}
  @Get(':id') viewTaskDetails(@Param('id') id: string) {}
  @Put(':id') updateTaskDetails(
    @Param('id') id: string,
    @Body() dto: TaskDto,
  ) {}
  @Delete(':id') deleteATask(@Param('id') id: string) {}
}
