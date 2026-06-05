import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { registerEnumType } from "@nestjs/graphql";

export enum sType {
    PENDING='pending',
    INPROGRESS='inprogress',
    DONE='done'
}


registerEnumType(sType, {
  name: 'sType',
});

@InputType()
export class CardInputDto{
    @Field()
    @IsString()
    @IsNotEmpty()
    cardTitle:string;

    @Field()
    @IsString()
    @IsNotEmpty()
    cardDescription:string;

    @Field({nullable:true})
    @IsString()
    @IsOptional()
    cardImage?:Base64URLString;
}




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

    @Field()
    @IsString()
    @IsOptional()
    cardImage?:string;

    // @IsString()
    // @IsNotEmpty()
    // cardId:string;
    @Field(()=>sType)
    @IsEnum(sType)
    status:sType
}