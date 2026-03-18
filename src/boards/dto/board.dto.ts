import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateBoardInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  assigner: string;

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
  assigner?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}