import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StatusType } from '@prisma/client';
import { CloudinaryService } from 'src/Cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardInputDto, CardUpdateInputDto } from './dto/Card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getCard(id: string) {
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

    console.log('createCard service received cardInputDto:', {
      cardTitle: cardInputDto.cardTitle,
      cardDescription: cardInputDto.cardDescription,
      cardImagePresent: !!cardInputDto.cardImage,
      cardImageType: cardInputDto.cardImage ? typeof cardInputDto.cardImage : 'undefined',
    });

    if (cardInputDto.cardImage) {
      console.log('createCard service awaiting cardImage promise');
      const file = await cardInputDto.cardImage;
      console.log('createCard service received file upload:', {
        filename: file.filename,
        mimetype: file.mimetype,
        encoding: file.encoding,
      });
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

   

    return this.prismaservice.card.create({
      data: {
        cardTitle: cardInputDto.cardTitle,
        cardDescription: cardInputDto.cardDescription,
        cardImage: imageUrl,
        status: StatusType.PENDING,
      },
    });
  }

  async updatecard(id: string, data: CardUpdateInputDto) {
    await this.getCard(id);

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

  
  async updateCardStatus(id: string, status:StatusType) {
    await this.getCard(id);
    
    return this.prismaservice.card.update({
      where: {
        cardId: id,
      },
      data:{
         status: status,
      }
    });
  }

  async deleteCard(id: string) {
    await this.getCard(id);

    return this.prismaservice.card.delete({ where: { cardId: id } });
  }
}

