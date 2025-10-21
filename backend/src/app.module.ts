import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { FitnessModule } from './fitness/fitness.module';
import { NotesModule } from './notes/notes.module';
import { MeditationModule } from './meditation/meditation.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, TasksModule, FitnessModule, NotesModule, MeditationModule, ProgressModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
