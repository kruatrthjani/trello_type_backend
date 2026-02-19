import { Controller,Get, HttpCode, Post ,Body} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/auth.dto";
@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}
    
    @Get()
    getAuth():string{
        return this.authService.hello()
    } 

    @Post()
    Register(@Body() registerDto:RegisterDto){
        return this.authService.register(registerDto)
    }
}