import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

// Prisma imports
import type { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  // get /tasks
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllTasks(@GetUser() user: User) {
    const userTasks = await this.tasksService.returnUsersAllTasks(user.id);
    return { tasks: userTasks };
  }
  // post /tasks
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createATask(@GetUser() user: User, @Body() dto: TaskDto) {
    const createdTask = await this.tasksService.createTaskForUser(user.id, dto);
    return createdTask;
  }
  // get /tasks/history
  @Get('history')
  async getTaskHistory(@GetUser() user: User) {
    const completedTasks = await this.tasksService.getUsersTaskHistory(user.id);
    return completedTasks;
  }
  // get /tasks/:id
  @Get(':id')
  async viewTaskDetails(@Param('id') id: string) {
    const currentTask = await this.tasksService.viewUsersTaskDetails(id);
    return currentTask;
  }
  // patch /tasks/:id
  @Patch(':id')
  async markTaskCompleted(@Param('id') id: string) {
    const taskMarkedCompleted =
      await this.tasksService.markCurrentTaskCompleted(id);
    return taskMarkedCompleted;
  }
  // put /tasks/:id
  @Put(':id')
  async updateTaskDetails(@Param('id') id: string, @Body() dto: TaskDto) {
    const updatedTask = await this.tasksService.updateUsersTaskDetails(id, dto);
    return updatedTask;
  }
  // delete /tasks/:id
  @Delete(':id') 
  async deleteATask(@Param('id') id: string) {
    const deletedTask = await this.tasksService.deleteUsersTask(id);
    return {taskDeleted: true, deletedTask};
  }
}
