import { prisma } from "./lib/prisma";

declare global {
  var prisma: prisma; // This must be a `var` and not a `let / const`
}
