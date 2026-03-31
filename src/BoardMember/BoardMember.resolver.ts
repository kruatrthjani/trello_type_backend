import { Resolver,Query, Mutation } from "@nestjs/graphql";
import { BoardMemberService } from "./BoardMember.service";
import { BoardMemberClass } from "./entity/BoardMember";
// import { Query } from "@nestjs/common";

@Resolver()
export class BoardMemberController{
    constructor(private readonly boardmemberservice:BoardMemberService){}

    @Query(()=> BoardMemberClass)
    BoardMember(){
        return "h"
    }

    @Mutation(()=>BoardMemberClass)
    CreateBoardMember(){
        return 
    }
}