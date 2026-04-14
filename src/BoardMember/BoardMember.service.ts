import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BoardMemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBoardMember(boardId: string) {
    try {
      const board = await this.prismaService.boards.findUnique({
        where: { boardId },
        include: {
          members: {
            include: {
              user: true, // 👈 important: fetch user details
            },
          },
        },
      });

      if (!board) {
        throw new NotFoundException("Board does not exist");
      }

      return board.members;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createBoardMember(data: {
    boardId: string;
    userId: string;
    role: "ADMIN" | "MEMBER" | "VIEWER";
  }) {
    try {
      // ✅ Check board exists
      const board = await this.prismaService.boards.findUnique({
        where: { boardId: data.boardId },
      });

      if (!board) {
        throw new NotFoundException("Board does not exist");
      }

      // ✅ Check user exists
      const user = await this.prismaService.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException("User does not exist");
      }

      // ✅ Prevent duplicate membership
      const existing = await this.prismaService.boardMember.findUnique({
        where: {
          userId_boardId: {
            userId: data.userId,
            boardId: data.boardId,
          },
        },
      });

      if (existing) {
        throw new NotFoundException("User already a member of this board");
      }

      // ✅ Create member
      return await this.prismaService.boardMember.create({
        data,
      });

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async deleteBoardMember(data:{
    boardId:string,
    userId:string,
  }){
    try{
        const board=await this.prismaService.boardMember.findUnique({
          where :{ userId_boardId: {
    userId: data.userId,
    boardId: data.boardId
          }
        }
        });
        if(!board){
          throw new NotFoundException('Member with this board is not found')
        }
      return await this.prismaService.boardMember.delete({
        where:{
          userId_boardId:{
            userId:data.userId,
            boardId:data.boardId
          }
        }
      })
    }
    catch(error){
      throw new InternalServerErrorException(error.message)
    }
  }
}