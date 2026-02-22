import { IsDefined, IsString, IsNotEmpty, MinLength, Matches, IsEmail, isEmail } from 'class-validator';

export class RegisterDto {
//   @IsDefined({ message: 'id is required (cannot be missing)' })
//   @IsString({ message: 'id must be a string' })
//   @MinLength(1, { message: 'id cannot be empty' })
  @IsNotEmpty({ message: 'id cannot be empty' })
  @IsEmail({},{ message: 'Enter a valid email address'})
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'password too short' })
    @Matches(/^(?=(?:.*[a-z]){2,})(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*()]).+$/,{message:'password must include 2 small character 1 uppercase, number, special character'})
  password: string;
}