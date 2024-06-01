
import { ZodType } from "zod";
import * as path from "path";
import { zodToTs, printNode } from "zod-to-ts";
import * as fs from "fs";

const COMMENT = "// @type-gen remain";


class EmptyTypeGenerator {
  constructor() {}
  // eslint-disable-next-line
  add(fileKey: string, alias: string, obj: ZodType) {}
  write() {}
}

type CodeSnippetOptionT = {
  private?: boolean
}

class TypeGenerator implements EmptyTypeGenerator {
  private aliasToPath: (alias: string) => string;
  private typeMap: Map<string, string[]>;
  constructor(aliasToPath: (alias: string) => string) {
    this.aliasToPath = aliasToPath;
    this.typeMap = new Map();
  }

  private genCodeSnippet(alias: string, obj: ZodType, opt: CodeSnippetOptionT): string {
    const { node } = zodToTs(obj);
    let snippet = `type ${alias} = ${printNode(node)}\n`;
    if (!opt.private) {
      snippet = "export " + snippet;
    }
    return snippet;
  }

  add(fileKey: string, alias: string, obj: ZodType, opt: CodeSnippetOptionT = {}): void {
    if (!this.typeMap.has(fileKey)) {
      this.typeMap.set(fileKey, []);
    }
    const codeSnippet = this.genCodeSnippet(alias, obj, opt);
    this.typeMap.get(fileKey)?.push(codeSnippet);
  }

  private getRemainSnippet(path: string): string|null {
    const exist = fs.existsSync(path);
    if (!exist) {
      return null;
    }
    const data = fs.readFileSync(path, "utf-8");
    const remainIdx = data.indexOf(COMMENT);
    if (remainIdx == -1) {
      return null;
    }
    const remain = data.slice(remainIdx + COMMENT.length);
    return remain.trim();
  }

  write() {
    for (const [fileKey, typeAliasList] of this.typeMap.entries()) {
      const filePath = this.aliasToPath(fileKey);

      const remain = this.getRemainSnippet(filePath);
      const codes = [];
      for (const typeAlias of typeAliasList) {
        codes.push(typeAlias);
      }
      if (remain) {
        codes.push("", COMMENT, remain);
      }

      fs.writeFileSync(filePath, codes.join("\n"));
    }
  }
}

function aliasToPath(alias: string) {
  return path.join("./src/types", `${alias}.ts`);
}

export const TG = process.env.TYPE_GEN == "ts"
  ? new TypeGenerator(aliasToPath)
  : new EmptyTypeGenerator();