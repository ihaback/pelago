import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import Grid from "@/components/Grid";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: {
      favoritedBy: { some: { email: session?.user?.email } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
};

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your favorites</h1>
      <p className="text-gray-500">Manage your favorites</p>
      <div className="mt-8">
        <Grid homes={homes} showOnlyFavourites />
      </div>
    </Layout>
  );
};

export default Favorites;
