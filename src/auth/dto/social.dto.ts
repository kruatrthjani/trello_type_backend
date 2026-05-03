import { IsString,IsIn } from "class-validator";

export class socialDto {
    @IsIn(['google','provider'])
    provider:'google'|'github';

    @IsString()
    code:string;
}