import { Controller, Get, Post, Put, Delete,Patch, Body, Param, Query, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        sub: number;
        email: string;
    };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    async findAll(
        @Request() req: AuthenticatedRequest,
        @Query('status') status?: 'completed' | 'pending',
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('dueDate') dueDate?: string,
    ) {
        return this.tasksService.findAll(req.user.sub, {
            status,
            category,
            search,
            dueDate
        });
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.findOne(id, req.user.sub);
    }

    @Post()
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.create(createTaskDto, req.user.sub);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.update(id, updateTaskDto, req.user.sub);
    }

    @Delete(':id')
        async remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.remove(id, req.user.sub);
    }

    @Patch(':id/complete')
    async toggleComplete(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.tasksService.toggleComplete(id, req.user.sub);
    }
}
