import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { StatusType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileUpload } from 'graphql-upload';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

registerEnumType(StatusType, {
  name: 'StatusType',
});

@InputType()
export class CardInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  cardTitle!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cardDescription!: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  cardImage?: Promise<FileUpload> | null;
}

@InputType()
export class CardUpdateInputDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cardTitle?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cardDescription?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  cardImage?: Promise<FileUpload> | null;

  @Field(() => StatusType, { nullable: true })
  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType;
}

@ObjectType()
export class CardDto {
  @Field()
  cardId!: string;

  @Field()
  cardTitle!: string;

  @Field()
  cardDescription!: string;

  @Field({ nullable: true })
  cardImage?: string;

  @Field(() => StatusType)
  status!: StatusType;
}