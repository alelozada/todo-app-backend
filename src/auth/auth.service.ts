import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {

        console.log('Reguster DTI received: ', registerDto);

        if(!registerDto || !registerDto.email) {
            throw new ConflictException('Datos de registro inválidos');
        }

        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        return this.generateToken(user.id, user.email);
    }

    async login(loginDto: LoginDto) {

        console.log('Login DTO received:', loginDto);

        if (!loginDto || !loginDto.email) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.generateToken(user.id, user.email);
    }

    private async generateToken(userId: number, email: string) {
        const payload = { sub: userId, email: email };
        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            user: {
                id: userId,
                email: email,
            },
        };
    }
}
