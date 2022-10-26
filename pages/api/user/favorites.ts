import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma, PrismaTypes } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session?.user?.email },
        select: {
          favoriteHomes: true,
        },
      });
      res
        .status(200)
        .json(
          user?.favoriteHomes?.map(
            (favorite: PrismaTypes.HomeMaxAggregateOutputType) => favorite.id
          ) ?? []
        );
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
