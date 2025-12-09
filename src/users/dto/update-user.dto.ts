import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  password?: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name?: string;
}
