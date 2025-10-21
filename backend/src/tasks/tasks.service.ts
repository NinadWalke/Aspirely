import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  // get all users tasks
  async returnUsersAllTasks(userId: string) {
    const userTasks = await this.prisma.task.findMany({
      where: { userId: userId },
    });
    return userTasks;
  }
  // create a task
  async createTaskForUser(userId: string, taskData: TaskDto) {
    const createdTask = await this.prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        userId: userId,
      },
    });
    return { taskCreated: true, task: createdTask };
  }
  // get the task history [all tasks which are marked completed]
  async getUsersTaskHistory(userId: string) {
    const completedTasks = await this.prisma.task.findMany({
      where: { completed: true },
    });
    return { completedTasks: completedTasks };
  }
  // view the current task details
  async viewUsersTaskDetails(taskId: string) {
    const currentTask = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    return currentTask;
  }
  // mark current task completed
  async markCurrentTaskCompleted(taskId: string) {
    const completedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { completed: true },
    });
    return completedTask;
  }
  // update the current open task
  async updateUsersTaskDetails(taskId: string, dto: TaskDto) {
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate,
      },
    });
    return updatedTask;
  }
  // delete the current task on user command
  async deleteUsersTask(taskId: string) {
    const deletedTask = await this.prisma.task.delete({where: {id: taskId}});
    return deletedTask;
  }
}
