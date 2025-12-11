import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({
    example: 'Introdução ao NestJS',
    description: 'Título do curso',
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @ApiProperty({
    example:
      'Curso completo de NestJS cobrindo fundamentos e práticas avançadas.',
    description: 'Descrição detalhada do curso',
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @ApiProperty({
    example: '3 horas',
    description: 'Duração total do curso (formato flexível)',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: 'https://meusite.com/imagens/nestjs.png',
    description: 'Salvar imagem na base64',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o curso está ativo ou não',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
