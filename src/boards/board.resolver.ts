import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { boardService } from './board.service';
import { Board } from './entities/board.entity';



@Resolver()
export class BoardResolver {
constructor(private readonly BoardService:boardService){}
  @Query(() => String)
  hello() {
    return "GraphQL working";
  }
  
  // @Query(() => String)
  // async createBoard(name,assigner,descripton) {
  //    return this.BoardService.createBoard(name,assigner,descripton)
  // }


  @Mutation(()=>Board)
  async createBoard(
    @Args('name') name:string,
    @Args('assigner') assigner:string,
    @Args('description') description:string,
  ){
    return this.BoardService.createBoard(name,assigner,description)
  }
}