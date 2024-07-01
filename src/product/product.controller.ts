import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductCreateDto } from "./dtos/productCreate.dto";
import { DeleteResult } from "typeorm";
import { Product } from "./product.entity";

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  @Get('admin/products')
  async getProducts(): Promise<Product[]> {
    return this.productService.getProduct();
  }
  @Post('admin/products')
  async createProducts(@Body(ValidationPipe) productCreateDto: ProductCreateDto): Promise<Product> {
    return this.productService.createProduct(productCreateDto);
  }
  @Get('admin/products/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }
  @Put('admin/products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) productDto: ProductCreateDto): Promise<Product> {
    return this.productService.updateProduct(id, productDto);
  }
  @Delete('admin/products/:id')
  async deleteProductById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteResult> {
    return this.productService.deleteProductById(id);
  }
}
