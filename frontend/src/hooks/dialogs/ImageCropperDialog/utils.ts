export async function getFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], url, {
    type: data.type,
  });
}
