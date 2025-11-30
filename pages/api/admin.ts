import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Simple password protection - in production, use proper auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

interface FileItem {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileItem[];
}

// Helper to get files recursively
const getFilesRecursively = (dir: string, basePath = ""): FileItem[] => {
  const items: FileItem[] = [];

  if (!fs.existsSync(dir)) {
    return items;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      items.push({
        name: entry.name,
        type: "folder",
        path: relativePath,
        children: getFilesRecursively(fullPath, relativePath),
      });
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".html")) {
      items.push({
        name: entry.name,
        type: "file",
        path: relativePath,
      });
    }
  }

  return items;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { password, action, filePath: reqFilePath, destination } = req.query;

  // Check password
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const contentPath = path.join(process.cwd(), "content");
  const unreleasedPath = path.join(contentPath, "unreleased");

  try {
    // List unreleased files
    if (action === "list-unreleased") {
      const files = getFilesRecursively(unreleasedPath);
      return res.status(200).json({ files });
    }

    // List published files (excluding unreleased folder)
    if (action === "list-published") {
      const items: FileItem[] = [];
      const entries = fs.readdirSync(contentPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== "unreleased") {
          const unitPath = path.join(contentPath, entry.name);
          items.push({
            name: entry.name,
            type: "folder",
            path: entry.name,
            children: getFilesRecursively(unitPath, entry.name),
          });
        }
      }

      return res.status(200).json({ files: items });
    }

    // Read a file (from either location)
    if (action === "read" && reqFilePath) {
      const source = req.query.source as string;
      const basePath = source === "published" ? contentPath : unreleasedPath;
      const filePath = path.join(basePath, reqFilePath as string);

      // Security check
      if (!filePath.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const content = fs.readFileSync(filePath, "utf-8");
      return res
        .status(200)
        .json({ content, fileName: path.basename(filePath) });
    }

    // Move file from unreleased to published
    if (action === "publish" && reqFilePath && destination) {
      const sourcePath = path.join(unreleasedPath, reqFilePath as string);
      const destFolder = path.join(contentPath, destination as string);
      const destPath = path.join(
        destFolder,
        path.basename(reqFilePath as string)
      );

      // Security checks
      if (
        !sourcePath.startsWith(unreleasedPath) ||
        !destPath.startsWith(contentPath)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Source file not found" });
      }

      // Create destination folder if it doesn't exist
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      // Move the file
      fs.renameSync(sourcePath, destPath);

      // Clean up empty parent folders in unreleased
      const parentDir = path.dirname(sourcePath);
      if (parentDir !== unreleasedPath && fs.existsSync(parentDir)) {
        const remaining = fs.readdirSync(parentDir);
        if (remaining.length === 0) {
          fs.rmdirSync(parentDir);
        }
      }

      return res
        .status(200)
        .json({ success: true, message: "File published successfully" });
    }

    // Move file from published to unreleased
    if (action === "unpublish" && reqFilePath && destination) {
      const sourcePath = path.join(contentPath, reqFilePath as string);
      const destFolder = path.join(unreleasedPath, destination as string);
      const destPath = path.join(
        destFolder,
        path.basename(reqFilePath as string)
      );

      // Security checks
      if (
        !sourcePath.startsWith(contentPath) ||
        sourcePath.startsWith(unreleasedPath)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Source file not found" });
      }

      // Create destination folder if it doesn't exist
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }

      // Move the file
      fs.renameSync(sourcePath, destPath);

      // Clean up empty parent folders in published
      const parentDir = path.dirname(sourcePath);
      const remaining = fs.readdirSync(parentDir);
      // Only remove if folder is empty and not a top-level unit folder
      if (remaining.length === 0 && path.dirname(parentDir) !== contentPath) {
        fs.rmdirSync(parentDir);
      }

      return res
        .status(200)
        .json({ success: true, message: "File unpublished successfully" });
    }

    // Get list of available destination folders
    if (action === "list-folders") {
      const source = req.query.source as string;
      const folders: string[] = [];

      if (source === "unreleased") {
        // List published unit folders as destinations
        const entries = fs.readdirSync(contentPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && entry.name !== "unreleased") {
            folders.push(entry.name);
          }
        }
      } else {
        // List unreleased folders as destinations
        if (fs.existsSync(unreleasedPath)) {
          const entries = fs.readdirSync(unreleasedPath, {
            withFileTypes: true,
          });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              folders.push(entry.name);
            }
          }
        }
      }

      return res.status(200).json({ folders });
    }

    // Move entire folder from unreleased to published
    if (action === "publish-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const sourcePath = path.join(unreleasedPath, folderName);
      const destPath = path.join(contentPath, folderName);

      // Security checks
      if (!sourcePath.startsWith(unreleasedPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Folder not found" });
      }

      if (!fs.statSync(sourcePath).isDirectory()) {
        return res.status(400).json({ error: "Not a folder" });
      }

      // If destination exists, merge contents
      if (fs.existsSync(destPath)) {
        // Move all files from source to dest
        const moveRecursively = (src: string, dest: string) => {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          const entries = fs.readdirSync(src, { withFileTypes: true });
          for (const entry of entries) {
            const srcItem = path.join(src, entry.name);
            const destItem = path.join(dest, entry.name);
            if (entry.isDirectory()) {
              moveRecursively(srcItem, destItem);
            } else {
              fs.renameSync(srcItem, destItem);
            }
          }
          // Remove empty source directory
          const remaining = fs.readdirSync(src);
          if (remaining.length === 0) {
            fs.rmdirSync(src);
          }
        };
        moveRecursively(sourcePath, destPath);
      } else {
        // Simply rename/move the folder
        fs.renameSync(sourcePath, destPath);
      }

      return res
        .status(200)
        .json({
          success: true,
          message: `Folder "${folderName}" published successfully`,
        });
    }

    // Move entire folder from published to unreleased
    if (action === "unpublish-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const sourcePath = path.join(contentPath, folderName);
      const destPath = path.join(unreleasedPath, folderName);

      // Security checks
      if (
        !sourcePath.startsWith(contentPath) ||
        sourcePath.startsWith(unreleasedPath)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: "Folder not found" });
      }

      if (!fs.statSync(sourcePath).isDirectory()) {
        return res.status(400).json({ error: "Not a folder" });
      }

      // If destination exists, merge contents
      if (fs.existsSync(destPath)) {
        const moveRecursively = (src: string, dest: string) => {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          const entries = fs.readdirSync(src, { withFileTypes: true });
          for (const entry of entries) {
            const srcItem = path.join(src, entry.name);
            const destItem = path.join(dest, entry.name);
            if (entry.isDirectory()) {
              moveRecursively(srcItem, destItem);
            } else {
              fs.renameSync(srcItem, destItem);
            }
          }
          const remaining = fs.readdirSync(src);
          if (remaining.length === 0) {
            fs.rmdirSync(src);
          }
        };
        moveRecursively(sourcePath, destPath);
      } else {
        fs.renameSync(sourcePath, destPath);
      }

      return res
        .status(200)
        .json({
          success: true,
          message: `Folder "${folderName}" unpublished successfully`,
        });
    }

    // Create empty folder
    if (action === "create-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const target = req.query.target as string;

      // Validate folder name (alphanumeric, hyphens, underscores only)
      if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid folder name. Use only letters, numbers, hyphens, and underscores.",
          });
      }

      let folderPath: string;
      if (target === "unreleased") {
        folderPath = path.join(unreleasedPath, folderName);
      } else {
        folderPath = path.join(contentPath, folderName);
      }

      // Security check
      if (!folderPath.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Check if folder already exists
      if (fs.existsSync(folderPath)) {
        return res.status(400).json({ error: "Folder already exists" });
      }

      // Create the folder
      fs.mkdirSync(folderPath, { recursive: true });

      // Create a .gitkeep file to ensure the folder is tracked by git
      fs.writeFileSync(path.join(folderPath, ".gitkeep"), "");

      return res
        .status(200)
        .json({
          success: true,
          message: `Folder "${folderName}" created successfully`,
        });
    }

    // Rename file
    if (action === "rename" && reqFilePath) {
      const newName = req.query.newName as string;
      const source = req.query.source as string;

      if (!newName) {
        return res.status(400).json({ error: "New name is required" });
      }

      // Validate new name (alphanumeric, hyphens, underscores, dots only)
      if (!/^[a-zA-Z0-9_.-]+$/.test(newName)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid file name. Use only letters, numbers, hyphens, underscores, and dots.",
          });
      }

      // Ensure valid extension
      if (!newName.endsWith(".md") && !newName.endsWith(".html")) {
        return res
          .status(400)
          .json({ error: "File must have .md or .html extension" });
      }

      const basePath = source === "unreleased" ? unreleasedPath : contentPath;
      const oldPath = path.join(basePath, reqFilePath as string);
      const newPath = path.join(path.dirname(oldPath), newName);

      // Security checks
      if (
        !oldPath.startsWith(contentPath) ||
        !newPath.startsWith(contentPath)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ error: "File not found" });
      }

      if (fs.existsSync(newPath)) {
        return res
          .status(400)
          .json({ error: "A file with that name already exists" });
      }

      // Rename the file
      fs.renameSync(oldPath, newPath);

      return res
        .status(200)
        .json({ success: true, message: `Renamed to "${newName}"` });
    }

    // Delete file
    if (action === "delete" && reqFilePath) {
      const source = req.query.source as string;

      const basePath = source === "unreleased" ? unreleasedPath : contentPath;
      const filePath = path.join(basePath, reqFilePath as string);

      // Security check
      if (!filePath.startsWith(contentPath)) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Make sure it's a file, not a directory
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        return res
          .status(400)
          .json({
            error: "Cannot delete folders. Please delete files individually.",
          });
      }

      // Delete the file
      fs.unlinkSync(filePath);

      return res
        .status(200)
        .json({
          success: true,
          message: `Deleted "${path.basename(reqFilePath as string)}"`,
        });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Admin API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
