import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { CommentService } from "./commment.service";
import { CommenPosttDto } from "./commentdto/comment.dto";

@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(":cardId")
  async getComments(
    @Param("cardId") cardId: string,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.commentService.getComments(cardId, userId);
  }

  @Get("replies/:commentId")
  async getReplies(
    @Param("commentId") commentId: string,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.commentService.getReplies(commentId, userId);
  }

  @Post()
  async postComment(
    @Body() commentdto: CommenPosttDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.commentService.postComment({ userId, commentdto });
  }

  @Put()
  async updateComment(
    @Body() commentdto: CommenPosttDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.commentService.updateComment({ userId, commentdto });
  }

  @Delete(":commentId")
  async deleteComment(
    @Param("commentId") commentId: string,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.commentService.deleteComment(commentId, userId);
  }
}