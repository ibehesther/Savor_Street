import { IsString, IsNotEmpty } from "class-validator";

export class CreateUserDTO{
    @IsString()
    @IsNotEmpty({message: "Id cannot be empty"})
    id: string;

    @IsString()
    @IsNotEmpty({message: "Browser cannot be empty"})
    browser: string;

    @IsString()
    @IsNotEmpty({message: "Browser version cannot be empty"})
    browser_version: string;

    @IsString()
    @IsNotEmpty({message: "OS cannot be empty"})
    os: string;

    @IsString()
    @IsNotEmpty({message: "OS version cannot be empty"})
    os_version: string;
}