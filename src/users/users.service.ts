import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.findUser(dto.email);
    if (user) {
      throw new ConflictException('E-mail já registrado');
    }
    try {
      dto.password = await bcrypt.hash(dto.password, 10);
      return this.prisma.user.create({
        data: {
          email: dto.email,
          password: dto.password,
          name: dto.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Erro interno no servidor');
      }
    }
  }

  async findUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  async findUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro interno no servidor');
    }
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.findUserById(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async deleteUser(id: number) {
    await this.findUserById(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
