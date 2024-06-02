import { Module, type MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ZodValidationPipe } from "nestjs-zod";
import { APP_PIPE } from "@nestjs/core";

// api modules
import { AdminModule } from "./apis/Admin/module";
import { AuthModule } from "./apis/Auth/module";
import { BoardModule } from "./apis/Board/module";
import { BoardBlockModule } from "./apis/BoardBlock/module";
import { BoardFollowerModule } from "./apis/BoardFollower/module";
import { BoardManagerModule } from "./apis/BoardManager/module";
import { BoardMuterModule } from "./apis/BoardMuter/module";
import { BoardRuleModule } from "./apis/BoardRule/module";
import { BoardUserModule } from "./apis/BoardUser/module";
import { BoardUserBlockModule } from "./apis/BoardUserBlock/module";
import { CategoryModule } from "./apis/Category/module";
import { ChatMessageModule } from "./apis/ChatMessage/module";
import { ChatRoomModule } from "./apis/ChatRoom/module";
import { CommentModule } from "./apis/Comment/module";
import { CommentManagingLogModule } from "./apis/CommentManagingLog/module";
import { CommentReportModule } from "./apis/CommentReport/module";
import { CommentVoteModule } from "./apis/CommentVote/module";
import { EmailVerificationModule } from "./apis/EmailVerification/module";
import { FlagModule } from "./apis/Flag/module";
import { FlairModule } from "./apis/Flair/module";
import { FlairBoxModule } from "./apis/FlairBox/module";
import { MediaModule } from "./apis/medias/module";
import { MuterModule } from "./apis/Muter/module";
import { NotificationModule } from "./apis/Notification/module";
import { PollModule } from "./apis/Poll/module";
import { PollCandModule } from "./apis/PollCand/module";
import { PollVoteModule } from "./apis/PollVote/module";
import { PostModule } from "./apis/Post/module";
import { PostBookmarkModule } from "./apis/PostBookmark/module";
import { PostCheckModule } from "./apis/PostCheck/module";
import { PostManagingLogModule } from "./apis/PostManagingLog/module";
import { PostPinModule } from "./apis/PostPin/module";
import { PostReportModule } from "./apis/PostReport/module";
import { PostVoteModule } from "./apis/PostVote/module";
import { UrlInfoModule } from "@/apis/UrlInfo/module";
import { UserModule } from "./apis/User/module";
import { XPostFlagModule } from "./apis/XPostFlag/module";
import { XBoardCategoryModule } from "./apis/XBoardCategory/module";
import { XBoardUserFlairModule } from "./apis/XBoardUserFlair/module";
import { XUserCategoryModule } from "./apis/XUserCategory/module";

// middlewares
import { DecodeUser } from "@/apis/$middlewares/decode_user";

@Module({
  imports: [
    AdminModule,
    AuthModule,
    BoardModule,
    BoardBlockModule,
    BoardFollowerModule,
    BoardManagerModule,
    BoardMuterModule,
    BoardRuleModule,
    BoardUserModule,
    BoardUserBlockModule,
    CategoryModule,
    ChatMessageModule,
    ChatRoomModule,
    CommentModule,
    CommentManagingLogModule,
    CommentReportModule,
    CommentVoteModule,
    EmailVerificationModule,
    FlagModule,
    FlairModule,
    FlairBoxModule,
    MediaModule,
    MuterModule,
    NotificationModule,
    PollModule,
    PollCandModule,
    PollVoteModule,
    PostModule,
    PostBookmarkModule,
    PostManagingLogModule,
    PostCheckModule,
    PostPinModule,
    PostReportModule,
    PostVoteModule,
    UrlInfoModule,
    UserModule,
    XPostFlagModule,
    XBoardCategoryModule,
    XBoardUserFlairModule,
    XUserCategoryModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecodeUser)
      .forRoutes("*");
  }
}
