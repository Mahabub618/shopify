import { Injectable } from '@nestjs/common';
import { Order } from '../order.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisService } from '../../shared/redis.service';

@Injectable()
export class OrderListener {
  constructor(private redisService: RedisService) {}

  @OnEvent('order.completed')
  async handleOrderCompletedEvent(order: Order) {
    const client = this.redisService.getClient();
    await client.zincrby('rankings', order.ambassadorRevenue, order.user.name);
  }
}
