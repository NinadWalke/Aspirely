import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ForgotDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string
}