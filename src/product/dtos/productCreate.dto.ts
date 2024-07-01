import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductCreateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
