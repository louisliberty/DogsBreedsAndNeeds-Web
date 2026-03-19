import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getPageData, injectPageData } from "./seo";

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
    const pageData = await getPageData(req.path);
    if (pageData) {
      res.send(injectPageData(indexHtml, pageData));
    } else {
      res.send(indexHtml);
    }
  });
}
