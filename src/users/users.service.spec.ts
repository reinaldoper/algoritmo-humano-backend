import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

type MockedPrisma = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: MockedPrisma;

  const prismaMock: MockedPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
    });

    const result = await service.createUser({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
    });
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(
      service.createUser({
        email: 'exists@test.com',
        password: '123456',
        name: 'Test',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return a user by id', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      courses: [],
    });

    const result = await service.findUserById(1);

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      courses: [],
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findUserById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'old@test.com',
      name: 'Old',
    });

    prisma.user.update.mockResolvedValue({
      id: 1,
      email: 'new@test.com',
      name: 'New',
    });

    const result = await service.updateUser(1, {
      email: 'new@test.com',
      name: 'New',
    });

    expect(result).toEqual({
      id: 1,
      email: 'new@test.com',
      name: 'New',
    });
  });

  it('should delete a user', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    prisma.user.delete.mockResolvedValue({ id: 1 });

    const result = await service.deleteUser(1);

    expect(result).toEqual({ id: 1 });
  });
});
