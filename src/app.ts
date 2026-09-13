import express, { type Express } from "express";
import type { DatabaseSync } from "node:sqlite";
import type { FormSchema } from "./schema.js";
import { renderFormPage } from "./renderer.js";
import { validateSubmission } from "./validate.js";
import { insertSubmission, listSubmissions } from "./db.js";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderEntriesPage(schema: FormSchema, db: DatabaseSync): string {
  const submissions = listSubmissions(db, schema.id);
  const rows = submissions
    .map(
      (s) =>
        `<tr><td>${s.id}</td><td>${escapeHtml(s.submittedAt)}</td>` +
        schema.fields.map((f) => `<td>${escapeHtml(s.data[f.name] ?? "")}</td>`).join("") +
        `</tr>`,
    )
    .join("\n");
  const headerCells = schema.fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join("");

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>${escapeHtml(schema.title)} — Entries</title>
<style>body{font-family:system-ui,sans-serif;max-width:50rem;margin:2rem auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:0.4rem;text-align:left}</style>
</head>
<body>
  <h1>${escapeHtml(schema.title)} — Entries</h1>
  <p><a href="/forms/${schema.id}">Back to form</a></p>
  <table><thead><tr><th>ID</th><th>Submitted</th>${headerCells}</tr></thead><tbody>${rows}</tbody></table>
</body>
</html>
`;
}

/** Builds the Express app for one form schema + injected db — testable without a real HTTP server. */
export function createApp(schema: FormSchema, db: DatabaseSync): Express {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (_req, res) => res.redirect(`/forms/${schema.id}`));

  app.get("/forms/:formId", (req, res) => {
    if (req.params.formId !== schema.id) return res.status(404).send("form not found");
    res.type("html").send(renderFormPage(schema));
  });

  app.post("/forms/:formId/submit", (req, res) => {
    if (req.params.formId !== schema.id) return res.status(404).send("form not found");
    const result = validateSubmission(schema, req.body as Record<string, unknown>);
    if (!result.valid) return res.status(400).json({ errors: result.errors });
    const id = insertSubmission(db, schema.id, result.data);
    res.status(201).json({ id, data: result.data });
  });

  app.get("/forms/:formId/entries", (req, res) => {
    if (req.params.formId !== schema.id) return res.status(404).send("form not found");
    res.type("html").send(renderEntriesPage(schema, db));
  });

  return app;
}
