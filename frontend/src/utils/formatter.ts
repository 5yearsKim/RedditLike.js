export function toId(val: any): idT {
  try {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      return 0;
    }
    return parsed;
  } catch {
    return 0;
  }
}


export function shortenNumber(num: number, { locale }: {locale: string}): string {
  let units: { scale: number; unit: string }[] = [];
  if (locale == "ko") {
    units = [
      { scale: 1000, unit: "천" },
      { scale: 10000, unit: "만" },
      { scale: 10000, unit: "만" },
      { scale: 10000 * 100, unit: "백만" },
      { scale: 10000 * 1000, unit: "천만" },
      { scale: 10000 * 10000, unit: "억" },
    ];
  } else {
    units = [
      { scale: 1000, unit: "K" },
      { scale: 1000000, unit: "M" },
      { scale: 1000000000, unit: "B" },
    ];
  }

  num = Math.round(num);

  for (let i = units.length - 1; i >= 0; i--) {
    const { scale, unit } = units[i];
    if (num > scale) {
      const sn = num / scale;
      if (sn < 10) {
        return `${sn.toFixed(1)}${unit}`;
      } else {
        return `${Math.round(sn).toLocaleString()}${unit}`;
      }
    }
  }


  return num.toLocaleString();
}
