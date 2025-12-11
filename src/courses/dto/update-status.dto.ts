import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    example: true,
    description: 'Indica se o curso está ativo ou não',
    default: true,
  })
  @IsBoolean()
  status: boolean;
}
