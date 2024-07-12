import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductPaginationDTO {
  @IsOptional()
  @IsString()
  nextPageToken?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;
}
