import { Module } from "@nestjs/common";
import {XBoardCategoryController} from './controller'
import {XBoardCategoryService} from './service'

@Module({
  controllers: [XBoardCategoryController],
  providers: [XBoardCategoryService],
})
export class XBoardCategoryModule {}
