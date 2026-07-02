import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Common permission check
   * - Card must exist
   * - User must be a member of the board containing the card
   */
  private async hasPermission(cardId: string, userId: string) {
    const card = await this.prismaService.card.findUnique({
      where: {
        cardId,
      },
    });

    if (!card) {
      throw new NotFoundException("Card not found");
    }

    const boardMember = await this.prismaService.boardMember.findFirst({
      where: {
        boardId: card.boardId,
        userId,
      },
    });

    if (!boardMember) {
      throw new ForbiddenException(
        "You don't have permission to access this card."
      );
    }

    return card;
  }

  async getComments(cardId: string, userId: string) {
    try {
      await this.hasPermission(cardId, userId);

      const data = await this.prismaService.comment.findMany({
        where: {
          cardId,
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Unable to fetch comments");
    }
  }

  async getReplies(commentId: string, userId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: {
          commentId,
        },
      });

      if (!comment) {
        throw new NotFoundException("Comment not found");
      }

      await this.hasPermission(comment.cardId, userId);

      const data = await this.prismaService.comment.findMany({
        where: {
          replyTo: commentId,
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new BadGatewayException("Unable to fetch replies");
    }
  }

  async postComment({ userId, commentdto }) {
    try {
      await this.hasPermission(commentdto.cardId, userId);

      const response = await this.prismaService.comment.create({
        data: {
          ...commentdto,
          userId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Unable to post comment");
    }
  }

  async updateComment({ userId, commentdto }) {
    try {
      const { commentId } = commentdto;

      await this.hasPermission(commentdto.cardId, userId);

      const response = await this.prismaService.comment.update({
        where: {
          commentId,
        },
        data: {
          ...commentdto,
          userId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Unable to update comment");
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: {
          commentId,
        },
      });

      if (!comment) {
        throw new NotFoundException("Comment not found");
      }

      await this.hasPermission(comment.cardId, userId);

      const response = await this.prismaService.comment.delete({
        where: {
          commentId,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Unable to delete comment");
    }
  }
}