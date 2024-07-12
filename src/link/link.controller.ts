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
  ) {
    return this.linkService.createLink(request, products);
  }
}
