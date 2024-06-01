import { Module } from "@nestjs/common";
import { ChatMessageController } from "./controller";
import { ChatMessageService } from "./service";

@Module({
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
})
export class ChatMessageModule {}
