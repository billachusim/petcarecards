/** Reads an image file and returns a compressed, resized data URL (max 800px). */
export async function compressImageFile(file: File, maxSize = 800): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file isn't an image. Please choose a photo.");
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("That photo is too large. Please choose one under 20 MB.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We couldn't read that photo. Please try another."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("We couldn't open that photo. Please try another."));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}
