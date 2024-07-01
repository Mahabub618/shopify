import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { DeleteResult, Repository } from "typeorm";
import { ProductCreateDto } from "./dtos/productCreate.dto";

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
  }
  async getProduct(): Promise<Product[]> {
    return this.productRepository.find({});
  }
  async createProduct(productCreateDto: ProductCreateDto): Promise<Product> {
    const { title, description, price, image } = productCreateDto;
    const product: Product = new Product();
    product.title = title;
    product.description = description;
    product.price = price;
    product.image = image;

    try {
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getProductById(id: number): Promise<Product> {
    const found: Product = await this.productRepository.findOne({where: {id}});
    if (!found) {
      throw new NotFoundException(`Product with ID "${id}" have not found`);
    }
    return found;
  }
  async updateProduct(id, productUpdateDto: ProductCreateDto): Promise<Product> {
    const product: Product = await this.getProductById(id);
    product.title = productUpdateDto.title;
    product.description = productUpdateDto.description;
    product.price = productUpdateDto.price;
    product.image = productUpdateDto.image;
    await product.save();
    return product;
  }
  async deleteProductById(id: number): Promise<DeleteResult> {
    const result: DeleteResult = await this.productRepository.delete({id});
    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
    return result;
  }
}