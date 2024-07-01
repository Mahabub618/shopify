import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import * as process from "node:process";
import { faker } from '@faker-js/faker';
import { OrderService } from '../order/order.service';
import { OrderItemService } from '../order/order-item.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const orderService: OrderService = app.get(OrderService);
  const orderItemService: OrderItemService = app.get(OrderItemService);
  for(let i = 0; i < 30; i++) {
    const order = await orderService.save({
      transactionId: faker.finance.bitcoinAddress(),
      userId: faker.string.uuid(),
      code: faker.lorem.slug(4),
      ambassadorEmail: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      complete: true
    });

    for(let j = 0; j < 2; j++) {
      await orderItemService.save({
        order,
        productTitle: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.lorem.words(2),
        adminRevenue: faker.finance.amount(),
        ambassadorRevenue: faker.finance.amount()
      });
    }
  }
  process.exit();
})();
