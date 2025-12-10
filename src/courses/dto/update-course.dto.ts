import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    example: 'Introduction to NestJS',
    description: 'Course title',
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @ApiProperty({
    example:
      'Complete NestJS course covering fundamentals and advanced practices.',
    description: 'Detailed course description',
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @ApiProperty({
    example: '3 hours',
    description: 'Total course duration (format is flexible)',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: 'https://mysite.com/images/nestjs.png',
    description: 'URL for the course image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the course is active or not',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
