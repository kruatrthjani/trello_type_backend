import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Board {

  @Field()
  boardId: string;

  @Field()
  boardName: string;

  @Field()
  boardAssigner: string;

  @Field({ nullable: true })
  boardDescription?: string;

}