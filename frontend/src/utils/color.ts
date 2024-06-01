import tinycolor from "tinycolor2";

export function ensureVisible(color: string, mode:"dark"|"light"): string {
  const tColor = tinycolor(color);
  const brightness = tColor.getBrightness();

  if (mode === "dark") {
    const threshold = 110;
    if (brightness < threshold) {
      const amount = 100 * (threshold - brightness) / 255;
      tColor.brighten(amount);
    }
  } else {
    const threshold = 200;
    if (brightness > threshold) {
      const amount = 100 * (brightness - threshold) / 255;
      tColor.darken(amount);
    }
  }

  return tColor.toHexString();
}