import { IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateOrderItemDTO{
    @IsNumber()
    @IsOptional()
    quantity: number;
}