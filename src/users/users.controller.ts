import { Controller, Post, Body, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Sign up', description: 'Create a new user account.' })
    @ApiResponse({ status: 201, description: 'User successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto.email, createUserDto.password, createUserDto.fullName, createUserDto.phoneNumber);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
        return this.usersService.updateUser(id, createUserDto.email, createUserDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/wallet/fund')
    async fundWallet(@Param('id') id: string, @Body() amount: { value: number }) {
        return this.usersService.fundWallet(id, amount.value);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/wallet/withdraw')
    async withdrawFromWallet(@Param('id') id: string, @Body() amount: { value: number }) {
        return this.usersService.withdrawFromWallet(id, amount.value);
    }
}
