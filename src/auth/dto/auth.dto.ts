import { IsEmail,IsNotEmpty,IsString } from "class-validator";
export class RegisterDto{
    id:String;
    password:String;
}