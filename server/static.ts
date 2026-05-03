import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getCachedPageData, injectPageData } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use(
    express.static(distPath, {
      maxAge: "30d",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (/\.(png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
        }
      },
    }),
  );

  app.use("/{*path}", async (req, res) => {
    const pageData = await getCachedPageData(req.path);
    if (pageData) {
      res.setHeader("Cache-Control", "public, max-age=600, s-maxage=3600");
      res.send(injectPageData(indexHtml, pageData));
    } else {
      res.send(indexHtml);
    }
  });
}
