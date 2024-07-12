import {
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  ParseIntPipe,
  Post,
  Put, Req,
  UseGuards, UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { ProductCreateDto } from "./dtos/productCreate.dto";
import { DeleteResult } from "typeorm";
import { Product } from "./product.entity";
import { AuthGuard } from "../auth/auth.guard";
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductUpdateDto } from './dtos/productUpdate.dto';
import { Request } from "express";

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
    @Body(ValidationPipe) productDto: ProductUpdateDto): Promise<Product> {
    return this.productService.updateProduct(id, productDto);
  }

  @UseGuards(AuthGuard)
  @Delete('admin/products/:id')
  async deleteProductById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteResult> {
    return this.productService.deleteProductById(id);
  }

  @CacheKey('productsFrontend')
  @CacheTTL(1800)
  @UseInterceptors(CacheInterceptor)
  @Get('ambassador/products/frontend')
  async frontend(){
    return this.productService.getProduct();
  }

  @Get('ambassador/products/backend')
  async backend(
    @Req() request: Request
  ): Promise<{ products: Product[], nextPageToken?: string }> {
    return this.productService.getProductFromBackend(request);
  }
}
