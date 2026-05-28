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
  return client.db("GiftLink");
}

export async function getClient() {
  await client.connect();
  return client;
}
