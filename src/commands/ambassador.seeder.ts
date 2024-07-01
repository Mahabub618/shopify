import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserService } from "../user/user.service";
import { faker } from '@faker-js/faker';
import * as bcrypt from "bcrypt";
import * as process from "node:process";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const slt = await bcrypt.genSalt();
  const psd = await bcrypt.hash("A@b123", slt);
  for(let i = 0; i < 30; i++) {
    await userService.save({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      salt: slt,
      password: psd,
      isAmbassador: true,
    })
  }
  process.exit();
})();
