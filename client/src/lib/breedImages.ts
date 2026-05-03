const breedWebpFiles = import.meta.glob("../../../attached_assets/breeds/*.webp");
const breedPngFiles = import.meta.glob("../../../attached_assets/breeds/*.png");

const slugsWithWebp = new Set<string>();
const slugsWithPng = new Set<string>();

for (const filePath of Object.keys(breedWebpFiles)) {
  const filename = filePath.split("/").pop() || "";
  slugsWithWebp.add(filename.replace(/\.webp$/i, ""));
}
for (const filePath of Object.keys(breedPngFiles)) {
  const filename = filePath.split("/").pop() || "";
  slugsWithPng.add(filename.replace(/\.png$/i, ""));
}

export function getBreedImage(slug: string): string | undefined {
  if (slugsWithWebp.has(slug)) return `/breeds/${slug}.webp`;
  if (slugsWithPng.has(slug)) return `/breeds/${slug}.png`;
  return undefined;
}

export function getBreedImagePng(slug: string): string | undefined {
  if (slugsWithPng.has(slug)) return `/breeds/${slug}.png`;
  return undefined;
}
