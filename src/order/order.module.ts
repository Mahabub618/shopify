import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { OrderItemService } from './order-item.service';
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService]
})
export class OrderModule {}
