import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('users')  // Tag for all endpoints in this controller for organized documentation
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })  // Descriptive summary for Swagger documentation
  @ApiBody({ type: CreateUserDto })  // Inform Swagger about the body's expected type
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createUser(@Body() createUserDto: CreateUserDto) {  // Use DTO here
    return this.userService.createUser(createUserDto.email, createUserDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.updateUser(+id, createUserDto.email, createUserDto.password);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })

  async deleteUser
  (@Req() request: Request) {

    const userid = request["user"].sub
    return this.userService.deleteUser(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/wallet/fund')
  @ApiOperation({ summary: 'Fund user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet funded successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async fundWallet(@Param('id') id: string, @Body() amount: { value: number }) {
    return this.userService.fundWallet(+id, amount.value);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/wallet/withdraw')
  @ApiOperation({ summary: 'Withdraw from user wallet' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async withdrawFromWallet(@Param('id') id: string, @Body() amount: { value: number }) {
    return this.userService.withdrawFromWallet(+id, amount.value);
  }
}
