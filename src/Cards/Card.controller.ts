import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CardService } from './Card.service';
import { Query } from '@nestjs/graphql';
import { CardDto, CardInputDto, CardUpdateInputDto } from './dto/Card.dto';


@Resolver()
export class CardController {
  constructor(private readonly cardService: CardService) { }


  @Query(() => [CardDto])
  async getCards() {
    const data= await this.cardService.getCards()
    console.log("Data=",data)
    return data;
  }

  @Query(()=> CardDto)
  async getCard(
    @Args('id') id:string
  ){
    const data=await this.cardService.getCard(id)
    console.log("get single card=",data)
    return data
  }

  @Mutation(()=>CardDto)
  async createCard(
    @Args('data', { type: () => CardInputDto }) data: CardInputDto,
  ) {
    console.log('createCard resolver incoming args:', {
      cardTitle: data.cardTitle,
      cardDescription: data.cardDescription,
      cardImagePresent: !!data.cardImage,
      cardImageType: data.cardImage ? typeof data.cardImage : 'undefined',
    });

    const response = await this.cardService.createCard(data);
    console.log('createCard resolver response:', response);
    return response;
  }

  @Mutation(()=>CardDto)
  async updateCard(
  @Args('id') id:string,
  @Args('data', { type: () => CardUpdateInputDto }) data:CardUpdateInputDto){
    const response = await this.cardService.updatecard(id,data)
    console.log("response=",response);
    return response;
  }

  @Query(()=>CardDto)
   async DeleteCard(@Args('id') id:string){
    const response=await this.cardService.deleteCard(id);
    return response;
  }
}
