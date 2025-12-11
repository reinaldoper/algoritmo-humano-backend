import { Body, Controller, Post, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import express from 'express';
import { UsersService } from '../users/users.service';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = await this.authService.validateUser(loginDto);

    if (user) {
      const token = this.authService.generateToken(user);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return {
        message: 'Login realizado com sucesso',
        access_token: token,
      };
    }
    return null;
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 204, description: 'Usuário desconectado' })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token');
    return;
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
