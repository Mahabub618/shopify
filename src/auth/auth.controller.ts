import { Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dtos/authCredential.dto";
import { Request, Response } from "express";
import { User } from "./user.entity";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(private authService: AuthService) {

  }
  @Post('admin/register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('admin/login')
  async login(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto, @Res({passthrough: true}) response: Response):Promise<{message: string}> {
    return this.authService.login(authCredentialDto, response);
  }
  @Get('admin/user')
  async user(@Req() request: Request): Promise<User> {
    return this.authService.verifyUser(request);
  }
  @Post('admin/logout')
  async logout(@Res({passthrough: true}) response: Response): Promise<{message: string}> {
    return this.authService.logout(response);
  }
}
