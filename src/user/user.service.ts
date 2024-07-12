import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { Repository } from "typeorm";
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }
  async save(options) {
    return this.userRepository.save(options);
  }
  async ambassadors() {
    return this.userRepository.find({where: {isAmbassador: true}});
  }
  async getRankings() {
    const ambassadors: User[] = await this.userRepository.find({
      where: {isAmbassador: true},
      relations: ['orders', 'orders.orderItems']
    });
    return ambassadors.map(ambassador => {
      return {
        name: ambassador.name,
        revenue: ambassador.revenue
      }
    })
  }
}
