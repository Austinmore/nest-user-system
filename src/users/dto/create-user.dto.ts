import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'changeme', description: 'The password', minLength: 6 })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;


    @ApiProperty({ example: 'anyOptionalValue', description: 'An optional field', required: false })
    @IsString({ each: true, message: 'OptionalField must be a string' })
    @IsOptional()
    optionalField?: string; 
}
