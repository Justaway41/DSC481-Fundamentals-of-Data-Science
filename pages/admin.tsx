import React, { useState, useRef, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface FileItem {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileItem[];
}

// Default Marp template
const DEFAULT_MARP_TEMPLATE = `---
marp: true
theme: default
paginate: true
title: Your Presentation Title
---

# Slide 1: Title

Your presentation content here

---

# Slide 2

- Point 1
- Point 2
- Point 3

---

# Slide 3

More content...
`;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreleasedFiles, setUnreleasedFiles] = useState<FileItem[]>([]);
  const [publishedFiles, setPublishedFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    content: string;
    fileName: string;
    path: string;
    source: "unreleased" | "published";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moveModal, setMoveModal] = useState<{
    file: FileItem;
    source: "unreleased" | "published";
  } | null>(null);
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Upload state
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"unreleased" | "published">(
    "unreleased",
  );
  const [uploadFolder, setUploadFolder] = useState("");
  const [uploadNewFolder, setUploadNewFolder] = useState("");
  const [uploadFolders, setUploadFolders] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder move state
  const [folderMoveModal, setFolderMoveModal] = useState<{
    folder: FileItem;
    source: "unreleased" | "published";
  } | null>(null);

  // Create folder state
  const [createFolderModal, setCreateFolderModal] = useState<{
    target: "unreleased" | "published";
  } | null>(null);
  const [newFolderInput, setNewFolderInput] = useState("");

  // Rename state
  const [renameModal, setRenameModal] = useState<{
    file: FileItem;
    source: "unreleased" | "published";
  } | null>(null);
  const [renameInput, setRenameInput] = useState("");

  // Delete state
  const [deleteModal, setDeleteModal] = useState<{
    file: FileItem;
    source: "unreleased" | "published";
  } | null>(null);

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(DEFAULT_MARP_TEMPLATE);
  const [editorFileName, setEditorFileName] = useState("");
  const [editorFolder, setEditorFolder] = useState("");
  const [editorNewFolder, setEditorNewFolder] = useState("");
  const [editorTarget, setEditorTarget] = useState<"unreleased" | "published">(
    "unreleased",
  );
  const [editorPreview, setEditorPreview] = useState("");
  const [editorFolders, setEditorFolders] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"marp" | "markdown">("marp");
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Editing existing file state
  const [editingFile, setEditingFile] = useState<{
    path: string;
    source: "unreleased" | "published";
    fileName: string;
  } | null>(null);

  const getStoredPassword = () => sessionStorage.getItem("adminPassword") || "";

  const fetchFiles = async () => {
    const pwd = getStoredPassword();
    try {
      const [unreleasedRes, publishedRes] = await Promise.all([
        fetch(`/api/admin?password=${pwd}&action=list-unreleased`),
        fetch(`/api/admin?password=${pwd}&action=list-published`),
      ]);

      if (unreleasedRes.ok && publishedRes.ok) {
        const unreleasedData = await unreleasedRes.json();
        const publishedData = await publishedRes.json();
        setUnreleasedFiles(unreleasedData.files);
        setPublishedFiles(publishedData.files);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/admin?password=${password}&action=list-unreleased`,
      );
      if (res.ok) {
        sessionStorage.setItem("adminPassword", password);
        setIsAuthenticated(true);
        await fetchFiles();
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const loadFile = async (
    filePath: string,
    source: "unreleased" | "published",
  ) => {
    setLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=read&filePath=${encodeURIComponent(
          filePath,
        )}&source=${source}`,
      );
      if (res.ok) {
        const data = await res.json();
        setSelectedFile({ ...data, path: filePath, source });
      } else {
        setError("Failed to load file");
      }
    } catch (err) {
      setError("Failed to load file");
    } finally {
      setLoading(false);
    }
  };

  const openMoveModal = async (
    file: FileItem,
    source: "unreleased" | "published",
  ) => {
    const pwd = getStoredPassword();
    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=list-folders&source=${source}`,
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableFolders(data.folders);
        setMoveModal({ file, source });
        setNewFolderName("");
      }
    } catch (err) {
      setError("Failed to load folders");
    }
  };

  const handleMove = async (destinationFolder: string) => {
    if (!moveModal) return;

    const pwd = getStoredPassword();
    const action = moveModal.source === "unreleased" ? "publish" : "unpublish";

    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=${action}&filePath=${encodeURIComponent(
          moveModal.file.path,
        )}&destination=${encodeURIComponent(destinationFolder)}`,
      );

      if (res.ok) {
        setSuccessMessage(
          moveModal.source === "unreleased"
            ? `Published "${moveModal.file.name}" to ${destinationFolder}`
            : `Moved "${moveModal.file.name}" to unreleased/${destinationFolder}`,
        );
        setMoveModal(null);
        setSelectedFile(null);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to move file");
      }
    } catch (err) {
      setError("Failed to move file");
    } finally {
      setLoading(false);
    }
  };

  // Upload functions
  const openUploadModal = async (target: "unreleased" | "published") => {
    setUploadTarget(target);
    setUploadFolder("");
    setUploadNewFolder("");

    // Fetch available folders
    const pwd = getStoredPassword();
    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=list-folders&source=${
          target === "unreleased" ? "published" : "unreleased"
        }`,
      );
      if (res.ok) {
        const data = await res.json();
        // For upload, we want folders in the target location
        if (target === "unreleased") {
          // Get unreleased folders
          const unreleasedFolders = unreleasedFiles
            .filter((f) => f.type === "folder")
            .map((f) => f.name);
          setUploadFolders(unreleasedFolders);
        } else {
          // Get published folders
          const publishedFolders = publishedFiles
            .filter((f) => f.type === "folder")
            .map((f) => f.name);
          setUploadFolders(publishedFolders);
        }
      }
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }

    setUploadModal(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleUpload = async (files: FileList) => {
    const folder = uploadNewFolder || uploadFolder;
    if (!folder) {
      setError("Please select or create a folder");
      return;
    }

    // Filter valid files
    const validFiles = Array.from(files).filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ext === "md" || ext === "html";
    });

    if (validFiles.length === 0) {
      setError("Only .md and .html files are allowed");
      return;
    }

    setLoading(true);
    const pwd = getStoredPassword();

    const formData = new FormData();
    formData.append("password", pwd);
    formData.append("destination", folder);
    formData.append("isUnreleased", String(uploadTarget === "unreleased"));

    for (const file of validFiles) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`Uploaded ${data.files.length} file(s) to ${folder}`);
        setUploadModal(false);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to upload files");
      }
    } catch (err) {
      setError("Failed to upload files");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Move folder function
  const moveFolder = async () => {
    if (!folderMoveModal) return;

    setLoading(true);
    const pwd = getStoredPassword();
    const action =
      folderMoveModal.source === "unreleased"
        ? "publish-folder"
        : "unpublish-folder";

    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=${action}&filePath=${encodeURIComponent(
          folderMoveModal.folder.name,
        )}`,
      );

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setFolderMoveModal(null);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to move folder");
      }
    } catch (err) {
      setError("Failed to move folder");
    } finally {
      setLoading(false);
    }
  };

  // Create folder function
  const createFolder = async () => {
    if (!createFolderModal || !newFolderInput.trim()) {
      setError("Please enter a folder name");
      return;
    }

    setLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=create-folder&filePath=${encodeURIComponent(
          newFolderInput.trim(),
        )}&target=${createFolderModal.target}`,
      );

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setCreateFolderModal(null);
        setNewFolderInput("");
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create folder");
      }
    } catch (err) {
      setError("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  // Rename file function
  const renameFile = async () => {
    if (!renameModal || !renameInput.trim()) {
      setError("Please enter a new name");
      return;
    }

    setLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=rename&filePath=${encodeURIComponent(
          renameModal.file.path,
        )}&newName=${encodeURIComponent(renameInput.trim())}&source=${
          renameModal.source
        }`,
      );

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setRenameModal(null);
        setRenameInput("");
        setSelectedFile(null);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to rename file");
      }
    } catch (err) {
      setError("Failed to rename file");
    } finally {
      setLoading(false);
    }
  };

  // Open rename modal
  const openRenameModal = (
    file: FileItem,
    source: "unreleased" | "published",
  ) => {
    setRenameModal({ file, source });
    setRenameInput(file.name);
    setError("");
  };

  // Delete file
  const deleteFile = async () => {
    if (!deleteModal) return;

    setLoading(true);
    setError("");
    const pwd = getStoredPassword();

    try {
      const res = await fetch(
        `/api/admin?password=${pwd}&action=delete&filePath=${encodeURIComponent(
          deleteModal.file.path,
        )}&source=${deleteModal.source}`,
        { method: "POST" },
      );

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setDeleteModal(null);
        setSelectedFile(null);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete file");
      }
    } catch (err) {
      setError("Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  // Editor functions
  const openEditor = (target: "unreleased" | "published") => {
    setEditorTarget(target);
    setEditorContent(DEFAULT_MARP_TEMPLATE);
    setEditorFileName("");
    setEditorFolder("");
    setEditorNewFolder("");
    setEditorPreview("");
    setPreviewMode("marp");
    setEditingFile(null);

    // Get folders for target
    if (target === "unreleased") {
      const folders = unreleasedFiles
        .filter((f) => f.type === "folder")
        .map((f) => f.name);
      setEditorFolders(folders);
    } else {
      const folders = publishedFiles
        .filter((f) => f.type === "folder")
        .map((f) => f.name);
      setEditorFolders(folders);
    }

    setEditorOpen(true);
  };

  // Open editor to edit an existing file
  const openEditorForFile = (file: {
    content: string;
    fileName: string;
    path: string;
    source: "unreleased" | "published";
  }) => {
    setEditorTarget(file.source);
    setEditorContent(file.content);

    // Extract folder from path (e.g., "Unit-1/Slides.md" -> "Unit-1")
    const pathParts = file.path.split("/");
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";
    const fileName = file.fileName.replace(/\.(md|html)$/, "");

    setEditorFileName(fileName);
    setEditorFolder(folder);
    setEditorNewFolder("");
    setEditorPreview("");
    setPreviewMode("marp");
    setEditingFile({
      path: file.path,
      source: file.source,
      fileName: file.fileName,
    });

    // Get folders for target
    if (file.source === "unreleased") {
      const folders = unreleasedFiles
        .filter((f) => f.type === "folder")
        .map((f) => f.name);
      setEditorFolders(folders);
    } else {
      const folders = publishedFiles
        .filter((f) => f.type === "folder")
        .map((f) => f.name);
      setEditorFolders(folders);
    }

    setEditorOpen(true);
  };

  const updatePreview = useCallback(async (content: string) => {
    if (!content.trim()) {
      setEditorPreview("");
      return;
    }

    setPreviewLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "preview",
          markdown: content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditorPreview(data.html);
      }
    } catch (err) {
      console.error("Preview error:", err);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  // Debounced preview update (only for Marp mode)
  useEffect(() => {
    if (!editorOpen || previewMode !== "marp") return;

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = setTimeout(() => {
      updatePreview(editorContent);
    }, 500);

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [editorContent, editorOpen, updatePreview, previewMode]);

  // Trigger Marp preview when switching to marp mode
  useEffect(() => {
    if (editorOpen && previewMode === "marp" && !editorPreview) {
      updatePreview(editorContent);
    }
  }, [previewMode, editorOpen, editorContent, editorPreview, updatePreview]);

  const saveMarkdown = async () => {
    // If editing an existing file, use update action
    if (editingFile) {
      setLoading(true);
      const pwd = getStoredPassword();

      try {
        const res = await fetch("/api/editor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: pwd,
            action: "update",
            markdown: editorContent,
            filePath: editingFile.path,
            source: editingFile.source,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSuccessMessage(data.message);
          setEditorOpen(false);
          setEditingFile(null);
          setSelectedFile(null);
          await fetchFiles();
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to update file");
        }
      } catch (err) {
        setError("Failed to update file");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Creating new file
    const folder = editorNewFolder || editorFolder;
    if (!folder) {
      setError("Please select or create a folder");
      return;
    }
    if (!editorFileName) {
      setError("Please enter a file name");
      return;
    }

    setLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "save",
          markdown: editorContent,
          fileName: editorFileName,
          folder: folder,
          isUnreleased: editorTarget === "unreleased",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setEditorOpen(false);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save file");
      }
    } catch (err) {
      setError("Failed to save file");
    } finally {
      setLoading(false);
    }
  };

  // Save MD and also generate/update the corresponding HTML (Slides.html for Slides.md)
  const saveMarkdownAndHtml = async () => {
    if (!editingFile) return;

    setLoading(true);
    const pwd = getStoredPassword();

    try {
      // First save the markdown
      const mdRes = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "update",
          markdown: editorContent,
          filePath: editingFile.path,
          source: editingFile.source,
        }),
      });

      if (!mdRes.ok) {
        const data = await mdRes.json();
        setError(data.error || "Failed to update markdown file");
        return;
      }

      // Then export the HTML to the same folder
      // Get the folder from the file path (e.g., "Unit-1/Slides.md" -> "Unit-1")
      const pathParts = editingFile.path.split("/");
      const fileName = pathParts.pop()?.replace(/\.md$/, "") || "Slides";
      const folder = pathParts.join("/") || "";

      const htmlRes = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "save-html",
          markdown: editorContent,
          fileName: fileName,
          folder: folder,
          isUnreleased: editingFile.source === "unreleased",
        }),
      });

      if (htmlRes.ok) {
        const data = await htmlRes.json();
        setSuccessMessage(
          `Saved ${editingFile.path} and exported ${fileName}.html`,
        );
        setEditorOpen(false);
        setEditingFile(null);
        setSelectedFile(null);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await htmlRes.json();
        setError(data.error || "Markdown saved but failed to export HTML");
      }
    } catch (err) {
      setError("Failed to save files");
    } finally {
      setLoading(false);
    }
  };

  const exportToHtml = async () => {
    const folder = editorNewFolder || editorFolder;
    if (!folder) {
      setError("Please select or create a folder");
      return;
    }
    if (!editorFileName) {
      setError("Please enter a file name");
      return;
    }

    setLoading(true);
    const pwd = getStoredPassword();

    try {
      const res = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "save-html",
          markdown: editorContent,
          fileName: editorFileName,
          folder: folder,
          isUnreleased: editorTarget === "unreleased",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        await fetchFiles();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to export HTML");
      }
    } catch (err) {
      setError("Failed to export HTML");
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = async () => {
    const pwd = getStoredPassword();

    try {
      const res = await fetch("/api/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pwd,
          action: "export",
          markdown: editorContent,
          fileName: editorFileName || "presentation",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${editorFileName || "presentation"}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError("Failed to download HTML");
    }
  };

  // Clean markdown for display - only removes Marp-specific frontmatter
  const cleanMarpMarkdown = (content: string): string => {
    // Only remove frontmatter if it contains marp: true
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n*/);
    if (frontmatterMatch && frontmatterMatch[1].includes("marp:")) {
      // This is a Marp file, clean it
      let markdown = content.replace(/^---[\s\S]*?---\n*/m, "");
      markdown = markdown.replace(/<!--[\s\S]*?-->/g, "");
      // Convert slide separators to horizontal rules
      markdown = markdown.replace(/\n---\n/g, "\n\n---\n\n");
      return markdown.trim();
    }
    // Regular markdown, return as-is
    return content;
  };

  const renderFileTree = (
    items: FileItem[],
    source: "unreleased" | "published",
    depth = 0,
  ) => {
    return (
      <ul className={`${depth > 0 ? "ml-4" : ""} space-y-1`}>
        {items.map((item) => (
          <li key={item.path}>
            {item.type === "folder" ? (
              <div>
                <div className="flex items-center gap-2 py-1 text-gray-700 font-medium group">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span className="flex-1">{item.name}</span>
                  {depth === 0 && (
                    <button
                      onClick={() =>
                        setFolderMoveModal({ folder: item, source })
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-opacity"
                      title={
                        source === "unreleased"
                          ? "Publish entire folder"
                          : "Unpublish entire folder"
                      }
                    >
                      {source === "unreleased" ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 17l-5-5m0 0l5-5m-5 5h12"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {item.children &&
                  renderFileTree(item.children, source, depth + 1)}
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <button
                  onClick={() => loadFile(item.path, source)}
                  className="flex-1 flex items-center gap-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 rounded text-left"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate">{item.name}</span>
                </button>
                <button
                  onClick={() => openMoveModal(item, source)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-opacity"
                  title={source === "unreleased" ? "Publish" : "Unpublish"}
                >
                  {source === "unreleased" ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <Layout title="Admin">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Admin Access
            </h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <div className="mb-4 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Admin dashboard
  return (
    <Layout title="Admin - Content Manager">
      {/* Success message */}
      {successMessage && (
        <div className="fixed top-20 right-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Move Modal */}
      {moveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {moveModal.source === "unreleased" ? "Publish" : "Unpublish"}{" "}
              &quot;{moveModal.file.name}&quot;
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {moveModal.source === "unreleased"
                ? "Select a folder to publish this file to:"
                : "Select an unreleased folder to move this file to:"}
            </p>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {availableFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => handleMove(folder)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {folder}
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">
                Or create a new folder:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Unit-3"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={() => newFolderName && handleMove(newFolderName)}
                  disabled={!newFolderName}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  Create & Move
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setMoveModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Move Confirmation Modal */}
      {folderMoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              {folderMoveModal.source === "unreleased"
                ? "Publish"
                : "Unpublish"}{" "}
              Folder
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {folderMoveModal.source === "unreleased"
                  ? "You are about to publish the entire folder:"
                  : "You are about to unpublish the entire folder:"}
              </p>
              <p className="font-semibold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                {folderMoveModal.folder.name}
              </p>
              {folderMoveModal.folder.children &&
                folderMoveModal.folder.children.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Contains {folderMoveModal.folder.children.length} item(s)
                  </p>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {folderMoveModal.source === "unreleased"
                ? "This will make all files in this folder visible to students."
                : "This will hide all files in this folder from students."}
            </p>

            {error && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setFolderMoveModal(null);
                  setError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={moveFolder}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  folderMoveModal.source === "unreleased"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                } disabled:opacity-50`}
              >
                {loading
                  ? "Moving..."
                  : folderMoveModal.source === "unreleased"
                    ? "Publish Folder"
                    : "Unpublish Folder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {createFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Create New Folder
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  createFolderModal.target === "unreleased"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {createFolderModal.target === "unreleased"
                  ? "Draft"
                  : "Published"}
              </span>
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Enter a name for the new folder. Use only letters, numbers,
              hyphens, and underscores.
            </p>

            <input
              type="text"
              value={newFolderInput}
              onChange={(e) => setNewFolderInput(e.target.value)}
              placeholder="e.g., Unit-3"
              className="w-full px-3 py-2 border rounded-lg text-sm mb-4"
              onKeyDown={(e) => e.key === "Enter" && createFolder()}
              autoFocus
            />

            {error && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCreateFolderModal(null);
                  setNewFolderInput("");
                  setError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={loading || !newFolderInput.trim()}
                className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 ${
                  createFolderModal.target === "unreleased"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Creating..." : "Create Folder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px] max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Rename File
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              Current name:{" "}
              <code className="bg-gray-100 px-1 rounded">
                {renameModal.file.name}
              </code>
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              New file name:
            </label>
            <input
              type="text"
              placeholder="New-File-Name.md"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              onKeyDown={(e) => e.key === "Enter" && renameFile()}
              autoFocus
            />
            <p className="text-xs text-gray-500 mb-4">
              Use letters, numbers, hyphens, underscores. Must end with .md or
              .html
            </p>

            {error && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRenameModal(null);
                  setRenameInput("");
                  setError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={renameFile}
                disabled={loading || !renameInput.trim()}
                className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Renaming..." : "Rename"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px] max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete File
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <code className="bg-gray-100 px-1 rounded font-medium">
                {deleteModal.file.name}
              </code>
              ?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This action cannot be undone. The file
                will be permanently deleted.
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteModal(null);
                  setError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={deleteFile}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 bg-red-600 hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload to{" "}
              {uploadTarget === "unreleased" ? "Unreleased" : "Published"}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Only <code className="bg-gray-100 px-1 rounded">.md</code> and{" "}
              <code className="bg-gray-100 px-1 rounded">.html</code> files are
              allowed.
            </p>

            {/* Folder selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select destination folder:
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                {uploadFolders.map((folder) => (
                  <label
                    key={folder}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="uploadFolder"
                      value={folder}
                      checked={uploadFolder === folder && !uploadNewFolder}
                      onChange={() => {
                        setUploadFolder(folder);
                        setUploadNewFolder("");
                      }}
                      className="text-blue-600"
                    />
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    {folder}
                  </label>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500">Or create new:</span>
                <input
                  type="text"
                  value={uploadNewFolder}
                  onChange={(e) => {
                    setUploadNewFolder(e.target.value);
                    setUploadFolder("");
                  }}
                  placeholder="e.g., Unit-3"
                  className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.html"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setUploadModal(false);
                  setError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marp Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3 className="text-lg font-semibold">
                  {editingFile ? "Edit File" : "Marp Editor"}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded ${
                      editorTarget === "unreleased"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {editingFile
                      ? editingFile.fileName
                      : editorTarget === "unreleased"
                        ? "Draft"
                        : "Published"}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview toggle */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    showPreview
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>

                <button
                  onClick={() => {
                    setEditorOpen(false);
                    setEditingFile(null);
                    setError("");
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left: Editor */}
              <div
                className={`flex flex-col ${
                  showPreview ? "w-1/2" : "w-full"
                } border-r border-gray-200`}
              >
                {/* File info bar - hide folder selection when editing */}
                {!editingFile && (
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex gap-3 items-center">
                    <input
                      type="text"
                      value={editorFileName}
                      onChange={(e) => setEditorFileName(e.target.value)}
                      placeholder="File name (e.g., Slides)"
                      className="px-3 py-1.5 border rounded text-sm w-40"
                    />
                    <select
                      value={editorFolder}
                      onChange={(e) => {
                        setEditorFolder(e.target.value);
                        setEditorNewFolder("");
                      }}
                      className="px-3 py-1.5 border rounded text-sm"
                    >
                      <option value="">Select folder...</option>
                      {editorFolders.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-400 text-sm">or</span>
                    <input
                      type="text"
                      value={editorNewFolder}
                      onChange={(e) => {
                        setEditorNewFolder(e.target.value);
                        setEditorFolder("");
                      }}
                      placeholder="New folder"
                      className="px-3 py-1.5 border rounded text-sm w-32"
                    />
                  </div>
                )}

                {/* Show editing file info when editing */}
                {editingFile && (
                  <div className="p-3 bg-blue-50 border-b border-blue-200 flex gap-3 items-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="text-sm text-blue-800">
                      Editing: <strong>{editingFile.path}</strong>
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        editingFile.source === "unreleased"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {editingFile.source === "unreleased"
                        ? "Draft"
                        : "Published"}
                    </span>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
                  placeholder="Write your Marp presentation here..."
                  spellCheck={false}
                />
              </div>

              {/* Right: Preview */}
              {showPreview && (
                <div className="w-1/2 flex flex-col bg-gray-100">
                  <div className="p-2 bg-gray-200 text-sm text-gray-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Preview:</span>
                      {/* Only show toggle if content has marp: true */}
                      {/^---[\s\S]*?marp:\s*true[\s\S]*?---/m.test(
                        editorContent,
                      ) ? (
                        <div className="flex bg-gray-300 rounded overflow-hidden">
                          <button
                            onClick={() => setPreviewMode("marp")}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${
                              previewMode === "marp"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-400"
                            }`}
                          >
                            Marp
                          </button>
                          <button
                            onClick={() => setPreviewMode("markdown")}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${
                              previewMode === "markdown"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-400"
                            }`}
                          >
                            Markdown
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Markdown</span>
                      )}
                    </div>
                    {previewLoading &&
                      previewMode === "marp" &&
                      /^---[\s\S]*?marp:\s*true[\s\S]*?---/m.test(
                        editorContent,
                      ) && (
                        <span className="text-xs text-gray-500">
                          Updating...
                        </span>
                      )}
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    {previewMode === "marp" &&
                    /^---[\s\S]*?marp:\s*true[\s\S]*?---/m.test(
                      editorContent,
                    ) ? (
                      editorPreview ? (
                        <div
                          className="marp-preview"
                          dangerouslySetInnerHTML={{ __html: editorPreview }}
                        />
                      ) : (
                        <div className="text-gray-400 text-center mt-10">
                          Marp preview will appear here...
                        </div>
                      )
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-lg max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {cleanMarpMarkdown(editorContent)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Editor Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500">
                Tip: Use <code className="bg-gray-200 px-1 rounded">---</code>{" "}
                to separate slides
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex gap-2">
                {!editingFile && (
                  <>
                    <button
                      onClick={downloadHtml}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                      title="Download HTML file to your computer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={exportToHtml}
                      disabled={
                        loading ||
                        !editorFileName ||
                        (!editorFolder && !editorNewFolder)
                      }
                      className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 disabled:opacity-50 flex items-center gap-2"
                      title="Save HTML file to the selected folder on the server"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save .html
                    </button>
                  </>
                )}
                <button
                  onClick={saveMarkdown}
                  disabled={
                    editingFile
                      ? loading
                      : loading ||
                        !editorFileName ||
                        (!editorFolder && !editorNewFolder)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  title={
                    editingFile
                      ? "Update the file"
                      : "Save Markdown file to the selected folder on the server"
                  }
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {loading ? "Saving..." : editingFile ? "Update" : "Save .md"}
                </button>
                {/* Save & Export HTML button - only when editing existing files with Marp content */}
                {editingFile &&
                  /^---[\s\S]*?marp:\s*true[\s\S]*?---/m.test(
                    editorContent,
                  ) && (
                    <button
                      onClick={saveMarkdownAndHtml}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                      title="Save the markdown file and also generate/update the HTML slides"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {loading ? "Saving..." : "Save & Export HTML"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left Sidebar - Unreleased Files */}
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Unreleased (Draft)
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setError("");
                    setCreateFolderModal({ target: "unreleased" });
                  }}
                  className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  title="Create new folder"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => openEditor("unreleased")}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="Create with Marp Editor"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => openUploadModal("unreleased")}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Upload files"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {unreleasedFiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No unreleased files.</p>
            ) : (
              renderFileTree(unreleasedFiles, "unreleased")
            )}
          </div>
        </div>

        {/* Center - File Preview */}
        <div className="flex-1 min-w-0">
          {selectedFile ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      selectedFile.source === "unreleased"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedFile.source === "unreleased"
                      ? "DRAFT"
                      : "PUBLISHED"}
                  </span>
                  {selectedFile.fileName}
                </h3>
                <div className="flex gap-2">
                  {/* Edit button - only for .md files */}
                  {selectedFile.fileName.endsWith(".md") && (
                    <button
                      onClick={() => openEditorForFile(selectedFile)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  )}
                  {/* Rename button */}
                  <button
                    onClick={() =>
                      openRenameModal(
                        {
                          name: selectedFile.fileName,
                          type: "file",
                          path: selectedFile.path,
                        },
                        selectedFile.source,
                      )
                    }
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Rename
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() =>
                      setDeleteModal({
                        file: {
                          name: selectedFile.fileName,
                          type: "file",
                          path: selectedFile.path,
                        },
                        source: selectedFile.source,
                      })
                    }
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      openMoveModal(
                        {
                          name: selectedFile.fileName,
                          type: "file",
                          path: selectedFile.path,
                        },
                        selectedFile.source,
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedFile.source === "unreleased"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                  >
                    {selectedFile.source === "unreleased" ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        Publish
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Unpublish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[85vh]">
                {selectedFile.fileName.endsWith(".html") ? (
                  /* HTML Preview - with option to open with full functionality */
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    <div className="bg-gray-200 px-3 py-2 text-xs text-gray-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        HTML Preview
                      </div>
                      <button
                        onClick={() => {
                          const pwd = getStoredPassword();
                          window.open(
                            `/api/admin?password=${pwd}&action=preview-html&filePath=${encodeURIComponent(selectedFile.path)}`,
                            "_blank",
                          );
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Open Full Preview
                      </button>
                    </div>
                    <iframe
                      src={`/api/admin?password=${getStoredPassword()}&action=preview-html&filePath=${encodeURIComponent(selectedFile.path)}`}
                      className="w-full h-[80vh] bg-white"
                      title="HTML Preview"
                    />
                  </div>
                ) : (
                  /* Markdown Preview */
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {cleanMarpMarkdown(selectedFile.content)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <p className="text-gray-500 mb-2">Select a file to preview</p>
              <p className="text-gray-400 text-sm">
                Use the arrows to move files between unreleased and published
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Published Files */}
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Published
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setError("");
                    setCreateFolderModal({ target: "published" });
                  }}
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Create new folder"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => openEditor("published")}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="Create with Marp Editor"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => openUploadModal("published")}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Upload files"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {publishedFiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No published files.</p>
            ) : (
              renderFileTree(publishedFiles, "published")
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
