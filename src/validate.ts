import type { FormSchema } from "./schema.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data: Record<string, string>;
}

/** Validates a submitted body against the schema: required fields present, select values in range. */
export function validateSubmission(schema: FormSchema, body: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const data: Record<string, string> = {};

  for (const field of schema.fields) {
    const raw = body[field.name];
    const value = raw === undefined || raw === null ? "" : String(raw).trim();

    if (field.required && value === "") {
      errors.push(`"${field.label}" is required`);
      continue;
    }
    if (value === "") continue;

    if (field.type === "number" && Number.isNaN(Number(value))) {
      errors.push(`"${field.label}" must be a number`);
      continue;
    }
    if (field.type === "select" && field.options && !field.options.includes(value)) {
      errors.push(`"${field.label}" must be one of: ${field.options.join(", ")}`);
      continue;
    }

    data[field.name] = value;
  }

  return { valid: errors.length === 0, errors, data };
}
