import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { boardService } from './board.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput, UpdateBoardInput } from './dto/board.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { ForbiddenException, HttpException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
@Resolver()
@UseGuards(RolesGuard)
export class BoardResolver {
  constructor(private readonly BoardService: boardService) {}

  @Roles('MANAGER') 
  @Query(() => String)
  hello() {
    try{
    return 'GraphQL working';
    }
    catch(error){
      throw new ForbiddenException("Forbidden access")
    }
  }

  // ✅ CREATE with object
  
  @Mutation(() => Board)
  async createBoard(
    @Args('data') data: CreateBoardInput,
    @Args('projectId') projectId: string,
  ) {
    return this.BoardService.createBoard(data, projectId);
  }

  // ✅ UPDATE with object
  @Mutation(() => Board)
  async updateBoard(@Args('data') data: UpdateBoardInput) {
    return this.BoardService.updateBoard(data);
  }

  @Mutation(() => Board)
  async deleteBoard(@Args('id') id: string) {
    return this.BoardService.deleteBoard(id);
  }

  @Query(() => [Board])
  async getAllBoard() {
    return this.BoardService.getAllBoards();
  }

  
  @Query(() => Board)
  async getBoard(@Args('id') id: string) {
    return this.BoardService.getBoard(id);
  }
}
