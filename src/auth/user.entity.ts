import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { Order } from "../order/order.entity";
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @Column({default: true})
  isAmbassador: boolean;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @OneToMany(type => Order, order => order.user, {
    createForeignKeyConstraints: false
  })
  orders: Order[]

  getRevenue(): number {
    return this.orders.filter(order => order.complete).reduce((sum, order) => sum + order.getAmbassadorRevenue() ,0)
  }
}
