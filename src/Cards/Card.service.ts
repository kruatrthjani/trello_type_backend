import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  CardInputDto, CardUpdateInputDto } from './dto/Card.dto';
import { StatusType } from '@prisma/client';

@Injectable()
export class CardService {
  constructor(private readonly prismaservice: PrismaService) {}
  async getCard(id:string) {
    const data = await this.prismaservice.card.findUnique({where:{
      cardId:id
    }})
    if(!data){
      throw new NotFoundException("No card exist with this id")
    }
    console.log("data=",data);
    return data;
  }

  async getCards(){
    const cards=await this.prismaservice.card.findMany();
    if(cards.length===0){
      throw new NotFoundException("Cards not Found")
    }
    return cards;
  }

  async createCard(cardInputDto: CardInputDto) {
    console.log("cardInput dto=",cardInputDto)
    const card = await this.prismaservice.card.create({
      data: {
        cardTitle: cardInputDto.cardTitle,
        cardDescription: cardInputDto.cardDescription,
        cardImage: cardInputDto?.cardImage,
        status:StatusType.PENDING
      },
    });

    return card;
  }

  async updatecard(id:string,data:CardUpdateInputDto){
    await this.getCard(id)


    const updateCard=await this.prismaservice.card.update({
       where:{
        cardId:id
      },
      data,
    })
  
  return updateCard;
  }

  async deleteCard(id:string){
    await this.getCard(id)

    const deleteResponse=await this.prismaservice.card.delete({where:{cardId:id}})
    return deleteResponse
  }
  
}


