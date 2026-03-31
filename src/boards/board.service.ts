import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBoardInput, UpdateBoardInput } from "./dto/board.dto";
import { NODATA } from "node:dns";

@Injectable()
export class boardService {
  constructor(private readonly prismaservice: PrismaService) {}

  //get all boards
  async getAllBoards(){
    const data=await this.prismaservice.boards.findMany({})
    return data; 
  }

  async getBoard(id:string){
      const data=await this.prismaservice.boards.findUnique({where:{
        boardId:id
      },})
      return data;
  }

  // ✅ CREATE BOARD
  async createBoard(data: CreateBoardInput, projectId: string) {
    const existing = await this.prismaservice.boards.findFirst({
      where: { boardName: data.name, projectId },
    });

    if (existing) {
      throw new ConflictException("Already existing board");
    }

    return this.prismaservice.boards.create({
      data: {
        boardName: data.name,
        boardDescription: data.description,
        projectId,
      },
    });
  }

  // ✅ UPDATE BOARD
  async updateBoard(data: UpdateBoardInput) {
    const existing = await this.prismaservice.boards.findUnique({
      where: { boardId: data.id },
    });

    if (!existing) {
      throw new NotFoundException("Board not found");
    }

    return this.prismaservice.boards.update({
      where: { boardId: data.id },
      data: {
        ...(data.name !== undefined && { boardName: data.name }),
        ...(data.assigner !== undefined && {
          boardAssigner: data.assigner,
        }),
        ...(data.description !== undefined && {
          boardDescription: data.description,
        }),
      },
    });
  }

  async deleteBoard(id:string){
  
    const data=await this.prismaservice.boards.findUnique({where: {
      boardId:id},
    });

    if(!data){
      throw new NotFoundException("Data didn't exist")
    }

    const response=await this.prismaservice.boards.delete({where:{
      boardId:id,
    },})
  }
}
