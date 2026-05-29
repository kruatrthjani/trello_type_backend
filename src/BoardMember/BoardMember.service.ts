import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { roleType, $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardMemberService {
  constructor(private readonly prismaService: PrismaService) { }

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
        throw new NotFoundException('Board does not exist');
      }

      return {message:"all board members",data:board};
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createBoardMember(data: {
    boardId: string;
    userId: string;
  }) {
    try {
      // ✅ Check board exists
      const board = await this.prismaService.boards.findUnique({
        where: { boardId: data.boardId },
      });

      if (!board) {
        throw new NotFoundException('Board does not exist');
      }

      // ✅ Check user exists
      const user = await this.prismaService.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException('User does not exist');
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
        throw new NotFoundException('User already a member of this board');
      }

      // ✅ Create member
      const created= await this.prismaService.boardMember.create({
        data,
      });
      return{message:"BoardMEmber created successfully",data:{id:created.id,userId:created.userId}}
    } catch (error) {
      
      throw error
    }
  }

  async deleteBoardMember(id: string) {
    try {
      const board = await this.prismaService.boardMember.findUnique({
        where: {
          id
        },
      });
      if (!board) {
        throw new NotFoundException('Member with this board is not found');
      }
      const deleted = await this.prismaService.boardMember.delete({
        where: { id },
      });
      return { message: "BoardID deleted successfully", data: deleted }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateBoardMember(data: {
    id: string;
    userId: string;
    // role: $Enums.BoardRole;
  }) {
    try {
      const finding = await this.prismaService.boardMember.findUnique({
        where: {
          id: data.id,
        }
      })

      if (!finding) {
        throw new NotFoundException("Board-Member Id not found")
      }

      if (finding) {
        const existing = await this.prismaService.boardMember.findUnique({
          where: {
            userId_boardId: {
              userId: data.userId,
              boardId: finding.boardId,
            },
          },
        });

        if (existing) {
          throw new NotFoundException('User already a member of this board');
        }
      }
      const findUser = await this.prismaService.user.findUnique({ where: { id: data.userId } })
      if (!findUser) {
        throw new NotFoundException("No user found")
      }

      const updateUser = await this.prismaService.boardMember.update({ where: { id: data.id }, data: { userId: data.userId } })
      return { message: "User updated successfully", data: updateUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
