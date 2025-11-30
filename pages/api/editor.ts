import { NextApiRequest, NextApiResponse } from "next";
import { Marp } from "@marp-team/marp-core";
import { marpCli } from "@marp-team/marp-cli";
import fs from "fs";
import path from "path";
import os from "os";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
      // Export to standalone HTML using Marp CLI (same as VS Code extension)
      const tempDir = os.tmpdir();
      const tempMdFile = path.join(tempDir, `marp-temp-${Date.now()}.md`);
      const tempHtmlFile = path.join(tempDir, `marp-temp-${Date.now()}.html`);

      try {
        // Write markdown to temp file
        fs.writeFileSync(tempMdFile, markdown || "", "utf-8");

        // Use Marp CLI to convert (this gives the same output as VS Code)
        await marpCli([tempMdFile, "-o", tempHtmlFile, "--html"]);

        // Read the generated HTML
        const generatedHtml = fs.readFileSync(tempHtmlFile, "utf-8");

        // Clean up temp files
        fs.unlinkSync(tempMdFile);
        fs.unlinkSync(tempHtmlFile);

        return res.status(200).json({ html: generatedHtml });
      } catch (err) {
        // Clean up temp files on error
        if (fs.existsSync(tempMdFile)) fs.unlinkSync(tempMdFile);
        if (fs.existsSync(tempHtmlFile)) fs.unlinkSync(tempHtmlFile);
        throw err;
      }
    }

    if (action === "save") {
      // Save markdown file
      if (!fileName || !folder) {
        return res
          .status(400)
          .json({ error: "fileName and folder are required" });
      }

      const contentPath = path.join(process.cwd(), "content");
      let destFolder: string;

      if (isUnreleased) {
        destFolder = path.join(contentPath, "unreleased", folder);
      } else {
        destFolder = path.join(contentPath, folder);
      }

      // Security check
      if (!destFolder.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Create folder if it doesn't exist
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      // Ensure .md extension
      const finalFileName = fileName.endsWith(".md")
        ? fileName
        : `${fileName}.md`;
      const filePath = path.join(destFolder, finalFileName);

      fs.writeFileSync(filePath, markdown, "utf-8");

      return res.status(200).json({
        success: true,
        message: `Saved ${finalFileName} to ${
          isUnreleased ? "unreleased/" : ""
        }${folder}`,
      });
    }

    if (action === "save-html") {
      // Save exported HTML file using Marp CLI (same as VS Code extension)
      if (!fileName) {
        return res.status(400).json({ error: "fileName is required" });
      }

      // folder can be empty string for root-level files
      const folderPath = folder || "";

      const contentPath = path.join(process.cwd(), "content");
      let destFolder: string;

      if (isUnreleased) {
        destFolder = folderPath
          ? path.join(contentPath, "unreleased", folderPath)
          : path.join(contentPath, "unreleased");
      } else {
        destFolder = folderPath
          ? path.join(contentPath, folderPath)
          : contentPath;
      }

      // Security check
      if (!destFolder.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Create folder if it doesn't exist
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      // Ensure .html extension
      const finalFileName = fileName.endsWith(".html")
        ? fileName
        : `${fileName}.html`;
      const outputPath = path.join(destFolder, finalFileName);

      // Use temp file for markdown and convert with Marp CLI
      const tempDir = os.tmpdir();
      const tempMdFile = path.join(tempDir, `marp-save-${Date.now()}.md`);

      try {
        // Write markdown to temp file
        fs.writeFileSync(tempMdFile, markdown || "", "utf-8");

        // Use Marp CLI to convert (this gives the same output as VS Code)
        await marpCli([tempMdFile, "-o", outputPath, "--html"]);

        // Clean up temp file
        fs.unlinkSync(tempMdFile);

        return res.status(200).json({
          success: true,
          message: `Exported ${finalFileName} to ${
            isUnreleased ? "unreleased/" : ""
          }${folderPath || "(root)"}`,
        });
      } catch (err) {
        // Clean up temp file on error
        if (fs.existsSync(tempMdFile)) fs.unlinkSync(tempMdFile);
        throw err;
      }
    }

    if (action === "update") {
      // Update existing file
      const { filePath: reqFilePath, source } = req.body;

      if (!reqFilePath || !source) {
        return res
          .status(400)
          .json({ error: "filePath and source are required" });
      }

      const contentPath = path.join(process.cwd(), "content");
      let fullPath: string;

      if (source === "unreleased") {
        fullPath = path.join(contentPath, "unreleased", reqFilePath);
      } else {
        fullPath = path.join(contentPath, reqFilePath);
      }

      // Security check
      if (!fullPath.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "File not found" });
      }

      fs.writeFileSync(fullPath, markdown, "utf-8");

      return res.status(200).json({
        success: true,
        message: `Updated ${path.basename(reqFilePath)}`,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Editor API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
