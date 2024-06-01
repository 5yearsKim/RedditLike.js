import { Module } from "@nestjs/common";
import { ChatRoomController } from "./controller";
import { ChatRoomService } from "./service";

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatRoomModule {

}
