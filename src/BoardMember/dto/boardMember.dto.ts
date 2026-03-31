import { IsString } from "class-validator";
export class boardMember{

    @IsString()
    readonly boardId:string;

    // @IsString()
    // readonly boardName:string;

    // @IsString()
    // readonly boardDescription:string;

    // @IsString()
    // readonly projectId:string;

}