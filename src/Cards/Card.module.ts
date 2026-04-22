import { Module } from '@nestjs/common';
import { CardService } from './Card.service';
import { CardController } from './Card.controller';

@Module({
  imports: [],
  providers: [CardController, CardService],
  // exports:[CardService],
})
export default class CardModule {}
