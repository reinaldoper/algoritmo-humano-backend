import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

type MockedPrisma = {
  course: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    delete: jest.Mock;
    update: jest.Mock;
  };
};

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: MockedPrisma;

  const prismaMock: MockedPrisma = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    const dto: CreateCourseDto = {
      title: 'Course',
      description: 'Desc',
      imageUrl: 'img.png',
      status: true,
      duration: '10',
    };

    prisma.course.create.mockResolvedValue({ id: 1, ...dto });

    const result = await service.createCourse(dto, 1);

    expect(result).toEqual({ id: 1, ...dto });
    expect(prisma.course.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        userId: 1,
      },
    });
  });

  it('should return all courses', async () => {
    prisma.course.findMany.mockResolvedValue([]);

    const result = await service.getAllCourses();

    expect(result).toEqual([]);
    expect(prisma.course.findMany).toHaveBeenCalled();
  });

  it('should return a course by id', async () => {
    prisma.course.findUnique.mockResolvedValue({
      id: 1,
      title: 'Test',
      user: {},
    });

    const result = await service.getCourseById(1);

    expect(result).toEqual({
      id: 1,
      title: 'Test',
      user: {},
    });
  });

  it('should throw NotFoundException if course not found', async () => {
    prisma.course.findUnique.mockResolvedValue(null);

    await expect(service.getCourseById(1)).rejects.toThrow(NotFoundException);
  });

  it('should return courses by user id', async () => {
    prisma.course.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.getCoursesByUserId(1);

    expect(result).toEqual([{ id: 1 }]);
    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  });

  it('should delete a course', async () => {
    prisma.course.findUnique.mockResolvedValue({ id: 1 });
    prisma.course.delete.mockResolvedValue({ id: 1 });

    const result = await service.deleteCourse(1);

    expect(result).toEqual({ id: 1 });
    expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a course', async () => {
    const dto: UpdateCourseDto = {
      title: 'Updated',
      description: 'New desc',
      imageUrl: 'new.png',
      status: false,
      duration: '20',
    };

    prisma.course.findUnique.mockResolvedValue({ id: 1 });
    prisma.course.update.mockResolvedValue({ id: 1, ...dto });

    const result = await service.updateCourse(1, dto);

    expect(result).toEqual({ id: 1, ...dto });
    expect(prisma.course.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('should update course status', async () => {
    const dto: UpdateStatusDto = { status: true };

    prisma.course.findUnique.mockResolvedValue({ id: 1 });
    prisma.course.update.mockResolvedValue({ id: 1, status: true });

    const result = await service.updateStatus(1, dto);

    expect(result).toEqual({ id: 1, status: true });
    expect(prisma.course.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: true },
    });
  });

  it('should return published courses', async () => {
    prisma.course.findMany.mockResolvedValue([{ id: 1, status: true }]);

    const result = await service.getPublishedCourses();

    expect(result).toEqual([{ id: 1, status: true }]);
    expect(prisma.course.findMany).toHaveBeenCalledWith({
      where: { status: true },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  });
});
