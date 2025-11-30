import { list } from "@vercel/blob";
import Layout from "../components/Layout";
import GridItem from "../components/GridItem";

export async function getStaticProps() {
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

  const units = Array.from(unitSet).sort();

  return {
    props: { units },
    revalidate: 60, // ISR - revalidate every 60 seconds
  };
}

export default function Home({ units }: { units: string[] }) {
  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Folders</h2>
        {units.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {units.map((unit) => (
              <GridItem
                key={unit}
                type="folder"
                name={unit.replace("-", " ")}
                href={`/${unit}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            <p>No content available yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
