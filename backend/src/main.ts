import { NestFactory, HttpAdapterHost, } from "@nestjs/core";

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";


import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./apis/$tools/exception_filter";
import { env } from "@/env";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // error handling
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.use(cookieParser());


  // api builder
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle("RedditLike.js api docs")
    .setDescription("RedditLike.js API description")
    .setVersion("1.0")
    .addTag("RedditLike.js")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);


  await app.listen(env.MAIN_PORT, () => {
    console.log(`Server is running on http://localhost:${env.MAIN_PORT}`);
  });
}

bootstrap();
