import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller('auth')
export class authController{
    constructor (private readonly authservice :AuthService){}

    @Post()
    setCredentials(){
        return this.authservice.setByPassword({id,password});
    }


}