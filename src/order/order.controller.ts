import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from "../auth/auth.guard";
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './order.entity';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {

  }
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  getAllOrders() {
    return this.orderService.getAllOrder();
  }

  @Post('checkout/orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
