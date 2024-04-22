import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';  
import { PrismaModule } from '../prisma/prisma.module'; 
@Module({
    imports: [
        JwtModule.register({
            secret: 'SECRET_KEY',  // secret production
            signOptions: { expiresIn: '1h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService],
})
export class AuthModule {}
