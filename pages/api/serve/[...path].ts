import { NextApiRequest, NextApiResponse } from "next";
import { list } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path: pathSegments } = req.query;

  if (!pathSegments || !Array.isArray(pathSegments)) {
    return res.status(400).send("Invalid path");
  }

  // Block access to unreleased content
  if (pathSegments[0] === "unreleased") {
    return res.status(404).send("Not found");
  }

  const filePath = pathSegments.join("/");

  try {
    // Find the blob
    const { blobs } = await list({ prefix: filePath });
    const blob = blobs.find((b) => b.pathname === filePath);

    if (!blob) {
      return res.status(404).send("File not found");
    }

    // Fetch content from blob URL
    const response = await fetch(blob.url);

    if (!response.ok) {
      return res.status(404).send("File not found");
    }

    const content = await response.text();
    const ext = filePath.split(".").pop()?.toLowerCase() || "";

    // Set content type based on extension
    const contentTypes: Record<string, string> = {
      html: "text/html; charset=utf-8",
      md: "text/markdown; charset=utf-8",
      css: "text/css; charset=utf-8",
      js: "application/javascript; charset=utf-8",
      json: "application/json; charset=utf-8",
      txt: "text/plain; charset=utf-8",
    };

    const contentType = contentTypes[ext] || "text/plain; charset=utf-8";

    // Set headers for inline display (not download)
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );

    res.status(200).send(content);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).send("Error reading file");
  }
}
