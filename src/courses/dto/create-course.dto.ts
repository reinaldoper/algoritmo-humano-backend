import { IsBoolean, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Introdução ao NestJs',
    description: 'Titulo do Curso.',
  })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    example: 'Curso completo de NestJs',
    description: 'Descrição detalhada do curso',
  })
  @IsString()
  @Length(10, 500)
  description: string;

  @ApiProperty({
    example: '3 hours',
    description: 'Horas total do curso',
  })
  @IsString()
  duration: string;

  @ApiProperty({
    example: 'https://mysite.com/images/nestjs.png',
    description: 'Salvar em formato base64',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o curso esta ativo ou não',
    default: true,
  })
  @IsBoolean()
  status: boolean;
}
