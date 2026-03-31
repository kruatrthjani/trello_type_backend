import { Injectable, Module } from "@nestjs/common";
import { BoardMemberService } from "./BoardMember.service";
import { BoardMemberController } from "./BoardMember.resolver";




@Module({
    // controllers:[BoardMemberController],
    providers:[BoardMemberController,BoardMemberService],
    // exports:[BoardMemberService]

})
export default class BoardMemberModule{}