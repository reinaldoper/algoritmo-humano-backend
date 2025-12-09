import { IsBoolean, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Introduction to NestJS',
    description: 'Course title',
  })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    example:
      'Complete NestJS course covering fundamentals and advanced practices.',
    description: 'Detailed course description',
  })
  @IsString()
  @Length(10, 500)
  description: string;

  @ApiProperty({
    example: '3 hours',
    description: 'Total course duration (format is flexible)',
  })
  @IsString()
  duration: string;

  @ApiProperty({
    example: 'https://mysite.com/images/nestjs.png',
    description: 'URL for the course image',
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the course is active or not',
    default: true,
  })
  @IsBoolean()
  status: boolean;
}
