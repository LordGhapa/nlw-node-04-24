// api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var db = new PrismaClient({
  log: ["query"]
});

export {
  db
};
