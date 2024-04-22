import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';

// Define all DTOs before the AuthService class

class JwtTokenResponse {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;
}

class RegisterUserDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
    email: string;
    @ApiProperty({ example: 'strongpassword123', description: 'Password' })
    password: string;
}

@ApiTags('Authentication')
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    @ApiOperation({ summary: 'Validate user credentials' })
    @ApiResponse({ status: 200, description: 'User is valid' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async validateUser(email: string, pass: string): Promise<any> {
        const user: User = await this.usersService.findUserByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({ status: 201, description: 'User logged in successfully', type: JwtTokenResponse })
    @ApiResponse({ status: 401, description: 'Login failed' })
    async login(user: any) {
        const payload = { username: user.email, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterUserDto, description: 'Registration data' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Registration failed' })
    async register(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.createUser(email, hashedPassword);
        if (newUser) {
            const { password, ...result } = newUser;
            return result;
        }
        return null;
    }
}
