import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
