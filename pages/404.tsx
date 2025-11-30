import Link from "next/link";
import Layout from "../components/Layout";

export default function Custom404() {
  return (
    <Layout title="Page Not Found">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}
