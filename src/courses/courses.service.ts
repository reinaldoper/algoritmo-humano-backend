import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto, userId: number) {
    try {
      return this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description,
          imageUrl: dto.imageUrl,
          status: dto.status,
          userId: userId,
          duration: dto.duration,
        },
      });
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getCourseById(id: number) {
    const existCourse = await this.prisma.course.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    if (!existCourse) {
      throw new NotFoundException('Course not found');
    }
    return existCourse;
  }

  async getCoursesByUserId(userId: number) {
    return this.prisma.course.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async deleteCourse(id: number) {
    await this.getCourseById(id);
    return this.prisma.course.delete({
      where: { id },
    });
  }

  async updateCourse(id: number, dto: UpdateCourseDto) {
    await this.getCourseById(id);
    return this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        status: dto.status,
        duration: dto.duration,
      },
    });
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    await this.getCourseById(id);
    return this.prisma.course.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }

  async getPublishedCourses() {
    return this.prisma.course.findMany({
      where: { status: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
