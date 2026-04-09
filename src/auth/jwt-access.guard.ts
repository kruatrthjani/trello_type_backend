import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({
        code: 'ACCESS_TOKEN_MISSING',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
      ) as any;

      if (payload.type !== 'access') {
        throw new UnauthorizedException({
          code: 'ACCESS_TOKEN_INVALID',
        });
      }

      request.user = payload;
      return true;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          code: 'ACCESS_TOKEN_EXPIRED',
        });
      }

      throw new UnauthorizedException({
        code: 'ACCESS_TOKEN_INVALID',
      });
    }
  }
}