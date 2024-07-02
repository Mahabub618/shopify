import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Exclude, Expose } from "class-transformer";

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

  @Expose()
  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  get total() {
    return this.orderItems.reduce((sum, orderItem) => sum + (orderItem.price*orderItem.quantity), 0);
  }
}
