import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email }});
    }

    async create(userData: { email: string; password: string; name: string }) {
        return this.prisma.user.create({ data: userData });
    }
}
