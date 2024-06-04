import { Module } from "@nestjs/common";
import { AdminController } from "./controller";
import { AdminService } from "./service";

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
