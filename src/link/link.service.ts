import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./link.entity";
import { Repository } from "typeorm";
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

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
  async createLink(request: Request, products: number[]) {
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
}
