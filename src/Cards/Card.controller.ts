import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CardService } from './Card.service';
import { Query } from '@nestjs/graphql';
import { CardDto } from './dto/Card.dto';
import { Body } from '@nestjs/common';


@Resolver()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  

  @Query(() => String)
  getCard() {
    return this.cardService.getCard();
  }

  // @Mutation(()=>CardDto)
  // createCard(@Args() cardDto:CardDto){
  //   return this.cardService.createCard(cardDto)
  // }
//  @Mutation(() => CardDto)
//   createCard(
//     @Args('cardDto')cardDto:CardDto
//   ) {
//     return this.cardService.createCard(cardDto);
//   }
}
