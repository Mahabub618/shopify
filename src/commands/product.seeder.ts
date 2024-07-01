import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { faker } from '@faker-js/faker';
import * as process from "node:process";
import { ProductService } from "../product/product.service";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);
  for(let i = 0; i < 30; i++) {
    await productService.save({
      title: faker.lorem.words(5),
      description: faker.lorem.words(15),
      image: faker.image.imageUrl(200, 200, '', true),
      price: faker.commerce.price(0),
    });
  }
  process.exit();
})();
