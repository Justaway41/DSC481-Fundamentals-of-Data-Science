import { NextApiRequest, NextApiResponse } from "next";
import { put, list, del } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filter: ({ originalFilename }) => {
      // Only allow .md and .html files
      const ext = originalFilename?.split(".").pop()?.toLowerCase();
      return ext === "md" || ext === "html";
    },
  });

  try {
    const [fields, files] = await form.parse(req);

    // Check password
    const password = Array.isArray(fields.password)
      ? fields.password[0]
      : fields.password;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get destination info
    const destination = Array.isArray(fields.destination)
      ? fields.destination[0]
      : fields.destination;
    const isUnreleased = Array.isArray(fields.isUnreleased)
      ? fields.isUnreleased[0] === "true"
      : fields.isUnreleased === "true";

    if (!destination) {
      return res.status(400).json({ error: "Destination folder is required" });
    }

    // Process uploaded files
    const uploadedFiles: string[] = [];
    const fileArray = files.file;

    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({
        error: "No valid files uploaded. Only .md and .html files are allowed.",
      });
    }

    for (const file of fileArray) {
      const ext = file.originalFilename?.split(".").pop()?.toLowerCase();

      // Double-check file extension
      if (ext !== "md" && ext !== "html") {
        continue;
      }

      const fileName = file.originalFilename || `file.${ext}`;

      // Build blob path
      let blobPath: string;
      if (isUnreleased) {
        blobPath = `unreleased/${destination}/${fileName}`;
      } else {
        blobPath = `${destination}/${fileName}`;
      }

      // Read the temp file content
      const content = fs.readFileSync(file.filepath);

      // Check if file already exists and delete it first (to overwrite)
      const { blobs } = await list({ prefix: blobPath });
      const existingBlob = blobs.find((b) => b.pathname === blobPath);
      if (existingBlob) {
        await del(existingBlob.url);
      }

      // Determine content type
      const contentType =
        ext === "html"
          ? "text/html; charset=utf-8"
          : "text/markdown; charset=utf-8";

      // Upload to Vercel Blob
      await put(blobPath, content, {
        access: "public",
        addRandomSuffix: false,
        contentType,
      });

      // Clean up temp file
      fs.unlinkSync(file.filepath);

      uploadedFiles.push(fileName);
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        error: "No valid files uploaded. Only .md and .html files are allowed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload files" });
  }
}
