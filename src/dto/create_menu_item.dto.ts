import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateMenuItemDTO{
    @IsString()
    @IsNotEmpty({message: "Name cannot be empty"})
    name: string;

    @IsString()
    @IsNotEmpty({message: "Description cannot be empty"})
    description: string;

    @IsNumber()
    @IsNotEmpty({message: "Price cannot be empty"})
    price: number;

    @IsString()
    @IsNotEmpty({message: "Image_link cannot be empty"})
    image_link: string;
}