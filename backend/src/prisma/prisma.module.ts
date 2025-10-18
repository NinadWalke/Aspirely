import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // PrismaService enabled app-wide without re-imports 
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
