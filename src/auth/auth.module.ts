import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, EmailModule,RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
