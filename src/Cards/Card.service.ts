import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardDto } from './dto/Card.dto';

@Injectable()
export class CardService {
  constructor(private readonly prismaservice: PrismaService) {}
  getCard() {
    return 'Get The Card';
  }

  createCard(cardDto:CardDto){
    console.log("cardfro=",cardDto)
    //cardtitle,card description,card status,cardid,
    

    return cardDto;
  }

  updatecard({}){
    //cardcomment,
  }
}


