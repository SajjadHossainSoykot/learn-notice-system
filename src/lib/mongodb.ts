import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env.local");
}

if (!dbName) {
  throw new Error("MONGODB_DB is missing in .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const client = new MongoClient(uri as string, {
    serverSelectionTimeoutMS: 10000,
  });

  await client.connect();

  const db = client.db(dbName as string);

  cachedClient = client;
  cachedDb = db;

  return {
    client,
    db,
  };
}