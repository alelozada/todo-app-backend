import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'El correo debe ser válido' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    email: string;
    
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}