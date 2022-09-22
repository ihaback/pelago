import { GetServerSideProps } from "next";

import Grid from "@/components/Grid";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const homes = await prisma.home.findMany({ orderBy: { createdAt: "desc" } });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
};

export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the most beatiful nature in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}
