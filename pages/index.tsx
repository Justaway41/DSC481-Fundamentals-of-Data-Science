import fs from "fs";
import path from "path";
import Layout from "../components/Layout";
import GridItem from "../components/GridItem";

export async function getStaticProps() {
  const contentPath = path.join(process.cwd(), "content");
  const units = fs
    .readdirSync(contentPath)
    .filter((f) => fs.statSync(path.join(contentPath, f)).isDirectory());
  return { props: { units } };
}

export default function Home({ units }: { units: string[] }) {
  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Folders</h2>
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
      </div>
    </Layout>
  );
}
