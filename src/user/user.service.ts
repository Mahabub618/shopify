import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { Repository } from "typeorm";
import { RedisService } from '../shared/redis.service';
import { Response } from "express";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
    private redisService: RedisService
  ) {
  }
  async save(options) {
    return this.userRepository.save(options);
  }
  async ambassadors() {
    return this.userRepository.find({where: {isAmbassador: true}});
  }
  async getRankings(response: Response) {
    const client = this.redisService.getClient();

    client.zrevrangebyscore('rankings', '+inf', '-inf', 'withscores', (err, result) => {
      let score;
      response.send(result.reduce((obj, nameOrRevenue) => {
        if (isNaN(parseInt(nameOrRevenue))) {
          return {
            ...obj,
            [nameOrRevenue]: score
          }
        }
        else {
          score = parseInt(nameOrRevenue);
          return obj;
        }
      }, {}));
    });

  }
}
