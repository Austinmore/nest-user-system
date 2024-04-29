import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Wallet } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    return this.prisma.$transaction(async () => {
      const userWallet = await this.prisma.wallet.findUnique({ where: { userId } });
      if (!userWallet) {
        throw new Error("Wallet not found");
      }
      return await this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance + amount },
      });
    });
  }

  async withdrawFromWallet(userId: string, amount: number): Promise<Wallet> {
    return this.prisma.$transaction(async () => {
      const userWallet = await this.prisma.wallet.findUnique({ where: { userId } });
      if (!userWallet || userWallet.balance < amount) {
        throw new Error("Insufficient funds");
      }
      return await this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: { balance: userWallet.balance - amount },
      });
    });
  }
}
