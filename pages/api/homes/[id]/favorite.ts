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

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const user: PrismaTypes.UserSelect = await prisma.user.update({
        where: { email: session?.user?.email },
        data: {
          favoriteHomes: {
            connect: { id },
          },
        },
        include: {
          listedHomes: true,
          favoriteHomes: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "DELETE") {
    try {
      const user: PrismaTypes.UserUpdateInput = await prisma.user.update({
        where: { email: session?.user?.email },
        data: {
          favoriteHomes: {
            disconnect: { id },
          },
        },
        include: {
          listedHomes: true,
          favoriteHomes: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
