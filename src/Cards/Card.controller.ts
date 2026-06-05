import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CardService } from './Card.service';
import { Query } from '@nestjs/graphql';
import { CardDto,CardInputDto } from './dto/Card.dto';
import { Body } from '@nestjs/common';


@Resolver()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  

  @Query(() => String)
  getCard() {
    return this.cardService.getCard();
  }

   @Mutation(()=>CardDto)
   createCard(@Args('data') data:CardInputDto){
     return this.cardService.createCard(data)
   }
//  @Mutation(() => CardDto)
//   createCard(
//     @Args('cardDto')cardDto:CardDto
//   ) {
//     return this.cardService.createCard(cardDto);
//   }
}
