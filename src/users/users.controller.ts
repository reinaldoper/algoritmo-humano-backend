import {
  Controller,
  UseGuards,
  Get,
  Put,
  Body,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get logged user information' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(@CurrentUser() user: { userId: number }) {
    return this.usersService.findUserById(user.userId);
  }

  @Put('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update logged user information' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateProfile(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { userId: number },
  ) {
    return await this.usersService.updateUser(user.userId, dto);
  }

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete logged user profile' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully — no content returned',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteProfile(@CurrentUser() user: { userId: number }) {
    await this.usersService.deleteUser(user.userId);
    return;
  }
}
