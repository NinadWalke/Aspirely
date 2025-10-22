import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    dob: Date

    @IsNotEmpty()
    @MinLength(6)
    password: string;

}