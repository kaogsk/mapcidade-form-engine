import { createApp } from "../src/app.js";
import { createDb } from "../src/db.js";
import schemaData from "../forms/urban-tree.json" with { type: "json" };
import type { FormSchema } from "../src/schema.js";

/**
 * Vercel serverless functions have a read-only filesystem except /tmp, and each cold
 * start gets a fresh one — so submissions here only survive as long as the warm
 * instance does, unlike the local dev server's persistent ./data/submissions.db.
 * That's a disclosed demo limitation (see README), not a bug: this app's point is
 * showing schema-driven rendering/validation, not durable storage.
 */
export default createApp(schemaData as FormSchema, createDb("/tmp/submissions.db"));
