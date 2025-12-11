import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Delete,
  Param,
  BadRequestException,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Cursos')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor.' })
  async createCourse(
    @CurrentUser() user: { userId: number },
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Atualizar um curso existente' })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido.' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor.' })
  async updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('ID do curso inválido');
    }
    console.log(dto);
    return this.coursesService.updateCourse(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar todos os cursos' })
  @ApiResponse({ status: 200, description: 'Cursos encontrados.' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('/published')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar todos os cursos publicados' })
  @ApiResponse({ status: 200, description: 'Cursos publicados encontrados.' })
  async getPublishedCourses() {
    return this.coursesService.getPublishedCourses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Listar cursos do usuário logado' })
  @ApiResponse({ status: 200, description: 'Cursos do usuário encontrados.' })
  async getMyCourses(@CurrentUser() user: { userId: number }) {
    return this.coursesService.getCoursesByUserId(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir um curso' })
  @ApiResponse({ status: 204, description: 'Curso excluído com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID do curso inválido.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async deleteCourse(@Param('id') id: string) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('ID do curso inválido');
    }
    await this.coursesService.deleteCourse(Number(id));
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Atualizar status do curso' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('ID do curso inválido');
    }
    return this.coursesService.updateStatus(Number(id), dto);
  }
}
