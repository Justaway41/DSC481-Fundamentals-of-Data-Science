import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: pathSegments } = req.query;

  if (!pathSegments || !Array.isArray(pathSegments)) {
    return res.status(400).send("Invalid path");
  }

  // Block access to unreleased content (admin-only)
  if (pathSegments[0] === "unreleased") {
    return res.status(404).send("Not found");
  }

  const filePath = path.join(process.cwd(), "content", ...pathSegments);

  // Security: ensure the path is within content directory
  const contentDir = path.join(process.cwd(), "content");
  if (!filePath.startsWith(contentDir)) {
    return res.status(403).send("Forbidden");
  }

  // Double-check: block any path that resolves to unreleased folder
  const unreleasedDir = path.join(contentDir, "unreleased");
  if (filePath.startsWith(unreleasedDir)) {
    return res.status(404).send("Not found");
  }

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Set content type based on extension
    const contentTypes: Record<string, string> = {
      ".html": "text/html",
      ".md": "text/markdown",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    res.setHeader("Content-Type", contentTypes[ext] || "text/plain");
    res.send(content);
  } catch (error) {
    res.status(500).send("Error reading file");
  }
}
