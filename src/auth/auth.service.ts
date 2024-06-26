import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              private jwtService: JwtService) {
  }
  async register(registerDto: RegisterDto){
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
      user.isAmbassador = false;
      user.password = await this.hashPassword(registerDto.password, user.salt);
      try {
        return await user.save();
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
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

  async login(authCredentialDto: AuthCredentialDto){
    const { email, password } = authCredentialDto;
    const user: User = await this.userRepository.findOne({where: { email }});

    if (user && await user.validatePassword(password)) {
      const payload: JwtPayload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
    else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
