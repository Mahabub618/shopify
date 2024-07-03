import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {
  }
  @UseGuards(AuthGuard)
  @Get('admin/ambassadors')
  ambassadors() {
    return this.userService.ambassadors();
  }
}
