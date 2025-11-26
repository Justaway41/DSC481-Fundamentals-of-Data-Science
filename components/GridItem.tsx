import React from "react";
import Link from "next/link";

interface GridItemProps {
  type: "folder" | "file";
  name: string;
  href: string;
}

const GridItem: React.FC<GridItemProps> = ({ type, name, href }) => {
  const isFolder = type === "folder";
  const isHtml = name.endsWith(".html");

  const content = (
    <div
      className={`
        relative flex flex-col items-center justify-center
        p-4 rounded-xl border border-gray-200 bg-white
        transition-all duration-200 ease-in-out
        hover:shadow-lg hover:border-blue-300 hover:bg-blue-50/30
        cursor-pointer h-40 w-full
      `}
    >
      <div className="mb-3 text-gray-500 group-hover:text-blue-500 transition-colors">
        {isFolder ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-16 h-16"
          >
            <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-14 h-14"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-700 text-center line-clamp-2 group-hover:text-blue-700 px-2">
        {name}
      </span>
    </div>
  );

  // HTML files open directly in a new tab
  if (isHtml) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  );
};

export default GridItem;
