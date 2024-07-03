import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductCreateDto } from "./dtos/productCreate.dto";
import { DeleteResult } from "typeorm";
import { Product } from "./product.entity";
import { AuthGuard } from "../auth/auth.guard";

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  @UseGuards(AuthGuard)
  @Get('admin/products')
  async getProducts(): Promise<Product[]> {
    return this.productService.getProduct();
  }

  @UseGuards(AuthGuard)
  @Post('admin/products')
  async createProducts(@Body(ValidationPipe) productCreateDto: ProductCreateDto): Promise<Product> {
    return this.productService.createProduct(productCreateDto);
  }

  @UseGuards(AuthGuard)
  @Get('admin/products/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @UseGuards(AuthGuard)
  @Put('admin/products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) productDto: ProductCreateDto): Promise<Product> {
    return this.productService.updateProduct(id, productDto);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/products/:id')
  async deleteProductById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteResult> {
    return this.productService.deleteProductById(id);
  }
}
