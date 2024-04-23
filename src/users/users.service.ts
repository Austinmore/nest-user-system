import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Wallet } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
    // Debugging log to check if PrismaService is injected properly
    console.log('UsersService instantiated:', !!this.prisma);
  }

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        wallet: {
          create: { balance: 0 }
        }
      },
      include: { wallet: true }
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async updateUser(userId: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { email, password: hashedPassword }
    });
  }

  async deleteUser(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId }
    });
  }

  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    const userWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (userWallet) {
      return this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance + amount }
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
        data: { balance: userWallet.balance - amount }
      });
    } else {
      throw new Error("Insufficient funds");
    }
  }
}
