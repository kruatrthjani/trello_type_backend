import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { boardService } from './board.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput, UpdateBoardInput } from './dto/board.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly BoardService: boardService) {}

  @Query(() => String)
  hello() {
    return "GraphQL working";
  }

  // ✅ CREATE with object
  @Mutation(() => Board)
  async createBoard(
    @Args('data') data: CreateBoardInput,
  ) {
    return this.BoardService.createBoard(
      data
    );
  }

  // ✅ UPDATE with object
  @Mutation(() => Board)
  async updateBoard(
    @Args('data') data: UpdateBoardInput,
  ) {
    return this.BoardService.updateBoard(
      data
    );
  }

  @Mutation(()=>Board)
  async deleteBoard(
    @Args('id') id:string,
  ){
    return this.BoardService.deleteBoard(id);
  }

  @Query(()=>[Board])
  async getAllBoard(){
    return this.BoardService.getAllBoards();
  }

  @Query(() => Board)
  async getBoard(
  @Args('id') id: string
  ) {
  return this.BoardService.getBoard(id);
  }
}