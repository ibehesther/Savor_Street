import { IsNumber, IsUUID, IsDate, IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/enum/order_status.enum";
import { PaymentStatus } from "src/enum/payment_status.enum";

export class UpdateOrderDTO{
    @IsUUID()
    @IsOptional()
    user_id: string;

    @IsDate()
    @IsOptional()
    order_date_time: Date;

    @IsEnum(OrderStatus)
    @IsOptional()
    order_status: OrderStatus;

    @IsEnum(PaymentStatus)
    @IsOptional()
    payment_status: PaymentStatus;

    @IsNumber()
    @IsOptional()
    total_order_amount: number;
}
