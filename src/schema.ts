import { readFileSync } from "node:fs";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
}

export function loadFormSchema(path: string): FormSchema {
  const raw = JSON.parse(readFileSync(path, "utf-8")) as FormSchema;
  if (!raw.id || !raw.title || !Array.isArray(raw.fields) || raw.fields.length === 0) {
    throw new Error(`invalid form schema at ${path}: needs id, title, and a non-empty fields array`);
  }
  return raw;
}
