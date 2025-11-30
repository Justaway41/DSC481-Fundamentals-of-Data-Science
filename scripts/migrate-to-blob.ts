/**
 * Migration Script: Upload local content folder to Vercel Blob
 *
 * This script reads all files from the local content/ directory
 * and uploads them to your Vercel Blob store.
 *
 * Usage:
 *   1. Make sure you have BLOB_READ_WRITE_TOKEN in your .env.local
 *      (run `vercel env pull .env.local` to get it)
 *   2. Run: npx tsx scripts/migrate-to-blob.ts
 *
 * Options:
 *   --dry-run    Preview what would be uploaded without actually uploading
 *   --force      Overwrite existing blobs (by default, existing files are skipped)
 */

import { put, list } from "@vercel/blob";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOB_PREFIX = "content/";

interface FileToUpload {
  localPath: string;
  blobPath: string;
  size: number;
}

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Skip hidden files and .gitkeep
      if (!file.startsWith(".") && file !== ".gitkeep") {
        arrayOfFiles.push(fullPath);
      }
    }
  }

  return arrayOfFiles;
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".md": "text/markdown",
    ".html": "text/html",
    ".txt": "text/plain",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };
  return contentTypes[ext] || "application/octet-stream";
}

/**
 * List existing blobs in the store
 */
async function getExistingBlobs(): Promise<Set<string>> {
  const existingPaths = new Set<string>();

  try {
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      for (const blob of result.blobs) {
        existingPaths.add(blob.pathname);
      }
      cursor = result.cursor;
    } while (cursor);
  } catch (error) {
    console.warn("Warning: Could not list existing blobs:", error);
  }

  return existingPaths;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🚀 Vercel Blob Migration Script");
  console.log("================================\n");

  if (DRY_RUN) {
    console.log("📋 DRY RUN MODE - No files will be uploaded\n");
  }

  if (FORCE) {
    console.log("⚠️  FORCE MODE - Existing files will be overwritten\n");
  }

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ Error: BLOB_READ_WRITE_TOKEN is not set!");
    console.error("   Run `vercel env pull .env.local` to get it.");
    process.exit(1);
  }

  // Check if content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Error: Content directory not found at ${CONTENT_DIR}`);
    process.exit(1);
  }

  // Get all files to upload
  const allFiles = getAllFiles(CONTENT_DIR);
  const filesToUpload: FileToUpload[] = allFiles.map((localPath) => {
    const relativePath = path.relative(CONTENT_DIR, localPath);
    // Use forward slashes for blob paths (even on Windows)
    const blobPath = BLOB_PREFIX + relativePath.split(path.sep).join("/");
    const stats = fs.statSync(localPath);
    return {
      localPath,
      blobPath,
      size: stats.size,
    };
  });

  console.log(`📁 Found ${filesToUpload.length} files in ${CONTENT_DIR}\n`);

  if (filesToUpload.length === 0) {
    console.log("No files to migrate.");
    return;
  }

  // List existing blobs
  console.log("🔍 Checking existing blobs...\n");
  const existingBlobs = await getExistingBlobs();

  // Track results
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  // Upload each file
  for (const file of filesToUpload) {
    const exists = existingBlobs.has(file.blobPath);

    if (exists && !FORCE) {
      console.log(`⏭️  Skipping (exists): ${file.blobPath}`);
      skipped++;
      continue;
    }

    const action = exists ? "Overwriting" : "Uploading";

    if (DRY_RUN) {
      console.log(
        `📄 Would upload: ${file.blobPath} (${formatBytes(file.size)})`
      );
      uploaded++;
      continue;
    }

    try {
      const fileContent = fs.readFileSync(file.localPath);
      const contentType = getContentType(file.localPath);

      await put(file.blobPath, fileContent, {
        access: "public",
        contentType,
        addRandomSuffix: false,
      });

      console.log(
        `✅ ${action}: ${file.blobPath} (${formatBytes(file.size)})`
      );
      uploaded++;
    } catch (error) {
      console.error(`❌ Error uploading ${file.blobPath}:`, error);
      errors++;
    }
  }

  // Summary
  console.log("\n================================");
  console.log("📊 Migration Summary:");
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  console.log(`   ❌ Errors:   ${errors}`);

  if (DRY_RUN) {
    console.log("\n💡 Run without --dry-run to actually upload files.");
  }

  if (errors > 0) {
    process.exit(1);
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Run migration
migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
