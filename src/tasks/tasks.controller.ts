import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('tasks')
export class TasksController {}
