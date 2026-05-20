import { Field, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { registerEnumType } from "@nestjs/graphql";

export enum sType {
    PENDING='pending',
    INPROGRESS='inprogress',
    DONE='done'
}


registerEnumType(sType, {
  name: 'sType',
});

@ObjectType()
export class CardDto{
    @Field()
    @IsString()
    @IsNotEmpty()
    cardTitle:string;

    @Field()
    @IsString()    
    @IsNotEmpty()
    cardDescription:string;

    // @IsString()
    // @IsNotEmpty()
    // cardId:string;
    @Field(()=>sType)
    @IsEnum(sType)
    status:sType
}