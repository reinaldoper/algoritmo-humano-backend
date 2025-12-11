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
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuários')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obter informações do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getProfile(@CurrentUser() user: { userId: number }) {
    return this.usersService.findUserById(user.userId);
  }

  @Put('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Atualizar informações do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async updateProfile(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { userId: number },
  ) {
    return await this.usersService.updateUser(user.userId, dto);
  }

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir perfil do usuário logado' })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso — nenhum conteúdo retornado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async deleteProfile(@CurrentUser() user: { userId: number }) {
    await this.usersService.deleteUser(user.userId);
    return;
  }
}
