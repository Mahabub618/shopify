import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dtos/authCredential.dto";

@Controller()
export class AuthController {

  constructor(private authService: AuthService) {

  }
  @Post('admin/register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('admin/login')
  async login(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto) {
    return this.authService.login(authCredentialDto);
  }
}
