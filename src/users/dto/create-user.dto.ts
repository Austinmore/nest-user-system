import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'changeme', description: 'The password', minLength: 6 })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
    @IsString({ message: 'Full name must be a string' })
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    fullName: string; // Note the lowercase 'n'

    @ApiProperty({ example: '+123456789', description: 'The phone number of the user' })
    @IsPhoneNumber(null, { message: 'Invalid phone number' })
    phoneNumber: string;
}
