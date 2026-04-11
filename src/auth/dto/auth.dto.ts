import { DefaultValuePipe } from '@nestjs/common';
import { roleType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEmail,
  IsIn,
  ValidateIf,
  IsOptional
} from 'class-validator';

export class AuthDto {
  /* ---------------- MODE ---------------- */

  @ValidateIf(o => !o.provider)
  @IsIn(['register', 'login'])
  mode?: 'register' | 'login';

  /* ---------------- EMAIL ---------------- */

  @ValidateIf(o => o.mode === 'register' || o.mode === 'login')
  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  /* ---------------- PASSWORD ---------------- */

  @ValidateIf(o => o.mode === 'register' || o.mode === 'login')
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password?: string;

  /* ---------------- REGISTER ONLY ---------------- */

  @ValidateIf(o => o.mode === 'register')
  @IsString()
  @IsNotEmpty({ message: 'Name is required for registration' })
  name?: string;

  @ValidateIf(o => o.mode === 'register')
  @MinLength(6)
  @Matches(
    /^(?=(?:.*[a-z]){2,})(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*()]).+$/,
    { message: 'Weak password format' },
  )
  retypepassword?: string;

  @IsString()
  @IsOptional()
  role?:roleType='DEVELOPER';
  
  /* ---------------- SOCIAL ONLY ---------------- */

  @ValidateIf(o => o.provider !== undefined)
  @IsIn(['google', 'github'])
  provider?: 'google' | 'github';

  @ValidateIf(o => o.provider !== undefined)
  @IsString()
  @IsNotEmpty()
  code?: string;
}