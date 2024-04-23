import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // It's safer to use environment variables
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule 
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule]  
})
export class AuthModule {}
