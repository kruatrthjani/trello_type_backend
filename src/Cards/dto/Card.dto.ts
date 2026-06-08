import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { registerEnumType } from "@nestjs/graphql";
import { StatusType } from "@prisma/client";

// export enum sType {
//     PENDING,
//     INPROGRESS,
//     DONE
// }




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

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    cardImage?: string;
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

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    cardImage?: string;

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