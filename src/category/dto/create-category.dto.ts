import { IsNotEmpty, IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'name of category', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'description of category', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'image of category', required: false })
  @IsOptional()
  @IsString()
  images?: string;

}