import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const cookie = request.cookies['jwt'];
      if (!cookie) {
        // console.log('No JWT cookie found');
        return false;
      }
      const token = cookie.includes('=') ? cookie.split('=')[1] : cookie;
      return this.jwtService.verify(token);
    } catch (error) {
      // console.log('JWT verification failed:', error.message);
      return false;
    }
  }
}
