import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { OrderItemService } from './order-item.service';
import { SharedModule } from "../shared/shared.module";
import { LinkModule } from '../link/link.module';
import { ProductModule } from '../product/product.module';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule,
    LinkModule,
    ProductModule,
    StripeModule.forRoot({
      apiKey: 'sk_test_51PhZZpBpe2hxNkfKnenS9Woh10KkYowSHVHww7UN05Y0oNJWVMdLIwn2YtGq8D2q2TCToIYmRCnp5Ol3E5nqFs5700buCxftXS',
      apiVersion: '2020-08-27',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService]
})
export class OrderModule {}
