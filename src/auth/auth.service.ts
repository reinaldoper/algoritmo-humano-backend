import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto) {
    const { email, password } = dto;
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const passwordMatches =
        user && (await bcrypt.compare(password, user.password));
      if (!passwordMatches) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      if (user && passwordMatches) {
        return user;
      }
      return null;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro interno do servidor');
    }
  }

  generateToken(user: User) {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
