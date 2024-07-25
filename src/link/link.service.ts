import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./link.entity";
import { Repository } from "typeorm";
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { Order } from '../order/order.entity';
import { CreateOrderDto } from '../order/dtos/create-order.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    private authService: AuthService
  ) {
  }

  async save(options) {
    return this.linkRepository.save(options);
  }

  async getAllLink(id: number) {
    return this.linkRepository.find({
      where: { user: { id: id } },
      relations: ['orders']
    });
  }

  async createLink(request: Request, products: number[]): Promise<Link> {
    const user = await this.authService.verifyUserForLink(request);

    // return this.linkRepository.save({
    //   code: Math.random().toString(36).substring(6),
    //   user,
    //   products: products.map(id => ({id}))
    // });
    const link: Link = new Link();
    link.user = user;
    link.code = Math.random().toString(36).substring(6);
    link.products = products.map(id => ({ id }) as any);

    try {
      await link.save();
      return link;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getStats(request: Request) {
    const user = await this.authService.verifyUserForLink(request);

    const links: Link[] = await this.linkRepository.find({
      where: { user },
      relations: ['orders']
    });

    return links.map(link => {
      const completeOrders: Order[] = link.orders.filter(order => order.complete);

      return {
        code: link.code,
        count: completeOrders.length,
        revenue: completeOrders.reduce((sum, order) => sum + order.ambassadorRevenue, 0)
      }
    });
  }

  async getLink(code: string): Promise<Link> {
    const link: Link = await this.linkRepository.findOne({
      where: { code },
      relations: ['user', 'products']
    })

    if (link) {
      return link;
    }
    else {
      throw new BadRequestException('Invalid link!');
    }
  }
}
