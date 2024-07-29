import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import { LinkService } from '../link/link.service';
import { Link } from '../link/link.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity';
import { OrderItem } from './order-item.entity';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  paymentAPI = this.configService.get('CHECKOUT_URL');

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private linkService: LinkService,
    private productService: ProductService,
    private dataSource: DataSource,
    @InjectStripe() private readonly stripeClient: Stripe,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
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
  async createOrder(createOrderDto: CreateOrderDto) {
    const link: Link = await this.linkService.getLink(createOrderDto.code);

    const extractProductIdFromLink: number[] = link.products.map(product => product.id);
    const invalidAnyProductId: boolean = createOrderDto.products.some(
      product => !extractProductIdFromLink.includes(product.productId)
    )

    if (invalidAnyProductId) {
      throw new BadRequestException('One or more products are not associated with the provided link.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const o: Order = new Order();
      o.userId = link.user.id;
      o.transactionId = "a6iU4dflkd6";
      o.ambassadorEmail = link.user.email;
      o.firstName = createOrderDto.firstName;
      o.lastName = createOrderDto.lastName;
      o.email = createOrderDto.email;
      o.address = createOrderDto.address;
      o.country = createOrderDto.country;
      o.city = createOrderDto.city;
      o.zip = createOrderDto.zip;
      o.code = createOrderDto.code;

      const order: Order = await queryRunner.manager.save(o);

      const line_items: any[] = [];

      for (let p of createOrderDto.products) {
        const product: Product = await this.productService.getProductById(p.productId);

        const orderItem: OrderItem = new OrderItem();
        orderItem.order = order;
        orderItem.productTitle = product.title;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.ambassadorRevenue = 0.1 * product.price * p.quantity; // 10% ambassador revenue of product
        orderItem.adminRevenue = 0.9 * product.price * p.quantity; // 90% admin revenue of product

        await queryRunner.manager.save(orderItem);

        line_items.push({
          name: product.title,
          description: product.description,
          images: [
            product.image
          ],
          amount: 100 * product.price,
          currency: 'usd',
          quantity: p.quantity
        })
      }

      const source = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${this.paymentAPI}/success?source={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.paymentAPI}/error`
      });

      order.transactionId = source['id'];
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return source;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async confirmOrder(source: string): Promise<{message: string}> {
    const order = await this.orderRepository.findOne({
      where: { transactionId: source },
      relations: ['user', 'orderItems']
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    await this.orderRepository.update(order.id, { complete: true });

    this.eventEmitter.emit('order.completed', order);

    return {
      message: 'success'
    }
  }
}
