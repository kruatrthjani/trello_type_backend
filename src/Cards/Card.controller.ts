import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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
    @Args('id') id: string,
    @Context() context
  ) {
    const userId = context.req.user?.sub;
    const data = await this.cardService.getCard(id, userId);
    return data;
  }

  @Roles('CLIENT', 'MANAGER')
  @Mutation(() => CardDto)
  async createCard(
    @Args('data', { type: () => CardInputDto }) data: CardInputDto,
  ) {
    const response = await this.cardService.createCard(data);
    return response;
  }

  @Roles('CLIENT', 'MANAGER')
  @Mutation(() => CardDto)
  async updateCard(
    @Args('id') id: string,
    @Args('data', { type: () => CardUpdateInputDto }) data: CardUpdateInputDto,@Context() context) {
    const userId = context.req.user?.sub;
    const response = await this.cardService.updatecard(id, data,userId)
    return response;
  }

  
  @Mutation(() => CardDto)
  async updateCardStatus(
    @Args('id') id: string,
    @Args('status', { type: () => StatusType }) status:StatusType,
    @Context() context ) {
    const userId = context.req.user?.sub;
    const response = await this.cardService.updateCardStatus(id, userId,status)
    return response;
  }

  @Roles('CLIENT')
  @Query(() => CardDto)
  async DeleteCard(@Args('id') id: string,@Context() context) {
    const userId=context.req.user?.sub;
    const response = await this.cardService.deleteCard(id,userId);
    return response;
  }
}
