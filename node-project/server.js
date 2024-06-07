const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { CosmosClient } = require("@azure/cosmos");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;
app.use(json());

const endpoint = process.env.COSMOSENDPOINT;
const key = process.env.COSMOSKEY;

if (!endpoint || !key) {
  console.error(
    "Please provide the Cosmos DB endpoint and key in the .env file."
  );
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });
const databaseId = "CopilotDB";
const containerId = "CopilotContainer";

const database = client.database(databaseId);
const container = database.container(containerId);

app.get("/", (req, res) => {
  res.send("Welocome to Copilot.");
});

app.post("/query", async (req, res) => {
  const { query } = req.body;
  const { resources } = await container.items.query(query).fetchAll();
  res.status(200).json(resources);
});

async function addSampleData() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
  });

  const sampleData = [
    { id: "1", name: "John Doe", role: "Developer" },
    { id: "2", name: "Jane Smith", role: "Manager" },
    // Add more sample data as needed
  ];

  for (const item of sampleData) {
    await container.items.create(item);
  }
}

addSampleData().catch((err) => {
  console.error(err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
