import { Field,ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BoardMemberClass{
    @Field()
    boardMemberId:string;

    @Field()
    boardId:string;

    @Field()
    userId:string;

    @Field()
    canCreate:string;

    @Field()
    canView:string;
    
    @Field()
    canDelete:String;

    @Field()
    canEdit:string;

    @Field()
    canComment:string;

    @Field()
    createdAt:string;
}