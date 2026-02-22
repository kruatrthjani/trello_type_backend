import {  BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/auth.dto";
@Injectable()
export class AuthService{
    hello():string{
        return "ok"
    }

    register({email,password}:RegisterDto){
        console.log("email=",email)
        console.log("password",password)
        if(!email || ! password){
            throw new BadRequestException(`${(!email &&!password)?'email & password are':!email?'email is':'passwword'} not provemailed`)
        }

        
        return "ok";
    }
}