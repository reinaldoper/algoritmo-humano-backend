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

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Server error.' })
  async createCourse(
    @CurrentUser() user: { userId: number },
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Server error.' })
  async updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid course ID');
    }
    console.log(dto);
    return this.coursesService.updateCourse(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List all courses' })
  @ApiResponse({ status: 200, description: 'Courses found.' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('/published')
  @HttpCode(200)
  @ApiOperation({ summary: 'List all published courses' })
  @ApiResponse({ status: 200, description: 'Published courses found.' })
  async getPublishedCourses() {
    return this.coursesService.getPublishedCourses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get logged user courses' })
  @ApiResponse({ status: 200, description: 'User courses found.' })
  async getMyCourses(@CurrentUser() user: { userId: number }) {
    return this.coursesService.getCoursesByUserId(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 204, description: 'Course deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid course ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async deleteCourse(@Param('id') id: string) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid course ID');
    }
    await this.coursesService.deleteCourse(Number(id));
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update course status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid course ID');
    }
    return this.coursesService.updateStatus(Number(id), dto);
  }
}
