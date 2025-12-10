import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import express from 'express';

type MockedAuthService = {
  validateUser: jest.Mock;
  generateToken: jest.Mock;
};

type MockedUsersService = {
  createUser: jest.Mock;
};

const mockResponse = () =>
  ({
    cookie: jest.fn(() => undefined),
    clearCookie: jest.fn(() => undefined),
  }) as unknown as express.Response;

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockedAuthService;
  let usersService: MockedUsersService;

  const authServiceMock: MockedAuthService = {
    validateUser: jest.fn(),
    generateToken: jest.fn(),
  };

  const usersServiceMock: MockedUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login successfully and set cookie', async () => {
    const dto: LoginDto = { email: 'test@test.com', password: '123456' };
    const user = {
      id: 1,
      email: 'test@test.com',
      password: 'hashed',
      name: 'Test',
    };

    const res = mockResponse();

    authService.validateUser.mockResolvedValue(user);
    authService.generateToken.mockReturnValue('token123');

    const result = await controller.login(dto, res);

    expect(result).toEqual({
      message: 'Login successful',
      access_token: 'token123',
    });

    expect(authService.validateUser).toHaveBeenCalledWith(dto);
    expect(authService.generateToken).toHaveBeenCalledWith(user);

    expect(res.cookie).toHaveBeenCalledWith(
      'access_token',
      'token123',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }),
    );
  });

  it('should return null when validateUser returns null', async () => {
    const dto: LoginDto = { email: 'invalid@test.com', password: 'wrong' };
    const res = mockResponse();

    authService.validateUser.mockResolvedValue(null);

    const result = await controller.login(dto, res);

    expect(result).toBeNull();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('should clear cookie on logout', () => {
    const res = mockResponse();

    const result = controller.logout(res);

    expect(result).toBeUndefined();
    expect(res.clearCookie).toHaveBeenCalledWith('access_token');
  });

  it('should register a new user', async () => {
    const dto: CreateUserDto = {
      email: 'new@test.com',
      password: '123456',
      name: 'New User',
    };

    usersService.createUser.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.register(dto);

    expect(result).toEqual({ id: 1, ...dto });
    expect(usersService.createUser).toHaveBeenCalledWith(dto);
  });
});
