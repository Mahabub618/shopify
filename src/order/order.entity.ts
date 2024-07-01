import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

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

  @Column()
  firstName: string;

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

  @Column({default: false})
  complete: boolean;

  @OneToMany(type => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];
}
