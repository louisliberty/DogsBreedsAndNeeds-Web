import { readdir, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const breedsDir = path.resolve(process.cwd(), "attached_assets", "breeds");
const QUALITY = 82;
const MAX_WIDTH = 1280;

async function convertAll() {
  const files = await readdir(breedsDir);
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith(".png"));
  console.log(`Found ${pngFiles.length} PNG files in ${breedsDir}`);

  let converted = 0;
  let skipped = 0;
  let totalPngBytes = 0;
  let totalWebpBytes = 0;

  for (const file of pngFiles) {
    const pngPath = path.join(breedsDir, file);
    const base = file.replace(/\.png$/i, "");
    const webpPath = path.join(breedsDir, `${base}.webp`);

    const pngStat = await stat(pngPath);
    totalPngBytes += pngStat.size;

    let needsConvert = true;
    try {
      const webpStat = await stat(webpPath);
      if (webpStat.mtimeMs >= pngStat.mtimeMs) {
        needsConvert = false;
        totalWebpBytes += webpStat.size;
        skipped++;
      }
    } catch {
      // doesn't exist
    }

    if (needsConvert) {
      const img = sharp(pngPath).rotate();
      const meta = await img.metadata();
      const pipeline = (meta.width && meta.width > MAX_WIDTH)
        ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
        : img;
      await pipeline.webp({ quality: QUALITY, effort: 5 }).toFile(webpPath);
      const webpStat = await stat(webpPath);
      totalWebpBytes += webpStat.size;
      converted++;
      if (converted % 25 === 0) {
        console.log(`  ${converted} converted...`);
      }
    }
  }

  const mb = (n: number) => (n / 1024 / 1024).toFixed(2);
  console.log(`\nDone. Converted ${converted}, skipped ${skipped}.`);
  console.log(`PNG total:  ${mb(totalPngBytes)} MB`);
  console.log(`WebP total: ${mb(totalWebpBytes)} MB`);
  console.log(`Savings:    ${mb(totalPngBytes - totalWebpBytes)} MB (${((1 - totalWebpBytes / totalPngBytes) * 100).toFixed(1)}%)`);
}

convertAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
