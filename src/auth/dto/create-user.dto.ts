import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678900' })
  @MinLength(6)
  @IsString()
  password: string;

  @ApiProperty({ example: 'João Silva' })
  @MinLength(5)
  @IsString()
  name: string;
}
