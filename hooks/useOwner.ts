import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { PrismaTypes } from "@/lib/prisma";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useOwner = (home: PrismaTypes.HomeMaxAggregateOutputType) => {
  const { data: session, status } = useSession();

  const { data } = useSWR(
    status === "authenticated" && home?.id
      ? `/api/homes/${home.id}/owner`
      : null,
    fetcher
  );

  return {
    isOwner: data && session && data?.id === session?.user?.id,
  };
};
