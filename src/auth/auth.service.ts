import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    setByPassword({id,password}:{id:string,password:string}){
            console.log("id")
    }
}