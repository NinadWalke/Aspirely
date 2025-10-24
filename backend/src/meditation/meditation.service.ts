import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditMeditationDto, MeditationDto } from './dto';

@Injectable()
export class MeditationService {
  constructor(private prisma: PrismaService) {}
  async createANewMeditationLog(userId: string, dto: MeditationDto) {
    const createdLog = await this.prisma.meditationLog.create({
      data: {
        userId: userId,
        ...dto
      },
    });
    return createdLog;
  }
  async getAllMeditationLogs(userId: string) {
    const meditationLogs = await this.prisma.meditationLog.findMany({where: {userId: userId}});
    return meditationLogs;
  }
  async getSpecificMeditationLog(logId: string) {
    const meditationLog = await this.prisma.meditationLog.findUnique({where: {id: logId}});
    return meditationLog;
  }
  async updateSpecificMeditationLog(logId: string, dto: EditMeditationDto) {
    const updatedLog = await this.prisma.meditationLog.update({where: {id: logId}, data: {
        ...dto
    }});
    return updatedLog;
  }
  async deleteSpecificMeditationLog(logId: string) {
    const deletedLog = await this.prisma.meditationLog.delete({where: {id: logId}});
    return deletedLog;
  }
}
