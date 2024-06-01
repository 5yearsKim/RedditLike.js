
export function sumAscii(str: string): number {
  let sum = 0;
  // For every character
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

