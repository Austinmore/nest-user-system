import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto'; 
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto.email, createUserDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
        // Removed the unary plus operator
        return this.userService.updateUser(id, createUserDto.email, createUserDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        // Removed the unary plus operator
        return this.userService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/wallet/fund')
    async fundWallet(@Param('id') id: string, @Body() amount: { value: number }) {
        // Removed the unary plus operator
        return this.userService.fundWallet(id, amount.value);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/wallet/withdraw')
    async withdrawFromWallet(@Param('id') id: string, @Body() amount: { value: number }) {
        // Removed the unary plus operator
        return this.userService.withdrawFromWallet(id, amount.value);
    }
}
