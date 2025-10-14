import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function getMongoDb() {
  if (cachedDb && cachedClient) return { client: cachedClient, db: cachedDb };
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'app';
  if (!uri) throw new Error('MONGODB_URI is not set');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export async function meetingsCollection() {
  const { db } = await getMongoDb();
  return db.collection('meetings');
}

export async function roomsCollection() {
  const { db } = await getMongoDb();
  return db.collection('rooms');
}

