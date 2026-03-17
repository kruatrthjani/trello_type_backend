import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class boardService{
    constructor(private readonly prismaservice:PrismaService){}

    async createBoard(name,assigner,description ){
        const data = await this.prismaservice.boards.create({
            data: {boardName:name,boardAssigner:assigner,boardDescription:description},
       
       })
       return data;
    }

}