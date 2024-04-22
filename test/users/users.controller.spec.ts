import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';  
import { PrismaService } from '../../src/prisma/prisma.service';  
import * as bcrypt from 'bcryptjs';


const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  wallet: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', walletId: 1 };
      prismaService.user.create.mockResolvedValue(user);
      const result = await service.createUser('test@example.com', 'password');
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = { id: 1, email: 'updated@example.com', password: 'updatedPassword' };
      prismaService.user.update.mockResolvedValue(user);
      const result = await service.updateUser(1, 'updated@example.com', 'password');
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const user = { id: 1, email: 'delete@example.com', password: 'password' };
      prismaService.user.delete.mockResolvedValue(user);
      const result = await service.deleteUser(1);
      expect(prismaService.user.delete).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('wallet operations', () => {
    it('should fund a wallet', async () => {
      const wallet = { id: 1, balance: 100, userId: 1 };
      prismaService.wallet.findUnique.mockResolvedValue(wallet);
      prismaService.wallet.update.mockResolvedValue({ ...wallet, balance: 150 });
      const result = await service.fundWallet(1, 50);
      expect(prismaService.wallet.update).toHaveBeenCalled();
      expect(result.balance).toEqual(150);
    });

    it('should throw error if wallet not found for funding', async () => {
      prismaService.wallet.findUnique.mockResolvedValue(null);
      await expect(service.fundWallet(1, 50)).rejects.toThrow('Wallet not found');
    });

    it('should withdraw from a wallet', async () => {
      const wallet = { id: 1, balance: 150, userId: 1 };
      prismaService.wallet.findUnique.mockResolvedValue(wallet);
      prismaService.wallet.update.mockResolvedValue({ ...wallet, balance: 100 });
      const result = await service.withdrawFromWallet(1, 50);
      expect(prismaService.wallet.update).toHaveBeenCalled();
      expect(result.balance).toEqual(100);
    });

    it('should throw error if insufficient funds', async () => {
      const wallet = { id: 1, balance: 30, userId: 1 };
      prismaService.wallet.findUnique.mockResolvedValue(wallet);
      await expect(service.withdrawFromWallet(1, 50)).rejects.toThrow('Insufficient funds');
    });
  });
});
