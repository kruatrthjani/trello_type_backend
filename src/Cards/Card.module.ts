import { Module } from "@nestjs/common";
import { CardService } from "./Card.service";



@Module({
    imports:[],
    exports:[CardService]
})

export default class CardModule{}