import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from './order-item.entity';
import { Exclude, Expose } from "class-transformer";
import { Link } from "../link/link.entity";
import { User } from "../auth/user.entity";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: string;

  @Column()
  userId: string;

  @Column()
  code: string;

  @Column()
  ambassadorEmail: string;

  @Exclude()
  @Column()
  firstName: string;

  @Exclude()
  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  country: string;

  @Column({nullable: true})
  city: string;

  @Column({nullable: true})
  zip: string;

  @Exclude()
  @Column({default: false})
  complete: boolean;

  @OneToMany(type => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(type => Link, link => link.orders, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    referencedColumnName: 'code',
    name: 'code'
  })
  link: Link

  @ManyToOne(type => User, user => user.orders, {
    createForeignKeyConstraints: false
  })
  user: User;

  @Expose()
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get total() {
    return this.orderItems.reduce((sum, orderItem) => sum + (orderItem.price*orderItem.quantity), 0);
  }

  get ambassadorRevenue(): number {
    return this.orderItems.reduce((sum, orderItem) => sum + orderItem.ambassadorRevenue, 0);
  }
}
