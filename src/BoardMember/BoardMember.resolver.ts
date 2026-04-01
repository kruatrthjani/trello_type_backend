import { Resolver,Query, Mutation, Args } from "@nestjs/graphql";
import { BoardMemberService } from "./BoardMember.service";
import { BoardMemberClass } from "./entity/BoardMember";
import { RoleType } from "./entity/BoardMember";
// import { Query } from "@nestjs/common";

@Resolver()
export class BoardMemberController{
    constructor(private readonly boardmemberservice:BoardMemberService){}

    @Query(()=> BoardMemberClass)
    BoardMember(){
        return "h"
    }

    @Mutation(()=>BoardMemberClass)
    CreateBoardMember(
        @Args ('boardId') boardId:string,
        @Args('role', { type: () => RoleType }) role: RoleType,
        @Args('userId') userId:string,
    ) {
        return this.boardmemberservice.createBoardMember({ boardId, role, userId });
    }
}