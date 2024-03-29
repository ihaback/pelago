import axios from "axios";
import { useOwner } from "hooks/useOwner";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "@/components/Layout";
import { prisma, PrismaTypes } from "@/lib/prisma";

const ListedHome = (home: PrismaTypes.HomeMaxAggregateOutputType) => {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  const { isOwner } = useOwner(home);

  const deleteHome = async () => {
    let toastId;
    try {
      toastId = toast.loading("Deleting...");
      setDeleting(true);
      await axios.delete(`/api/homes/${home.id}`);
      toast.success("Successfully deleted", { id: toastId });
      router.push("/homes");
    } catch (e) {
      toast.error("Unable to delete home", { id: toastId });
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ""}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>
          {isOwner ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => router.push(`/homes/${home.id}/edit`)}
                className="px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={deleteHome}
                className="rounded-md border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:outline-none transition disabled:bg-primary-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title ?? ""}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{home?.description ?? ""}</p>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const homes = await prisma.home.findMany({
    select: { id: true },
  });

  return {
    paths: homes.map((home: PrismaTypes.HomeMaxAggregateOutputType) => ({
      params: { id: home.id },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const home = await prisma.home.findUnique({
    where: { id: params?.id },
  });

  if (home) {
    return {
      props: JSON.parse(JSON.stringify(home)),
      revalidate: 20,
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default ListedHome;
