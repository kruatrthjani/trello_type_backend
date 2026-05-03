import { IsEmail, IsString ,MinLength} from "class-validator";
import { Match } from "./MatchInDto";

export class signupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Match(`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*]).+$/`)
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  retypepassword: string;
}