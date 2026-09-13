import { pathToFileURL } from "node:url";
import { createApp } from "./app.js";
import { createDb } from "./db.js";
import { loadFormSchema } from "./schema.js";

function main(): void {
  const schema = loadFormSchema("forms/urban-tree.json");
  const db = createDb();
  const app = createApp(schema, db);
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`mapcidade-form-engine listening on http://localhost:${port}/forms/${schema.id}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
