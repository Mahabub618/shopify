import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { OrderService } from './order.service';
import { AuthGuard } from "../auth/auth.guard";

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
}
