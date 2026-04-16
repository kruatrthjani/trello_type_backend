import { Resolver,Query, Mutation, Args } from "@nestjs/graphql";
import { BoardMemberService } from "./BoardMember.service";
import { BoardMemberClass } from "./entity/BoardMember";
import { RoleType } from "./entity/BoardMember";
import { Roles } from "src/auth/roles.decorator";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/auth/roles.guard";
// import { Query } from "@nestjs/common";

@Resolver()
@UseGuards(RolesGuard)
export class BoardMemberController{
    constructor(private readonly boardmemberservice:BoardMemberService){}

    @Query(()=> BoardMemberClass)
    BoardMember(
        @Args('boardId') boardId:string,
    ){
        return this.boardmemberservice.getBoardMember(boardId)
    }

    @Roles('CLIENT')
    @Mutation(()=>BoardMemberClass)
    CreateBoardMember(
        @Args ('boardId') boardId:string,
        @Args('role', { type: () => RoleType }) role: RoleType,
        @Args('userId') userId:string,
    ) {
        return this.boardmemberservice.createBoardMember({ boardId, role, userId });
    }

    @Roles('CLIENT')
    @Mutation(()=>BoardMemberClass)
    DeleteMember(
        @Args('boardId') boardId:string,
        // @Args('role',{type:()=>RoleType}) role:RoleType,
        @Args('userId') userId:string,
    ){
         return this.boardmemberservice.deleteBoardMember({boardId,userId});
    }

    @Roles('CLIENT')
    @Mutation(()=>BoardMemberClass)
    UpdateMember(
        @Args('boardId') boardId:string,
        @Args('role',{type:()=>RoleType}) role:RoleType,
        @Args('userId') userId:string,
    ){
        return this.boardmemberservice.deleteBoardMember({boardId,userId});
    }
}