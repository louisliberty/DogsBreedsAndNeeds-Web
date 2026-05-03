const webpModules = import.meta.glob<{ default: string }>(
  "../../../attached_assets/breeds/*.webp",
  { eager: true }
);
const pngModules = import.meta.glob<{ default: string }>(
  "../../../attached_assets/breeds/*.png",
  { eager: true }
);

const breedImages: Record<string, string> = {};
const breedImagesPng: Record<string, string> = {};

for (const [path, mod] of Object.entries(webpModules)) {
  const filename = path.split("/").pop() || "";
  const slug = filename.replace(/\.webp$/i, "");
  breedImages[slug] = mod.default;
}
for (const [path, mod] of Object.entries(pngModules)) {
  const filename = path.split("/").pop() || "";
  const slug = filename.replace(/\.png$/i, "");
  breedImagesPng[slug] = mod.default;
  if (!breedImages[slug]) breedImages[slug] = mod.default;
}

export function getBreedImage(slug: string): string | undefined {
  return breedImages[slug];
}

export function getBreedImagePng(slug: string): string | undefined {
  return breedImagesPng[slug];
}
