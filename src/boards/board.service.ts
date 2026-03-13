import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class boardService{
    constructor(private readonly prismaservice:PrismaService){}

    async createBoard(){
        const data = await this.prismaservice.boards.create({
            data: {boardName:"all",boardAssigner:"abc",boardDescription:"alphabet"},
       
       })
       return data;
    }

}