import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LinkService } from "./link.service";
import { AuthGuard } from "../auth/auth.guard";
import { Request } from 'express';
import { Link } from './link.entity';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
  constructor(private linkService: LinkService) {
  }

  @UseGuards(AuthGuard)
  @Get('admin/users/:id/links')
  async all(@Param('id') id: number) {
    return this.linkService.getAllLink(id);
  }

  @UseGuards(AuthGuard)
  @Post('ambassador/links')
  async createLink(
    @Body('products') products: number[],
    @Req() request: Request
  ): Promise<Link> {
    return this.linkService.createLink(request, products);
  }

  @UseGuards(AuthGuard)
  @Get('ambassador/stats')
  async getStats(@Req() request: Request) {
    return this.linkService.getStats(request);
  }

  @UseGuards(AuthGuard)
  @Get('checkout/links/:code')
  async getLink(@Param('code') code: string): Promise<Link> {
    return this.linkService.getLink(code);
  }
}
