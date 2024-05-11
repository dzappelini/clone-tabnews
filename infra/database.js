import { Client } from "pg";

// const fs = require("fs");
const sslCA = Buffer.from(
  process.env.POSTGRES_SSL_CA_BASE64,
  "base64",
).toString("utf-8");

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: sslCA,
    },
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query,
};
