import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from "cache-manager";

@Injectable()
export class ProductListener {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }
  @OnEvent('productDB')
  async handleProductDbEvent() {
    await this.cacheManager.del('productsBackend')
    await this.cacheManager.del('productsFrontend')
  }
}
