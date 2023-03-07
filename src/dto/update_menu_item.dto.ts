import { IsString, IsNumber,  IsOptional } from "class-validator";

export class UpdateMenuItemDTO{
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsString()
    @IsOptional()
    image_link: string;
}