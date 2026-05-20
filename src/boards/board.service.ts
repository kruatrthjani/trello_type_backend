import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BoardOutputDto,
  CreateBoardInput,
  UpdateBoardInput,
} from './dto/board.dto';

@Injectable()
export class boardService {
  constructor(private readonly prismaservice: PrismaService) {}

  // get all boards
  async getAllBoards(): Promise<BoardOutputDto[]> {
    return this.prismaservice.boards.findMany({});
  }

  async getBoard(id: string): Promise<BoardOutputDto> {
    const data = await this.prismaservice.boards.findUnique({
      where: {
        boardId: id,
      },
    });

    if (!data) {
      throw new NotFoundException('Board not found');
    }

    return data;
  }

  // ✅ CREATE BOARD
  async createBoard(
    data: CreateBoardInput,
    projectId: string,
  ): Promise<BoardOutputDto> {
    const existing = await this.prismaservice.boards.findFirst({
      where: { boardName: data.name, projectId },
    });

    if (existing) {
      throw new ConflictException('Already existing board');
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
  async updateBoard(data: UpdateBoardInput): Promise<BoardOutputDto> {
    const existing = await this.prismaservice.boards.findUnique({
      where: { boardId: data.id },
    });

    if (!existing) {
      throw new NotFoundException('Board not found');
    }

    return this.prismaservice.boards.update({
      where: { boardId: data.id },
      data: {
        ...(data.name !== undefined && { boardName: data.name }),
        ...(data.description !== undefined && {
          boardDescription: data.description,
        }),
      },
    });
  }

  async deleteBoard(id: string): Promise<BoardOutputDto> {
    const data = await this.prismaservice.boards.findUnique({
      where: {
        boardId: id,
      },
    });

    if (!data) {
      throw new NotFoundException("Data didn't exist");
    }

    return this.prismaservice.boards.delete({
      where: {
        boardId: id,
      },
    });
  }
}
