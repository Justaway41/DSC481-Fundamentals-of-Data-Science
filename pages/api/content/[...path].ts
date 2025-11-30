import { NextApiRequest, NextApiResponse } from "next";
import { list } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path: pathSegments } = req.query;

  if (!pathSegments || !Array.isArray(pathSegments)) {
    return res.status(400).send("Invalid path");
  }

  // Block access to unreleased content (admin-only)
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

    const content = await response.arrayBuffer();
    const ext = filePath.split(".").pop()?.toLowerCase() || "";

    // Set content type based on extension
    const contentTypes: Record<string, string> = {
      html: "text/html",
      md: "text/markdown",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
    };

    res.setHeader("Content-Type", contentTypes[ext] || "text/plain");
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
    res.send(Buffer.from(content));
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).send("Error reading file");
  }
}
