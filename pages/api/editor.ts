import { NextApiRequest, NextApiResponse } from "next";
import { Marp } from "@marp-team/marp-core";
import { put, list, del } from "@vercel/blob";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, action, markdown, fileName, folder, isUnreleased } =
    req.body;

  // Check password
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (action === "preview") {
      // Render Marp markdown to HTML for preview (quick preview, not full bespoke)
      const marp = new Marp({
        html: true,
        math: true,
      });
      const { html, css } = marp.render(markdown || "");

      // Combine HTML with CSS for standalone preview
      const fullHtml = `
        <style>${css}</style>
        ${html}
      `;

      return res.status(200).json({ html: fullHtml });
    }

    if (action === "export") {
      // Export to standalone HTML using Marp Core (serverless-compatible)
      const marp = new Marp({
        html: true,
        math: true,
      });
      const { html, css } = marp.render(markdown || "");

      // Create a standalone HTML document similar to Marp CLI output
      const generatedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marp Presentation</title>
  <style>
    ${css}
    /* Additional styles for presentation */
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    .marpit {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    section {
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

      return res.status(200).json({ html: generatedHtml });
    }

    if (action === "save") {
      // Save markdown file to Vercel Blob
      if (!fileName || !folder) {
        return res
          .status(400)
          .json({ error: "fileName and folder are required" });
      }

      // Ensure .md extension
      const finalFileName = fileName.endsWith(".md")
        ? fileName
        : `${fileName}.md`;

      // Build blob path
      let blobPath: string;
      if (isUnreleased) {
        blobPath = `unreleased/${folder}/${finalFileName}`;
      } else {
        blobPath = `${folder}/${finalFileName}`;
      }

      // Check if file already exists and delete it first (to overwrite)
      const { blobs } = await list({ prefix: blobPath });
      const existingBlob = blobs.find((b) => b.pathname === blobPath);
      if (existingBlob) {
        await del(existingBlob.url);
      }

      // Upload to Vercel Blob
      await put(blobPath, markdown || "", {
        access: "public",
        addRandomSuffix: false,
      });

      return res.status(200).json({
        success: true,
        message: `Saved ${finalFileName} to ${
          isUnreleased ? "unreleased/" : ""
        }${folder}`,
      });
    }

    if (action === "save-html") {
      // Save exported HTML file to Vercel Blob
      if (!fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }

      // folder can be empty string for root-level files
      const folderPath = folder || "";

      // Ensure .html extension
      const finalFileName = fileName.endsWith(".html")
        ? fileName
        : `${fileName}.html`;

      // Build blob path
      let blobPath: string;
      if (isUnreleased) {
        blobPath = folderPath
          ? `unreleased/${folderPath}/${finalFileName}`
          : `unreleased/${finalFileName}`;
      } else {
        blobPath = folderPath
          ? `${folderPath}/${finalFileName}`
          : finalFileName;
      }

      // Generate HTML using Marp Core
      const marp = new Marp({
        html: true,
        math: true,
      });
      const { html, css } = marp.render(markdown || "");

      // Create a standalone HTML document
      const generatedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Marp Presentation</title>
  <style>
    ${css}
    /* Additional styles for presentation */
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    .marpit {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    section {
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

      // Check if file already exists and delete it first (to overwrite)
      const { blobs } = await list({ prefix: blobPath });
      const existingBlob = blobs.find((b) => b.pathname === blobPath);
      if (existingBlob) {
        await del(existingBlob.url);
      }

      // Upload to Vercel Blob
      await put(blobPath, generatedHtml, {
        access: "public",
        addRandomSuffix: false,
        contentType: "text/html; charset=utf-8",
      });

      return res.status(200).json({
        success: true,
        message: `Exported ${finalFileName} to ${
          isUnreleased ? "unreleased/" : ""
        }${folderPath || "(root)"}`,
      });
    }

    if (action === "update") {
      // Update existing file in Vercel Blob
      const { filePath: reqFilePath, source } = req.body;

      if (!reqFilePath || !source) {
        return res
          .status(400)
          .json({ error: "filePath and source are required" });
      }

      // Build blob path - reqFilePath already contains the relative path
      let blobPath: string;
      if (source === "unreleased") {
        // Check if reqFilePath already starts with unreleased/
        blobPath = reqFilePath.startsWith("unreleased/")
          ? reqFilePath
          : `unreleased/${reqFilePath}`;
      } else {
        blobPath = reqFilePath;
      }

      // Check if file exists
      const { blobs } = await list({ prefix: blobPath });
      const existingBlob = blobs.find((b) => b.pathname === blobPath);

      if (!existingBlob) {
        return res.status(404).json({ error: "File not found" });
      }

      // Delete old blob and upload new content
      await del(existingBlob.url);

      // Determine content type based on extension
      const isHtml = blobPath.endsWith(".html");

      await put(blobPath, markdown || "", {
        access: "public",
        addRandomSuffix: false,
        contentType: isHtml
          ? "text/html; charset=utf-8"
          : "text/markdown; charset=utf-8",
      });

      const baseName = blobPath.split("/").pop() || blobPath;
      return res.status(200).json({
        success: true,
        message: `Updated ${baseName}`,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Editor API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
