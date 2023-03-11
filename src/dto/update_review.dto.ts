import { IsNumber, IsNotEmpty, IsUUID, IsDate, IsEnum, IsString, IsOptional, IsDateString } from "class-validator";

export class UpdateReviewDTO{
    @IsEnum([1, 2, 3, 4, 5])
    @IsOptional()
    rating: number;

    @IsString()
    @IsOptional()
    review: string

    @IsDateString()
    review_date_time: Date;
}
