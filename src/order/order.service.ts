import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {
  }
  async save(options) {
    return this.orderRepository.save(options);
  }
  async getAllOrder(){
    return this.orderRepository.find({});
  }
}
