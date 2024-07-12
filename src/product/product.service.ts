import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { DeleteResult, Repository } from "typeorm";
import { ProductCreateDto } from "./dtos/productCreate.dto";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from "cache-manager";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from "express";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2
  ) {
  }
  async save(options) {
    return this.productRepository.save(options);
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
      await product.save();
      this.eventEmitter.emit('productDB');
      return product;
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
    this.eventEmitter.emit('productDB');
    return product;
  }
  async deleteProductById(id: number): Promise<DeleteResult> {
    const result: DeleteResult = await this.productRepository.delete({id});
    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
    this.eventEmitter.emit('productDB');
    return result;
  }
  async getProductFromBackend(request: Request): Promise<Product[]> {
    let products = await this.cacheManager.get<Product[]>('productsBackend');

    if (!products) {
      products = await this.getProduct();
      await this.cacheManager.set('productsBackend', products, {ttl: 1800})
    }

    if (request.query.search) {
      const search = request.query.search.toString().toLowerCase();
      products = products.filter(product => product.title.toLowerCase().indexOf(search) >= 0
        || product.description.toLowerCase().indexOf(search) >= 0);
    }

    return products;
  }
}
