import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
