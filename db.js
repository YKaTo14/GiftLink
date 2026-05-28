import dotenv from "dotenv";

dotenv.config();

const dbName = "giftdb";

const client = {
  async connect() {
    return this;
  },
  db(name) {
    return { name };
  },
};

export async function connectToDatabase() {
  await client.connect();
  return client.db(dbName);
}

export async function getClient() {
  await client.connect();
  return client;
}
