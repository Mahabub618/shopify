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
      const { scope } = this.jwtService.verify(token);

      const isAdmin = request.path.toString().indexOf('api/admin') >= 0;
      return (isAdmin && scope === 'admin') || (!isAdmin && scope === 'ambassador');
    } catch (error) {
      // console.log('JWT verification failed:', error.message);
      return false;
    }
  }
}
