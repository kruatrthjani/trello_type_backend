import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BoardMemberService } from './BoardMember.service';
import { BoardMemberClass, BoardMemberResponse, GetBoardMembersResponse } from './entity/BoardMember';
import { RoleType } from './entity/BoardMember';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
// import { Query } from "@nestjs/common";

@Resolver()
@UseGuards(RolesGuard)
export class BoardMemberController {
  constructor(private readonly boardmemberservice: BoardMemberService) {}

  @Query(() => GetBoardMembersResponse)
  BoardMember(@Args('boardId') boardId: string) {
    return this.boardmemberservice.getBoardMember(boardId);
  }

  @Roles('CLIENT')
  @Mutation(() => BoardMemberResponse)
  CreateBoardMember(
    @Args('boardId') boardId: string,
    // @Args('role', { type: () => RoleType }) role: RoleType,
    @Args('userId') userId: string,
  ) {
    return this.boardmemberservice.createBoardMember({ boardId, userId });
  }

  @Roles('CLIENT')
  @Mutation(() => BoardMemberResponse)
  DeleteBoardMember(
    @Args('id') id: string,
    // @Args('role',{type:()=>RoleType}) role:RoleType,
    // @Args('userId') userId: string,
  ) {
    return this.boardmemberservice.deleteBoardMember(id);
  }

  @Roles('CLIENT')
  @Mutation(() => BoardMemberResponse)
  UpdateMember(
    @Args('id') id: string,
    // @Args('role', { type: () => RoleType }) role: RoleType,
    @Args('userId') userId: string,
  ) {
    return this.boardmemberservice.updateBoardMember({ id, userId });
  }
}
