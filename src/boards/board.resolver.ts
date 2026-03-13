import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class BoardResolver {

  @Query(() => String)
  hello(a) {

    return "GraphQL working"+a;
  }

}