import React from "react";
import Link from "next/link";

interface SidebarProps {
  units: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ units }) => (
  <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-100 border-r border-gray-200 flex flex-col px-6 py-8 z-20">
    <h1 className="text-xl font-bold mb-8 text-gray-900 leading-tight tracking-tight">
      DSC481
      <span className="block text-sm font-medium text-gray-500 mt-1">
        Fundamentals of Data Science
      </span>
    </h1>
    <nav className="flex-1">
      <ul className="space-y-3">
        {units.map((unit) => (
          <li key={unit}>
            <Link
              href={`/unit/${unit}`}
              className="block px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-200 text-gray-700 font-medium transition-colors shadow-sm"
            >
              {unit.replace("-", " ")}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
