import { Module } from "@nestjs/common";
import { XUserCategoryController } from "./controller";
import { XUserCategoryService } from "./service";

@Module({
  controllers: [XUserCategoryController],
  providers: [XUserCategoryService],
})
export class XUserCategoryModule {}
