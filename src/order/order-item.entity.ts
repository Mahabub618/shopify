import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productTitle: string;

  @Column()
  price: string;

  @Column()
  quantity: string;

  @Column()
  adminRevenue: string;

  @Column()
  ambassadorRevenue: string;

  @ManyToOne(type => Order, order => order.orderItems)
  @JoinColumn({name: 'orderId'})
  order: Order
}
