export function replaceItem<ObjT>(listData: ObjT[], toReplace: ObjT, on: (data: ObjT) => boolean): ObjT[] {
  const idx = listData.findIndex(on);
  if (idx < 0) {
    return listData;
  }
  const newData = [...listData];
  newData.splice(idx, 1, toReplace);
  return newData;
}


export function checkUrl(url: string): boolean {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}

export function countChar(text: string): number {
  const byteSize = (str: string): number => new Blob([str]).size;

  let cnt = 0;
  for (const char of text) {
    const charSize = byteSize(char);
    if (charSize >= 2) {
      cnt += 2;
      // }
      //  else if (char.match(/^[A-Z]+$/)) {
      //   cnt += 2;
    } else {
      cnt += 1;
    }
  }
  return cnt;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
