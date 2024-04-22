import { IsNumber, IsOptional, IsString, IsEmail, IsArray } from 'class-validator';

export class JwtPayloadDto {
    @IsNumber()
    @IsOptional()
    userId?: number;  // Optional: User ID, can be omitted if 'sub' is used

    @IsEmail()
    @IsOptional()
    email?: string;  // Optional: User email

    @IsArray()
    @IsOptional()
    roles?: string[];  // Optional: Roles array for RBAC

    @IsString()
    @IsOptional()
    username?: string;  // Optional: Username, for display or logging

    @IsString()
    @IsOptional()
    sub?: string;  // Optional: Subject identifier, alternative to userId
}
