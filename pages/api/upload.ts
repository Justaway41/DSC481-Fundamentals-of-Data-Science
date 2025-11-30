import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import formidable from "formidable";

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dsc481admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const contentPath = path.join(process.cwd(), "content");

  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    filter: ({ mimetype, originalFilename }) => {
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

    // Build destination path
    let destFolder: string;
    if (isUnreleased) {
      destFolder = path.join(contentPath, "unreleased", destination);
    } else {
      destFolder = path.join(contentPath, destination);
    }

    // Security check
    if (!destFolder.startsWith(contentPath)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // Process uploaded files
    const uploadedFiles: string[] = [];
    const fileArray = files.file;

    if (!fileArray || fileArray.length === 0) {
      return res
        .status(400)
        .json({
          error:
            "No valid files uploaded. Only .md and .html files are allowed.",
        });
    }

    for (const file of fileArray) {
      const ext = file.originalFilename?.split(".").pop()?.toLowerCase();

      // Double-check file extension
      if (ext !== "md" && ext !== "html") {
        continue;
      }

      const destPath = path.join(
        destFolder,
        file.originalFilename || `file.${ext}`
      );

      // Read the temp file and write to destination
      const content = fs.readFileSync(file.filepath);
      fs.writeFileSync(destPath, content);

      // Clean up temp file
      fs.unlinkSync(file.filepath);

      uploadedFiles.push(file.originalFilename || `file.${ext}`);
    }

    if (uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({
          error:
            "No valid files uploaded. Only .md and .html files are allowed.",
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
