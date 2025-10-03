import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [AuthModule, UsersModule, TasksModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TasksService],
})
export class AppModule {}
