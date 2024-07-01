import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(@InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>) {
  }
  async save(options) {
    return this.orderItemRepository.save(options);
  }
}
