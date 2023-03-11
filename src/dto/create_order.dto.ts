import { IsNumber, IsNotEmpty, IsUUID, IsDate, IsEnum } from "class-validator";
import { OrderStatus } from "src/enum/order_status.enum";
import { PaymentStatus } from "src/enum/payment_status.enum";

export class CreateOrderDTO{
    @IsUUID()
    @IsNotEmpty({message: "User ID cannot be empty"})
    user_id: string;

    @IsEnum(OrderStatus)
    order_status= OrderStatus.PENDING;

    @IsEnum(PaymentStatus)
    payment_status= PaymentStatus.PENDING;

    @IsNumber()
    total_order_amount= 0;
}
