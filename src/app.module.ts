import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

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
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
