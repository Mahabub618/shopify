import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcrypt";
import { AuthCredentialDto } from "./dtos/authCredential.dto";
import { User } from "./user.entity";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { UpdateUserInfoDto } from "./dtos/updateUserInfo.dto";
import { UpdatePasswordDto } from "./dtos/updatePassword.dto";
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              private jwtService: JwtService) {
  }
  async register(registerDto: RegisterDto, request: Request){
    const { firstName, lastName, email, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    else {
      const user: User = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.salt = await bcrypt.genSalt();
      user.isAmbassador = (request.path === '/api/ambassador/register');
      user.password = await this.hashPassword(registerDto.password, user.salt);
      try {
        return await user.save();
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.code === 'EREQUEST') {
          throw new ConflictException('Email is already exist');
        }
        else {
          throw new InternalServerErrorException();
        }
      }
    }
  }
  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async login(authCredentialDto: AuthCredentialDto, response: Response):Promise<{message: string}>{
    const { email, password } = authCredentialDto;
    const user: User = await this.userRepository.findOne({where: { email }});

    if (user && await user.validatePassword(password)) {
      const payload: JwtPayload = { email };
      const accessToken = this.jwtService.sign(payload);
      response.cookie('jwt', accessToken, {httpOnly: true});
      return { message: 'success' };
    }
    else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async verifyUser(request: Request) {
    const cookie = request.cookies['jwt'];
    const { email } = await this.jwtService.verifyAsync(cookie);
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      return user;
    }
    else {
      throw new NotFoundException('User not found!');
    }
  }
  async logout(response: Response): Promise<{message: string}> {
    response.clearCookie('jwt');
    return { message: 'success'};
  }
  async updateInfo(request: Request, updateInfo: UpdateUserInfoDto) {
    const cookie = request.cookies['jwt'];
    const { email } = await this.jwtService.verifyAsync(cookie);
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      user.firstName = updateInfo.firstName;
      user.lastName = updateInfo.lastName;
      user.email = updateInfo.email;

      try {
        await user.save();
        return user;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Email is already exist');
        }
        else {
          throw new InternalServerErrorException();
        }
      }
    }
    else {
      throw new NotFoundException('User not found!');
    }
  }
  async updatePassword(request: Request, updatePassword: UpdatePasswordDto) {
    if (updatePassword.password !== updatePassword.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    const cookie = request.cookies['jwt'];
    const { email } = await this.jwtService.verifyAsync(cookie);
    const user = await this.userRepository.findOne({where: {email}});
    if (user) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(updatePassword.password, user.salt);

      try {
        await user.save();
        return { message: 'Password changed successfully' };
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    else {
      throw new NotFoundException('User not found!');
    }
  }
}
