import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './projects/projects.module';
import BoardModule from './boards/board.module';
import BoardMemberModule from './BoardMember/BoardMember.module';
import { JwtAccessGuard } from './auth/jwt-access.guard';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    PrismaModule,
    AuthModule,
    BoardModule,
    ProjectModule,
    BoardMemberModule,
  ],
  controllers: [AppController],
  providers:[AppService],
})
export class AppModule {}
