const breedWebpModules = import.meta.glob<{ default: string }>(
  "../../../attached_assets/breeds/*.webp",
  { eager: true }
);

const breedPngModules = import.meta.glob<{ default: string }>(
  "../../../attached_assets/breeds/*.png",
  { eager: true }
);

const breedImages: Record<string, string> = {};
const breedImagesFallback: Record<string, string> = {};

for (const [filePath, mod] of Object.entries(breedWebpModules)) {
  const filename = filePath.split("/").pop() || "";
  const slug = filename.replace(/\.webp$/i, "");
  breedImages[slug] = mod.default;
}

for (const [filePath, mod] of Object.entries(breedPngModules)) {
  const filename = filePath.split("/").pop() || "";
  const slug = filename.replace(/\.png$/i, "");
  breedImagesFallback[slug] = mod.default;
  if (!breedImages[slug]) {
    breedImages[slug] = mod.default;
  }
}

export function getBreedImage(slug: string): string | undefined {
  return breedImages[slug];
}

export function getBreedImagePng(slug: string): string | undefined {
  return breedImagesFallback[slug];
}
