import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getPageMeta, injectMeta } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use(express.static(distPath));

  app.use("/{*path}", async (req, res) => {
    const meta = await getPageMeta(req.path);
    if (meta) {
      res.send(injectMeta(indexHtml, meta));
    } else {
      res.send(indexHtml);
    }
  });
}
