import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardDto, CardInputDto } from './dto/Card.dto';

@Injectable()
export class CardService {
  constructor(private readonly prismaservice: PrismaService) {}
  getCard() {
    return 'Get The Card';
  }

  createCard(cardInputDto:CardInputDto){
    
    //cardtitle,card description,card status,cardid,
    const data=cardInputDto;
    console.log("cardInputDto=",cardInputDto)

    return cardInputDto;
  }

  updatecard({}){
    //cardcomment,
  }
}


