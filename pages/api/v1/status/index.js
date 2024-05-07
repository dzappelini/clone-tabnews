import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsResult.rows[0].max_connections;
  const useConnectionsResult = await database.query(
    "SELECT count(*) FROM pg_stat_activity",
  );
  const useConnections = useConnectionsResult.rows[0].count;
  const databaseVersionResult = await database.query("SHOW server_version");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(maxConnections),
        opened_connections: databaseOpenedConnectionsValue,
        use_connections: useConnections,
      },
    },
  });
}

export default status;
