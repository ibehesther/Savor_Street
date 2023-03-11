import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("order_items")
export class OrderItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    item_id: number;

    @Column()
    quantity: number;

}