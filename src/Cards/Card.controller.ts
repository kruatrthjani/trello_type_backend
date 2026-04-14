import { Resolver } from "@nestjs/graphql";
import { CardService } from "./Card.service";
import { Query } from "@nestjs/graphql";
@Resolver()
export class CardController{
    constructor(private readonly cardService:CardService){}

    @Query(()=>String)
    getCard(){
        
        return this.cardService.getCard();
    }

}