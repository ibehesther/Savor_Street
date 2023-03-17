import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ValidationPipe } from "src/pipes/validation.pipe";
import useragent from 'useragent';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';

config();

const configService = new ConfigService();

const generateJWT= (id: string) => {
    const payload = {id}
    const token = jwt.sign(payload, configService.get('JWT_SECRET') as string, { expiresIn: '12h' });
    return token;
}

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async getUserSessionId(@Req() req: Request, @Res() res: Response, @Body(new ValidationPipe()) body: {user_id: string | undefined}){
        let userId = body.user_id;
        if(userId){
            let user = await this.userService.getUser(userId);
            const token = generateJWT(userId);
            res.cookie("access_token", token, {
                sameSite: "strict",
                maxAge: 86400000, //valid for 1 day
                httpOnly: true
            }).status(200).json(user);
            return user
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
        const token = generateJWT(id);
        res.cookie("access_token", token, {
            sameSite: "strict",
            maxAge: 86400000, //valid for 1 day
            httpOnly: true
        }).status(201).json(new_user);
        return new_user
    }
}