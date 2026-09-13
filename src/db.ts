import { DatabaseSync } from "node:sqlite";
import { existsSync, unlinkSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export interface Submission {
  id: number;
  formId: string;
  data: Record<string, string>;
  submittedAt: string;
}

export function createDb(path = "./data/submissions.db"): DatabaseSync {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
    if (existsSync(path)) unlinkSync(path);
  }
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      submitted_at TEXT NOT NULL
    );
  `);
  return db;
}

export function insertSubmission(db: DatabaseSync, formId: string, data: Record<string, string>): number {
  const stmt = db.prepare("INSERT INTO submissions (form_id, data_json, submitted_at) VALUES (?, ?, ?) RETURNING id");
  const rows = stmt.all(formId, JSON.stringify(data), new Date().toISOString()) as { id: number }[];
  return rows[0].id;
}

export function listSubmissions(db: DatabaseSync, formId: string): Submission[] {
  const rows = db
    .prepare("SELECT id, form_id, data_json, submitted_at FROM submissions WHERE form_id = ? ORDER BY id DESC")
    .all(formId) as { id: number; form_id: string; data_json: string; submitted_at: string }[];
  return rows.map((r) => ({
    id: r.id,
    formId: r.form_id,
    data: JSON.parse(r.data_json) as Record<string, string>,
    submittedAt: r.submitted_at,
  }));
}
