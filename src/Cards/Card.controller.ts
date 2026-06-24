import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CardService } from './Card.service';
import { Query } from '@nestjs/graphql';
import { CardDto, CardInputDto, CardUpdateInputDto } from './dto/Card.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { StatusType } from '@prisma/client';


@Resolver()
@UseGuards(RolesGuard)
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Query(() => [CardDto])
  async getCards() {
    const data = await this.cardService.getCards()
    return data;
  }

  @Query(() => CardDto)
  async getCard(
    @Args('id') id: string
  ) {
    const data = await this.cardService.getCard(id)
    return data
  }

  @Roles('CLIENT', 'MANAGER')
  @Mutation(() => CardDto)
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
    return response;
  }

  @Roles('CLIENT', 'MANAGER')
  @Mutation(() => CardDto)
  async updateCard(
    @Args('id') id: string,
    @Args('data', { type: () => CardUpdateInputDto }) data: CardUpdateInputDto) {
    const response = await this.cardService.updatecard(id, data)
    return response;
  }

  @Roles('CLIENT', 'MANAGER')
  @Mutation(() => CardDto)
  async updateCardStatus(
    @Args('id') id: string,
    @Args('status', { type: () => StatusType }) status:StatusType ) {
    const response = await this.cardService.updateCardStatus(id, status)
    return response;
  }

  @Roles('CLIENT')
  @Query(() => CardDto)
  async DeleteCard(@Args('id') id: string) {
    const response = await this.cardService.deleteCard(id);
    return response;
  }
}
