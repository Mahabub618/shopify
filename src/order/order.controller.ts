import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from "@nestjs/common";
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {

  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  getAllOrders() {
    return this.orderService.getAllOrder();
  }
}
