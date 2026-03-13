import { Module } from "@nestjs/common";
import { BoardResolver } from "./board.resolver";
import { boardService } from "./board.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers:[BoardResolver,boardService,PrismaService],
    controllers:[],
})
export default class BoardModule{}