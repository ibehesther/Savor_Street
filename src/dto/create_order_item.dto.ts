import { Transform } from "class-transformer";
import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateOrderItemDTO{
    @IsNumber()
    @IsNotEmpty({message: "Order ID cannot be empty"})
    order_id: number;

    @IsNumber()
    @IsNotEmpty({message: "Item ID cannot be empty"})
    item_id: number;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @IsNotEmpty({message: "Quantity cannot be empty"})
    quantity: number;
}