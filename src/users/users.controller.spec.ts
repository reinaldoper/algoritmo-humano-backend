import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

type MockedUsersService = {
  findUserById: jest.Mock;
  updateUser: jest.Mock;
  deleteUser: jest.Mock;
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: MockedUsersService;

  const usersServiceMock: MockedUsersService = {
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user profile', async () => {
    usersService.findUserById.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
    });

    const result = await controller.getProfile({ userId: 1 });

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
    });

    expect(usersService.findUserById).toHaveBeenCalledWith(1);
  });

  it('should update user profile', async () => {
    const dto: UpdateUserDto = { name: 'Updated' };

    usersService.updateUser.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Updated',
    });

    const result = await controller.updateProfile(dto, { userId: 1 });

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Updated',
    });

    expect(usersService.updateUser).toHaveBeenCalledWith(1, dto);
  });
  it('should delete user profile', async () => {
    usersService.deleteUser.mockResolvedValue(undefined);

    const result = await controller.deleteProfile({ userId: 1 });

    expect(result).toBeUndefined();
    expect(usersService.deleteUser).toHaveBeenCalledWith(1);
  });
});
