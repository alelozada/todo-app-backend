import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async findAll(userId: number, filters?: {
        status?: 'completed' | 'pending';
        category?: string;
        search?: string;
        dueDate?: string;
    }) {
        const where: any = { userId };
        
        // Filtro por estado
        if (filters?.status) {
            where.completed = filters.status === 'completed';
        }

        // Filtro por categoría
        if (filters?.category) {
            where.category = filters.category;
        }

        // Filtro por fecha
        if (filters?.dueDate) {
            where.dueDate = {
                equals: new Date(filters.dueDate),
            };
        }

        // Filtro en título & descripción
        if (filters?.search) {
            where.OR = [
                { title: {contains: filters.search, mode: 'insensitive' } },
                { description: {contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number, userId: number) {
        const task = await this.prisma.task.findFirst({
            where: { id, userId },
        });

        if(!task) {
                throw new NotFoundException('Tarea no encontrada');
        }

        return task;
    }

    async create(createTaskDto: CreateTaskDto, userId: number) {
        return this.prisma.task.create({
            data: {
                ...createTaskDto,
                userId,
                dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
            },
        });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
        await this.findOne(id, userId);

        return this.prisma.task.update({
            where: { id },
            data: {
                ...updateTaskDto,
                dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,
            },
        });
    }

    async remove (id: number, userId: number) {
        await this.findOne(id, userId);

        return this.prisma.task.delete({
            where: { id },
        });
    }

    async toggleComplete(id: number, userId: number) {
        const task = await this.findOne(id, userId);

        return this.prisma.task.update({
            where: { id },
            data: { completed: !task.completed },
        });
    }
}
