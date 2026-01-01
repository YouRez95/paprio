import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../constants/env";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  });
}

db = global.__db;

export default db;
