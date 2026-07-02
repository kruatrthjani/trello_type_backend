import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CommenPosttDto{

    @IsString()
    @IsNotEmpty()
    readonly cardId:string;

    @IsString()
    @IsNotEmpty()
    readonly comment:string;
    
    @IsString()
    @IsOptional()
    readonly replyTo:string;
}

export class CommentUpdateDto{
    @IsString()
    @IsNotEmpty()
    readonly commentId:string;

    @IsString()
    @IsNotEmpty()
    readonly cardId:string;

    @IsString()
    @IsOptional()
    readonly comment:string;
    
    @IsString()
    @IsOptional()
    readonly replyTo:string;
}