import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "DSC481" }) => {
  const router = useRouter();
  const pathSegments = router.asPath.split("/").filter((segment) => segment);

  // Generate breadcrumbs
  const breadcrumbs = React.useMemo(() => {
    const crumbs = [{ label: "Home", href: "/" }];
    let currentPath = "";

    pathSegments.forEach((segment) => {
      if (segment === "unit") return; // Skip "unit" segment
      currentPath += `/${segment}`;
      // Decode URI component to handle spaces and special chars
      const label = decodeURIComponent(segment).replace(/-/g, " ");
      crumbs.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: currentPath });
    });

    return crumbs;
  }, [pathSegments]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-blue-700 transition-colors">
              D
            </div>
            <span className="text-xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              DSC481 Drive
            </span>
          </Link>
          
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center ml-8 text-sm text-gray-500">
             {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <Link
                  href={crumb.href}
                  className={`hover:text-blue-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "font-semibold text-gray-800 pointer-events-none"
                      : ""
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>


      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
