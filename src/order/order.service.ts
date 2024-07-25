import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { LinkService } from '../link/link.service';
import { Link } from '../link/link.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity';
import { OrderItem } from './order-item.entity';
import { OrderItemService } from './order-item.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private linkService: LinkService,
    private productService: ProductService,
    private orderItemService: OrderItemService
    ) {
  }
  async save(options) {
    return this.orderRepository.save(options);
  }
  async getAllOrder(){
    return this.orderRepository.find({
      relations: ['orderItems']
    });
  }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const link: Link = await this.linkService.getLinkForOrder(createOrderDto);

    const order: Order = new Order();
    order.userId = link.user.id;
    order.transactionId = "a6iU4dflkd6";
    order.ambassadorEmail = link.user.email;
    order.firstName = createOrderDto.firstName;
    order.lastName = createOrderDto.lastName;
    order.email = createOrderDto.email;
    order.address = createOrderDto.address;
    order.country = createOrderDto.country;
    order.city = createOrderDto.city;
    order.zip = createOrderDto.zip;
    order.code = createOrderDto.code;

    await this.orderRepository.save(order);

    for (let p of createOrderDto.products) {
      const product: Product = await this.productService.getProductById(p.productId);

      const orderItem: OrderItem = new OrderItem();
      orderItem.order = order;
      orderItem.productTitle = product.title;
      orderItem.price = product.price;
      orderItem.quantity = p.quantity;
      orderItem.ambassadorRevenue = 0.1 * product.price * p.quantity; // 10% ambassador revenue of product
      orderItem.adminRevenue = 0.9 * product.price * p.quantity; // 90% admin revenue of product

      await this.orderItemService.save(orderItem);
    }

    return order;
  }
}
