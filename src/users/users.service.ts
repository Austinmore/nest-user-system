import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Wallet } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user with the given details, encrypts the password,
   * and stores the user in the database.
   * 
   * @param email - User's email address
   * @param password - User's raw password
   * @param fullName - User's full name
   * @param phoneNumber - User's phone number
   * @returns The created user object including their wallet
   */
  async createUser(email: string, password: string, fullName: string, phoneNumber: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,  // Include the full name in the user record
        phoneNumber,  // Include the phone number in the user record
        wallet: {  // Automatically create a wallet for the new user
          create: { balance: 0 }
        }
      },
      include: { wallet: true }  // Include the related wallet object in the response
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(userId: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { email, password: hashedPassword },
    });
  }

  async deleteUser(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    const userWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (userWallet) {
      return this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance + amount },
      });
    } else {
      throw new Error("Wallet not found");
    }
  }

  async withdrawFromWallet(userId: string, amount: number): Promise<Wallet> {
    const userWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (userWallet && userWallet.balance >= amount) {
      return this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance - amount },
      });
    } else {
      throw new Error("Insufficient funds");
    }
  }
}
