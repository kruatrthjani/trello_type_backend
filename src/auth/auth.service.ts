import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/auth.dto";
@Injectable()
export class AuthService{
    hello():string{
        return "ok"
    }

    register({id,password}:RegisterDto){
        console.log("id=",id);
        console.log("password=",password)
        return;
    }
}