import { NextApiRequest, NextApiResponse } from "next";
import { put, list, del, copy } from "@vercel/blob";

// Simple password protection - in production, use proper auth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

interface FileItem {
  name: string;
  type: "file" | "folder";
  path: string;
  url?: string;
  children?: FileItem[];
}

// Helper to organize blobs into a tree structure
const organizeBlobsIntoTree = (
  blobs: { pathname: string; url: string }[],
  prefix: string,
): FileItem[] => {
  const items: FileItem[] = [];
  const folderMap = new Map<string, FileItem>();

  for (const blob of blobs) {
    // Skip if doesn't start with prefix
    if (prefix && !blob.pathname.startsWith(prefix)) continue;

    // Get relative path from prefix
    const relativePath = prefix
      ? blob.pathname.slice(prefix.length)
      : blob.pathname;
    const parts = relativePath.split("/").filter(Boolean);

    if (parts.length === 0) continue;

    if (parts.length === 1) {
      // It's a file at this level
      if (parts[0].endsWith(".md") || parts[0].endsWith(".html")) {
        items.push({
          name: parts[0],
          type: "file",
          path: blob.pathname,
          url: blob.url,
        });
      }
    } else {
      // It's in a subfolder - create folder entry if needed
      const folderName = parts[0];
      if (!folderMap.has(folderName)) {
        const folder: FileItem = {
          name: folderName,
          type: "folder",
          path: prefix ? `${prefix}${folderName}` : folderName,
          children: [],
        };
        folderMap.set(folderName, folder);
        items.push(folder);
      }

      // Add file to folder's children if it's a direct child
      if (parts.length === 2) {
        const folder = folderMap.get(folderName)!;
        if (parts[1].endsWith(".md") || parts[1].endsWith(".html")) {
          folder.children!.push({
            name: parts[1],
            type: "file",
            path: blob.pathname,
            url: blob.url,
          });
        }
      }
    }
  }

  return items;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { password, action, filePath: reqFilePath, destination } = req.query;

  // Check password
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // List unreleased files
    if (action === "list-unreleased") {
      const { blobs } = await list({ prefix: "unreleased/" });
      const files = organizeBlobsIntoTree(blobs, "unreleased/");
      return res.status(200).json({ files });
    }

    // List published files (excluding unreleased folder)
    if (action === "list-published") {
      const { blobs } = await list();
      const publishedBlobs = blobs.filter(
        (b) => !b.pathname.startsWith("unreleased/"),
      );

      // Get unique top-level folders
      const folderNames = new Set<string>();
      for (const blob of publishedBlobs) {
        const parts = blob.pathname.split("/");
        if (parts.length > 1) {
          folderNames.add(parts[0]);
        }
      }

      const items: FileItem[] = [];
      for (const folderName of folderNames) {
        const folderBlobs = publishedBlobs.filter((b) =>
          b.pathname.startsWith(`${folderName}/`),
        );
        items.push({
          name: folderName,
          type: "folder",
          path: folderName,
          children: organizeBlobsIntoTree(folderBlobs, `${folderName}/`),
        });
      }

      return res.status(200).json({ files: items });
    }

    // Read a file
    if (action === "read" && reqFilePath) {
      // filePath already contains the full path (e.g., "unreleased/Unit-2/Slides.html" or "Unit-1/Slides.md")
      const fullPath = reqFilePath as string;

      // Find the blob
      const { blobs } = await list({ prefix: fullPath });
      const blob = blobs.find((b) => b.pathname === fullPath);

      if (!blob) {
        return res.status(404).json({ error: "File not found" });
      }

      const response = await fetch(blob.url);
      const content = await response.text();
      const fileName = fullPath.split("/").pop() || "";

      return res.status(200).json({ content, fileName });
    }

    // Move file from unreleased to published
    if (action === "publish" && reqFilePath && destination) {
      // filePath already contains the full path (e.g., "unreleased/Unit-2/Slides.html")
      const sourcePath = reqFilePath as string;
      const fileName = sourcePath.split("/").pop() || "";
      const destPath = `${destination}/${fileName}`;

      // Find source blob
      const { blobs } = await list({ prefix: sourcePath });
      const sourceBlob = blobs.find((b) => b.pathname === sourcePath);

      if (!sourceBlob) {
        return res.status(404).json({ error: "Source file not found" });
      }

      // Copy to new location
      await copy(sourceBlob.url, destPath, { access: "public" });

      // Delete from old location
      await del(sourceBlob.url);

      return res
        .status(200)
        .json({ success: true, message: "File published successfully" });
    }

    // Move file from published to unreleased
    if (action === "unpublish" && reqFilePath && destination) {
      const sourcePath = reqFilePath as string;
      const fileName = sourcePath.split("/").pop() || "";
      const destPath = `unreleased/${destination}/${fileName}`;

      // Find source blob
      const { blobs } = await list({ prefix: sourcePath });
      const sourceBlob = blobs.find((b) => b.pathname === sourcePath);

      if (!sourceBlob) {
        return res.status(404).json({ error: "Source file not found" });
      }

      // Copy to unreleased
      await copy(sourceBlob.url, destPath, { access: "public" });

      // Delete from published
      await del(sourceBlob.url);

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
        const { blobs } = await list();
        const folderSet = new Set<string>();
        for (const blob of blobs) {
          if (blob.pathname.startsWith("unreleased/")) continue;
          const parts = blob.pathname.split("/");
          if (parts.length > 1) {
            folderSet.add(parts[0]);
          }
        }
        folders.push(...folderSet);
      } else {
        // List unreleased folders as destinations
        const { blobs } = await list({ prefix: "unreleased/" });
        const folderSet = new Set<string>();
        for (const blob of blobs) {
          const relativePath = blob.pathname.replace("unreleased/", "");
          const parts = relativePath.split("/");
          if (parts.length > 1) {
            folderSet.add(parts[0]);
          }
        }
        folders.push(...folderSet);
      }

      return res.status(200).json({ folders });
    }

    // Move entire folder from unreleased to published
    if (action === "publish-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const sourcePrefix = `unreleased/${folderName}/`;

      const { blobs } = await list({ prefix: sourcePrefix });

      if (blobs.length === 0) {
        return res.status(404).json({ error: "Folder not found or empty" });
      }

      // Move all files
      for (const blob of blobs) {
        const newPath = blob.pathname.replace("unreleased/", "");
        await copy(blob.url, newPath, { access: "public" });
        await del(blob.url);
      }

      return res.status(200).json({
        success: true,
        message: `Folder "${folderName}" published successfully`,
      });
    }

    // Move entire folder from published to unreleased
    if (action === "unpublish-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const sourcePrefix = `${folderName}/`;

      const { blobs } = await list({ prefix: sourcePrefix });
      const publishedBlobs = blobs.filter(
        (b) => !b.pathname.startsWith("unreleased/"),
      );

      if (publishedBlobs.length === 0) {
        return res.status(404).json({ error: "Folder not found or empty" });
      }

      // Move all files to unreleased
      for (const blob of publishedBlobs) {
        const newPath = `unreleased/${blob.pathname}`;
        await copy(blob.url, newPath, { access: "public" });
        await del(blob.url);
      }

      return res.status(200).json({
        success: true,
        message: `Folder "${folderName}" unpublished successfully`,
      });
    }

    // Create empty folder (create a placeholder file)
    if (action === "create-folder" && reqFilePath) {
      const folderName = reqFilePath as string;
      const target = req.query.target as string;

      // Validate folder name
      if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
        return res.status(400).json({
          error:
            "Invalid folder name. Use only letters, numbers, hyphens, and underscores.",
        });
      }

      const folderPath =
        target === "unreleased"
          ? `unreleased/${folderName}/.gitkeep`
          : `${folderName}/.gitkeep`;

      // Check if folder already exists
      const prefix =
        target === "unreleased"
          ? `unreleased/${folderName}/`
          : `${folderName}/`;
      const { blobs } = await list({ prefix });

      if (blobs.length > 0) {
        return res.status(400).json({ error: "Folder already exists" });
      }

      // Create placeholder file (use space instead of empty string to avoid Vercel Blob error)
      await put(folderPath, " ", { access: "public", addRandomSuffix: false });

      return res.status(200).json({
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

      // Validate new name
      if (!/^[a-zA-Z0-9_.-]+$/.test(newName)) {
        return res.status(400).json({
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

      // filePath already contains the full path (e.g., "unreleased/Unit-2/Slides.md" or "Unit-1/Slides.md")
      const oldPath = reqFilePath as string;

      // Find the old blob
      const { blobs } = await list({ prefix: oldPath });
      const oldBlob = blobs.find((b) => b.pathname === oldPath);

      if (!oldBlob) {
        return res.status(404).json({ error: "File not found" });
      }

      // Calculate new path
      const pathParts = oldPath.split("/");
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join("/");

      // Check if new path already exists
      const { blobs: existingBlobs } = await list({ prefix: newPath });
      if (existingBlobs.some((b) => b.pathname === newPath)) {
        return res
          .status(400)
          .json({ error: "A file with that name already exists" });
      }

      // Copy to new name and delete old
      await copy(oldBlob.url, newPath, { access: "public" });
      await del(oldBlob.url);

      return res
        .status(200)
        .json({ success: true, message: `Renamed to "${newName}"` });
    }

    // Delete file
    if (action === "delete" && reqFilePath) {
      // filePath already contains the full path (e.g., "unreleased/Unit-2/Slides.md" or "Unit-1/Slides.md")
      const filePath = reqFilePath as string;

      // Find the blob
      const { blobs } = await list({ prefix: filePath });
      const blob = blobs.find((b) => b.pathname === filePath);

      if (!blob) {
        return res.status(404).json({ error: "File not found" });
      }

      // Delete the file
      await del(blob.url);

      return res.status(200).json({
        success: true,
        message: `Deleted "${filePath.split("/").pop()}"`,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Admin API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
