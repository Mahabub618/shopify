import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { SharedModule } from "../shared/shared.module";
import { ProductListener } from './listener/product.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SharedModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductListener]
})
export class ProductModule {}
