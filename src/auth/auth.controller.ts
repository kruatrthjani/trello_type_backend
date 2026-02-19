import { Controller,Get, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService ){}

    @Get()
    getAuth():string{
        return this.authService.hello()
    }
}