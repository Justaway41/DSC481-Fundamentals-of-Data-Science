import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SlideViewer from "../../components/SlideViewer";

export const getStaticPaths: GetStaticPaths = async () => {
  const contentPath = path.join(process.cwd(), "content");
  const units = fs.readdirSync(contentPath);

  const paths = units.flatMap((unit) => {
    // Exclude unreleased folder from public view
    if (unit === "unreleased") return [];
    const unitPath = path.join(contentPath, unit);
    if (!fs.statSync(unitPath).isDirectory()) return [];
    const files = fs
      .readdirSync(unitPath)
      .filter((f) => !f.startsWith(".") && !f.endsWith(".html"));
    return files.map((file) => ({
      params: { unit, file },
    }));
  });

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { unit, file } = context.params as { unit: string; file: string };
  const filePath = path.join(process.cwd(), "content", unit, file);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const isMarkdown = file.endsWith(".md");

    return {
      props: {
        unit,
        fileName: file,
        content: fileContent,
        isMarkdown,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

// Clean Marp markdown: remove frontmatter and speaker notes
function cleanMarpMarkdown(content: string): string {
  // Remove YAML frontmatter
  let markdown = content.replace(/^---[\s\S]*?---\n*/m, "");

  // Remove HTML comments (speaker notes in Marp)
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, "");

  // Remove slide separators (---) and replace with horizontal rule for visual separation
  markdown = markdown.replace(/\n---\n/g, "\n\n---\n\n");

  return markdown.trim();
}

const FileViewer = ({
  unit,
  fileName,
  content,
  isMarkdown,
}: {
  unit: string;
  fileName: string;
  content: string;
  isMarkdown: boolean;
}) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const cleanedMarkdown = isMarkdown ? cleanMarpMarkdown(content) : "";
  const isSlides = fileName.toLowerCase().includes("slide");

  // Presentation mode - fullscreen slide viewer
  if (isPresentationMode && isMarkdown) {
    return (
      <SlideViewer
        markdown={content}
        onExitPresentation={() => setIsPresentationMode(false)}
      />
    );
  }

  return (
    <Layout title={fileName}>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/${unit}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to {unit.replace(/-/g, " ")}
        </Link>

        {isMarkdown && isSlides && (
          <button
            onClick={() => setIsPresentationMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Present Slides
          </button>
        )}
      </div>

      {isMarkdown ? (
        /* Markdown - scrollable content */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanedMarkdown}
          </ReactMarkdown>
        </div>
      ) : (
        /* Other files - plain text */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
            {content}
          </pre>
        </div>
      )}
    </Layout>
  );
};

export default FileViewer;
