import { IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class APIFeatures {
    
    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @IsOptional()
    page: number = 1;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @IsOptional()
    limit: number = 10;
}