import { IsEnum, IsNotEmpty, IsString } from "class-validator";


export enum sType {
    PENDING='pending',
    INPROGRESS='inprogress',
    DONE='done'
}

export class CardDto{
    @IsString()
    @IsNotEmpty()
    cardTitle:string;

    @IsString()    
    @IsNotEmpty()
    cardDescription:string;

    // @IsString()
    // @IsNotEmpty()
    // cardId:string;

    @IsEnum(sType)
    status:sType
}