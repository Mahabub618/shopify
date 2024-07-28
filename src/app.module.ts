import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { LinkModule } from './link/link.module';
import { SharedModule } from './shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql', // For mySQL 'mysql'
      host: 'localhost',
      port: 3306,
      username: 'sa', // For mySQL 'root'
      password: 'root',
      database: 'ambassador',
      autoLoadEntities: true,
      synchronize: true,
      extra: { // Need only for msSQL
        trustServerCertificate: true,
      }
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    LinkModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
