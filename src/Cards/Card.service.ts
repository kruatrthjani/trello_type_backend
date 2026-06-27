import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, StatusType, roleType } from '@prisma/client';
import { CloudinaryService } from 'src/Cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardInputDto, CardUpdateInputDto } from './dto/Card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async hasPermission(id:string,userId?:string){
      const cardData= await this.prismaservice.card.findUnique({where:{cardId:id}})
      if(!cardData ||!cardData.cardTitle){
          throw new NotFoundException("No card exist")
      }

      const boardMembers = await this.prismaservice.boardMember.findMany({where:{boardId:cardData.boardId}})
      if(boardMembers.length<1){
        throw new NotFoundException("No user found as board member");
      }
      const findUser= boardMembers.find((data)=>data.userId==userId)
      
      if(!findUser){
          throw new UnauthorizedException("Current user dont have access to this board");
      }

      const data = await this.prismaservice.user.findUnique({where:{id:userId}})

      return data;
  }

  async getCard(id: string, userId?: string | { sub?: string }) {
    const normalizedUserId = typeof userId === 'string' ? userId : userId?.sub;
    const response = await this.hasPermission(id, normalizedUserId);
    if (!response) {
      throw new UnauthorizedException('Access denied to user');
    }
    const data = await this.prismaservice.card.findUnique({
      where: {
        cardId: id,
      },
    });

    if (!data) {
      throw new NotFoundException('No card exists with this id');
    }
    return data;
  }

  async getCards() {
    const cards = await this.prismaservice.card.findMany();

    if (cards.length === 0) {
      throw new NotFoundException('Cards not found');
    }

    return cards;
  }
   
  async createCard(cardInputDto: CardInputDto) {
    let imageUrl: string | undefined;
    
    if (cardInputDto.cardImage) {
      const file = await cardInputDto.cardImage;
      
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

   const findBoardId= await this.prismaservice.boards.findUnique({where:{boardId:cardInputDto.boardId}})
   if(!findBoardId){
      throw new NotFoundException("No relevent boardId found")
   }
    return this.prismaservice.card.create({
      data: {
        cardTitle: cardInputDto.cardTitle,
        cardDescription: cardInputDto.cardDescription,
        cardImage: imageUrl,
        status: StatusType.PENDING,
        boardId:cardInputDto.boardId,
      },
    });
  }

  async updatecard(id: string, data: CardUpdateInputDto,userId:string) {
    await this.getCard(id);
    const user = await this.hasPermission(id,userId);
    if(!user){
        throw new NotFoundException("No user found")
    }

    
    const updateData: Prisma.CardUpdateInput = {};

    if (data.cardTitle !== undefined) {
      updateData.cardTitle = data.cardTitle;
    }

    if (data.cardDescription !== undefined) {
      updateData.cardDescription = data.cardDescription;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.cardImage) {
      const file = await data.cardImage;
      updateData.cardImage = await this.cloudinaryService.uploadImage(file);
    }

    return this.prismaservice.card.update({
      where: {
        cardId: id,
      },
      data: updateData,
    });
  }

  
  async updateCardStatus(id: string, userId: string, status: StatusType) {
    const data = await this.hasPermission(id, userId);
 
    if (!data) {
      throw new NotFoundException('User not found');
    }
    if (data.role !== roleType.CLIENT && status === StatusType.DONE) {
      throw new ForbiddenException('No access for this status');
    }
    return this.prismaservice.card.update({
      where: {
        cardId: id,
      },
      data:{
         status: status,
      }
    });
  }

  async deleteCard(id: string,userId:string) {
    const user = await this.hasPermission(id,userId);
    if(!user){
      throw new NotFoundException("No user found")
    }
    await this.getCard(id);
    return this.prismaservice.card.delete({ where: { cardId: id } });
  }
}

