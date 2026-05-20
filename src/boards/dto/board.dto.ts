import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@ObjectType()
export class BoardOutputDto {
  @Field()
  boardId: string;

  @Field()
  boardName: string;

  @Field(() => String, { nullable: true })
  boardDescription?: string | null;

  @Field()
  projectId: string;
}

@InputType()
export class CreateBoardInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;
}

@InputType()
export class UpdateBoardInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}
