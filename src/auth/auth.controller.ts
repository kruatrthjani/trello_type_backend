import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
} from '@nestjs/common';

import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';


@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  health() {
    return 'ok';
  }

  
  @Post()
  authenticate(@Body() dto: AuthDto) {
    if (dto.provider) {
      return this.authService.socialLogin(dto);
    }

    if (dto.mode === 'register') {
      return this.authService.register(dto);
    }

    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Headers('authorization') authHeader: string) {
    const refreshToken = authHeader?.replace('Bearer ', '');
    return this.authService.refreshAccessToken(refreshToken);
  }
}