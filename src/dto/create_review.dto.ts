import { IsNumber, IsNotEmpty, IsUUID, IsDate, IsEnum, IsString, IsOptional, IsDateString } from "class-validator";

export class CreateReviewDTO{
    @IsUUID()
    @IsNotEmpty({message: "User ID cannot be empty"})
    user_id: string;

    @IsNumber()
    @IsNotEmpty({message: "Order ID cannot be empty"})
    order_id: number;

    @IsEnum([1, 2, 3, 4, 5])
    @IsNotEmpty({message: "Rating cannot be empty"})
    rating: number;

    @IsString()
    @IsOptional()
    review: string

    @IsDateString()
    review_date_time: Date;
}
