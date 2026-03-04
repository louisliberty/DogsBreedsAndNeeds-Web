const breedImageModules = import.meta.glob<{ default: string }>(
  "../../../attached_assets/breeds/*.png",
  { eager: true }
);

const breedImages: Record<string, string> = {};
for (const [path, mod] of Object.entries(breedImageModules)) {
  const filename = path.split("/").pop() || "";
  const slug = filename.replace(".png", "");
  breedImages[slug] = mod.default;
}

export function getBreedImage(slug: string): string | undefined {
  return breedImages[slug];
}
