import { Injectable } from '@nestjs/common';
import { Order } from '../order.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisService } from '../../shared/redis.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class OrderListener {
  constructor(private redisService: RedisService,
              private mailerService: MailerService) {}

  @OnEvent('order.completed')
  async handleOrderCompletedEvent(order: Order) {
    const client = this.redisService.getClient();
    await client.zincrby('rankings', order.ambassadorRevenue, order.user.name);

    await this.mailerService.sendMail({
      to: 'admin@shopify.com',
      subject: 'An order has been completed',
      html: `Order #${order.id} with a total of $${order.total} has been completed!`
    });

    await this.mailerService.sendMail({
      to: order.ambassadorEmail,
      subject: 'An order has been completed',
      html: `You earned $${order.ambassadorRevenue} from the link #${order.code}`
    });
  }
}
