import { OrderStatus } from "../enum/order_status.enum";
import { PaymentStatus } from "../enum/payment_status.enum";
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity("orders")
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'uuid'
    })
    user_id: string;

    @CreateDateColumn()
    order_date_time: Date;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    order_status: OrderStatus;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    payment_status: PaymentStatus;

    @Column()
    total_order_amount: number;

}