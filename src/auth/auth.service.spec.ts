import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

type MockedPrisma = {
  user: {
    findUnique: jest.Mock;
  };
};

type MockedJwtService = {
  sign: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: MockedPrisma;
  let jwt: MockedJwtService;

  const prismaMock: MockedPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const jwtMock: MockedJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const dto: LoginDto = { email: 'test@test.com', password: '123456' };

    await expect(service.validateUser(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      password: 'hashed',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const dto: LoginDto = { email: 'test@test.com', password: 'wrong' };

    await expect(service.validateUser(dto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return user when credentials are valid', async () => {
    const user = {
      id: 1,
      email: 'test@test.com',
      password: 'hashed',
    };

    prisma.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const dto: LoginDto = { email: 'test@test.com', password: '123456' };

    const result = await service.validateUser(dto);

    expect(result).toEqual(user);
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB error'));

    const dto: LoginDto = { email: 'test@test.com', password: '123456' };

    await expect(service.validateUser(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should generate a JWT token', () => {
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: 'hashed',
      name: 'Test User',
      createdAt: new Date(),
    };

    jwt.sign.mockReturnValue('signed-token');

    const result = service.generateToken(user);

    expect(result).toBe('signed-token');
    expect(jwt.sign).toHaveBeenCalledWith({
      userId: 1,
      email: 'test@test.com',
    });
  });
});
