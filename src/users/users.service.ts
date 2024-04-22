import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Wallet } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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


async findUserByEmail(email: string): Promise<User | undefined> {
  return this.prisma.user.findUnique({
      where: { email }
  });
}

  async updateUser(userId: number, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { email, password: hashedPassword },
    });
  }

  async deleteUser(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async fundWallet(userId: number, amount: number): Promise<Wallet> {
    const userWallet = await this.prisma.wallet.findUnique({ where: { userId: userId } });
    return this.prisma.wallet.update({
      where: { id: userWallet.id },
      data: { balance: userWallet.balance + amount },
    });
  }

  async withdrawFromWallet(userId: number, amount: number): Promise<Wallet> {
    const userWallet = await this.prisma.wallet.findUnique({ where: { userId: userId } });
    if (userWallet.balance >= amount) {
      return this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance - amount },
      });
    } else {
      throw new Error("Insufficient funds");
    }
  }
}

