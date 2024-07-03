import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Link } from "./link.entity";
import { Repository } from "typeorm";

@Injectable()
export class LinkService {
  constructor(@InjectRepository(Link) private linkRepository: Repository<Link>) {
  }
  async save(options) {
    return this.linkRepository.save(options);
  }
  async getAllLink(id: number) {
    return this.linkRepository.find({where: {id}});
  }
}
