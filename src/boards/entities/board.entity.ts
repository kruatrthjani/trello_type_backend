import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Board {
  @Field()
  boardId: string;

  @Field()
  boardName: string;

  @Field({ nullable: true })
  boardDescription?: string;

  @Field()
  projectId: string;
}
