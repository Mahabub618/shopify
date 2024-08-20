import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from "./dtos/register.dto";
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dtos/authCredential.dto";
import { Request, Response } from "express";
import { User } from "./user.entity";
import { AuthGuard } from './auth.guard';
import { UpdateUserInfoDto } from "./dtos/updateUserInfo.dto";
import { UpdatePasswordDto } from "./dtos/updatePassword.dto";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(private authService: AuthService) {

  }
  @Post(['admin/register', 'ambassador/register'])
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Req() request: Request
  ) {
    return this.authService.register(registerDto, request);
  }
  @Post(['admin/login', 'ambassador/login'])
  async login(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
    @Res({passthrough: true}) response: Response,
    @Req() request: Request
  ):Promise<User> {
    return this.authService.login(authCredentialDto, response, request);
  }
  @UseGuards(AuthGuard)
  @Get(['admin/user', 'ambassador/user'])
  async user(@Req() request: Request): Promise<User | {revenue: number}> {
    return this.authService.verifyUser(request);
  }
  @UseGuards(AuthGuard)
  @Post(['admin/logout', 'ambassador/logout'])
  async logout(@Res({passthrough: true}) response: Response): Promise<{message: string}> {
    return this.authService.logout(response);
  }
  @UseGuards(AuthGuard)
  @Put(['admin/users/info', 'ambassador/users/info'])
  async updateInfo(@Body(ValidationPipe) updateDto: UpdateUserInfoDto, @Req() request: Request) {
    return this.authService.updateInfo(request, updateDto);
  }
  @UseGuards(AuthGuard)
  @Put(['admin/users/password', 'ambassador/users/password'])
  async updatePassword(@Body(ValidationPipe) updatePassword: UpdatePasswordDto, @Req() request: Request) {
    return this.authService.updatePassword(request, updatePassword);
  }
}
