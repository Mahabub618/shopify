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
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule,
    LinkModule,
    ProductModule,
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_KEY'),
        apiVersion: '2020-08-27'
      })
    })
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService]
})
export class OrderModule {}
