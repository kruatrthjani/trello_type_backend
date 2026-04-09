import { Injectable } from "@nestjs/common";

@Injectable()
export class CardService{
    getCard(){
        return "Get The Card"
    }
}