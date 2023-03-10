import { Body, Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { ValidationPipe } from "src/pipes/validation.pipe";
import useragent from 'useragent';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUserSessionId(@Req() req: Request, @Body(new ValidationPipe()) body: {user_id: string}){
        let userId = body.user_id;

        if(userId){
            let user = await this.userService.getUser(userId);
            return user;
        }
        

        let userAgentString = req.headers['user-agent'];
        const userAgentResult = useragent.parse(userAgentString);

        const device = {
            browser: userAgentResult.family,
            browser_version: userAgentResult.toVersion(),
            os: userAgentResult.os.family,
            os_version: userAgentResult.os.toVersion(),
        };
        const id = uuidv4();

        let new_user = await this.userService.createUser({id, ...device})
    
        return(new_user)
    }
}