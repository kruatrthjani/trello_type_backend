import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardService {
  constructor(private readonly prismaservice: PrismaService) {}
  getCard() {
    return 'Get The Card';
  }
}
