import { IsEnum, IsString } from "class-validator";

enum roleType{
    ADMIN='ADMIN',
    MEMBER='MEMBER',
    VIEWER='VIEWER',
}

export class boardMember{

    @IsString()
    readonly boardId:string;

    @IsEnum(roleType)
    readonly role:roleType;

    @IsString()
    readonly projectId:string;

   
}