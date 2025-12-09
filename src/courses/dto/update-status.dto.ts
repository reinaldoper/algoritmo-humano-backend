import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the course is active or not',
    default: true,
  })
  @IsBoolean()
  status: boolean;
}
