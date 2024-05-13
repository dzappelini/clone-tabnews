import { Client } from "pg";

// for use with aiven.io
// const sslCA = Buffer.from(
//   process.env.POSTGRES_SSL_CA_BASE64,
//   "base64",
// ).toString("utf-8");

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
    // ssl: process.env.NODE_ENV === "development" ? true : true,

    // for use with aiven.io
    // ssl: {
    //   rejectUnauthorized: true,
    //   ca: sslCA,
    // },
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

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "development" ? true : true;
}
