import { TG } from "@/utils/type_generator";
import { glob } from "glob";

// import { postSchema } from "@/models/Post/schema";

async function main() {
  const schemaFiles = await glob("./src/models/**/schema.ts");

  for (const schemaFile of schemaFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(schemaFile);
  }
  console.log("gen schema done");

  TG.write();
}

main();