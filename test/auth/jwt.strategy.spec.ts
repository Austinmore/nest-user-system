import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: 'ConfigService',
                    useValue: { get: jest.fn().mockReturnValue('YOUR_SECRET_KEY') },
                },
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    describe('validate', () => {
        it('should validate and return the user based on JWT payload', async () => {
            const payload = { username: 'testuser', sub: '12345' };
            expect(await jwtStrategy.validate(payload)).toEqual({
                userId: payload.sub,
                username: payload.username,
            });
        });

        it('should throw UnauthorizedException if key elements in the payload are missing', async () => {
            const payload = { username: 'testuser' }; // sub is missing
            await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
        });
    });
});
