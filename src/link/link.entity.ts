import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";
import { Product } from "../product/product.entity";
import { JoinTable } from "typeorm";

@Entity('links')
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  code: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'linkUsers',
    joinColumn: {name: 'linkId', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id'}
  })
  user: User;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'linkProducts',
    joinColumn: {name: 'linkId', referencedColumnName: 'id'},
    inverseJoinColumn: {name: 'productId', referencedColumnName: 'id'}
  })
  products: Product[];
}
