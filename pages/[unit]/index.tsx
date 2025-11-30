import { list } from "@vercel/blob";
import Layout from "../../components/Layout";
import GridItem from "../../components/GridItem";

export async function getStaticPaths() {
  const { blobs } = await list();

  // Get unique top-level folders (excluding unreleased)
  const unitSet = new Set<string>();
  for (const blob of blobs) {
    if (blob.pathname.startsWith("unreleased/")) continue;
    const parts = blob.pathname.split("/");
    if (parts.length > 1) {
      unitSet.add(parts[0]);
    }
  }

  const paths = Array.from(unitSet).map((unit) => ({ params: { unit } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { unit: string } }) {
  // Don't allow access to unreleased folder
  if (params.unit === "unreleased") {
    return { notFound: true };
  }

  const { blobs } = await list({ prefix: `${params.unit}/` });

  // Filter out .gitkeep and get file names
  const files = blobs
    .filter((blob) => !blob.pathname.endsWith(".gitkeep"))
    .map((blob) => {
      const parts = blob.pathname.split("/");
      return {
        name: parts[parts.length - 1],
        url: blob.url,
      };
    });

  if (files.length === 0) {
    // Check if the unit exists at all
    const { blobs: allBlobs } = await list();
    const unitExists = allBlobs.some(
      (b) =>
        b.pathname.startsWith(`${params.unit}/`) &&
        !b.pathname.startsWith("unreleased/"),
    );

    if (!unitExists) {
      return { notFound: true };
    }
  }

  return {
    props: {
      unit: params.unit,
      files: files.map((f) => ({ name: f.name, url: f.url })),
    },
    revalidate: 60, // ISR - revalidate every 60 seconds
  };
}

interface FileInfo {
  name: string;
  url: string;
}

const UnitPage = ({ unit, files }: { unit: string; files: FileInfo[] }) => (
  <Layout title={unit.replace(/-/g, " ")}>
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Files</h2>
      {files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => {
            const isHtml = file.name.endsWith(".html");
            // For HTML files, link directly to blob URL; for others, use internal route
            const href = isHtml ? file.url : `/${unit}/${file.name}`;
            return (
              <GridItem
                key={file.name}
                type="file"
                name={file.name.replace(/-/g, " ")}
                href={href}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          <p>This folder is empty</p>
        </div>
      )}
    </div>
  </Layout>
);

export default UnitPage;
