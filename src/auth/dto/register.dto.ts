import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: 'El correo debe ser válido' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debo tener al menos 6 caracteres' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;
}