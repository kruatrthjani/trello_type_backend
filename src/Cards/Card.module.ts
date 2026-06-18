import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/Cloudinary/cloudinary.service';
import { CardController } from './Card.controller';
import { CardService } from './Card.service';

@Module({
  imports: [],
  providers: [CardController, CardService, CloudinaryService],
})
export default class CardModule {}
