import { ClassSerializerInterceptor, Controller, Get, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { Response } from "express";

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

  @UseGuards(AuthGuard)
  @Get('ambassador/rankings')
  async ranking(@Res() response: Response) {
    return this.userService.getRankings(response);
  }
}
