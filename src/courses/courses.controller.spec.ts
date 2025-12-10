import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { BadRequestException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

type MockedCoursesService = {
  createCourse: jest.Mock;
  updateCourse: jest.Mock;
  getAllCourses: jest.Mock;
  getPublishedCourses: jest.Mock;
  getCoursesByUserId: jest.Mock;
  deleteCourse: jest.Mock;
  updateStatus: jest.Mock;
};

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: MockedCoursesService;

  const coursesServiceMock: MockedCoursesService = {
    createCourse: jest.fn(),
    updateCourse: jest.fn(),
    getAllCourses: jest.fn(),
    getPublishedCourses: jest.fn(),
    getCoursesByUserId: jest.fn(),
    deleteCourse: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: coursesServiceMock }],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a course', async () => {
    const dto: CreateCourseDto = {
      title: 'Test',
      description: 'Desc',
      imageUrl: 'img.png',
      status: true,
      duration: '10',
    };

    service.createCourse.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.createCourse({ userId: 1 }, dto);

    expect(result).toEqual({ id: 1, ...dto });
    expect(service.createCourse).toHaveBeenCalledWith(dto, 1);
  });

  it('should update a course', async () => {
    const dto: UpdateCourseDto = {
      title: 'Updated',
      description: 'New desc',
      imageUrl: 'new.png',
      status: false,
      duration: '20',
    };

    service.updateCourse.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.updateCourse({ userId: 1 }, dto);

    expect(result).toEqual({ id: 1, ...dto });
    expect(service.updateCourse).toHaveBeenCalledWith(1, dto);
  });

  it('should return all courses', async () => {
    service.getAllCourses.mockResolvedValue([{ id: 1 }]);

    const result = await controller.getAllCourses();

    expect(result).toEqual([{ id: 1 }]);
    expect(service.getAllCourses).toHaveBeenCalled();
  });

  it('should return published courses', async () => {
    service.getPublishedCourses.mockResolvedValue([{ id: 1, status: true }]);

    const result = await controller.getPublishedCourses();

    expect(result).toEqual([{ id: 1, status: true }]);
    expect(service.getPublishedCourses).toHaveBeenCalled();
  });

  it('should return courses of logged user', async () => {
    service.getCoursesByUserId.mockResolvedValue([{ id: 1 }]);

    const result = await controller.getMyCourses({ userId: 1 });

    expect(result).toEqual([{ id: 1 }]);
    expect(service.getCoursesByUserId).toHaveBeenCalledWith(1);
  });
  it('should delete a course', async () => {
    service.deleteCourse.mockResolvedValue(undefined);

    const result = await controller.deleteCourse('1');

    expect(result).toBeUndefined();
    expect(service.deleteCourse).toHaveBeenCalledWith(1);
  });

  // ✅ deleteCourse (invalid id)
  it('should throw BadRequestException for invalid delete id', async () => {
    await expect(controller.deleteCourse('abc')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update course status', async () => {
    const dto: UpdateStatusDto = { status: true };

    service.updateStatus.mockResolvedValue({ id: 1, status: true });

    const result = await controller.updateStatus('1', dto);

    expect(result).toEqual({ id: 1, status: true });
    expect(service.updateStatus).toHaveBeenCalledWith(1, dto);
  });

  it('should throw BadRequestException for invalid status id', async () => {
    await expect(
      controller.updateStatus('abc', { status: true }),
    ).rejects.toThrow(BadRequestException);
  });
});
