import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './projects/projects.module';
import BoardModule from './boards/board.module';
import BoardMemberModule from './BoardMember/BoardMember.module';
import { JwtAccessGuard } from './auth/jwt-access.guard';
import CardModule from './Cards/Card.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      csrfPrevention: false,
      context: ({ req }) => ({ req }),
      resolvers: { Upload: GraphQLUpload },
      formatError: (error) => {
        const originalError = error.extensions?.originalError as { statusCode?: number; code?: string } | undefined;

        return {
          message: error.message,
          statusCode: originalError?.statusCode,
          code: originalError?.code,
        };
      },
    }),

    PrismaModule,
    AuthModule,
    BoardModule,
    ProjectModule,
    BoardMemberModule,
    CardModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}

