import { IsEmail, IsString ,MinLength,Matches} from "class-validator";
import { Match } from "./MatchInDto";
import { InputType } from "@nestjs/graphql";

@InputType()
export class signupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*]).+$/,{message:"Invalid password"})
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  retypepassword: string;

  @IsString()
  role:String;
}