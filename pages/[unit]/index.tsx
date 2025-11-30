import fs from "fs";
import path from "path";
import Layout from "../../components/Layout";
import GridItem from "../../components/GridItem";

export async function getStaticPaths() {
  const contentPath = path.join(process.cwd(), "content");
  const units = fs.readdirSync(contentPath).filter(
    (f) =>
      fs.statSync(path.join(contentPath, f)).isDirectory() && f !== "unreleased" // Exclude unreleased folder from public view
  );
  const paths = units.map((unit) => ({ params: { unit } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { unit: string } }) {
  const contentPath = path.join(process.cwd(), "content");
  const unitPath = path.join(contentPath, params.unit);

  // Check if unit exists and is not the unreleased folder
  if (
    !fs.existsSync(unitPath) ||
    !fs.statSync(unitPath).isDirectory() ||
    params.unit === "unreleased"
  ) {
    return { notFound: true };
  }

  // Get all files in the unit directory
  const files = fs.readdirSync(unitPath).filter((f) => !f.startsWith("."));

  return { props: { unit: params.unit, files } };
}

const UnitPage = ({ unit, files }: { unit: string; files: string[] }) => (
  <Layout title={unit.replace(/-/g, " ")}>
    <div className="mb-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Files</h2>
      {files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => {
            const isHtml = file.endsWith(".html");
            const href = isHtml
              ? `/content/${unit}/${file}`
              : `/${unit}/${file}`;
            return (
              <GridItem
                key={file}
                type="file"
                name={file.replace(/-/g, " ")}
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
