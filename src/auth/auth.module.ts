import { Controller } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { Provider } from "generated/prisma/enums";
import { AuthService } from "./auth.service";

@Module({
    controllers:[AuthController],
    providers:[AuthService],
})
export class AuthModule {}