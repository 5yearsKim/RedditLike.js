import { Module } from "@nestjs/common";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
