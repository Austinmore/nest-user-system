// src/users/users.module.ts

import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Global()  // Making this module global because it uses PrismaService which might be used elsewhere
@Module({
  imports: [],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService, PrismaService]  // Also export PrismaService if it needs to be used by other modules
})
export class UsersModule {}
