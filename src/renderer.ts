import type { FormField, FormSchema } from "./schema.js";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderField(field: FormField): string {
  const requiredAttr = field.required ? " required" : "";
  const requiredMark = field.required ? ' <span class="required">*</span>' : "";
  const label = `<label for="${field.name}">${escapeHtml(field.label)}${requiredMark}</label>`;

  let control: string;
  switch (field.type) {
    case "select": {
      const options = (field.options ?? [])
        .map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`)
        .join("");
      control = `<select id="${field.name}" name="${field.name}"${requiredAttr}><option value="">-- select --</option>${options}</select>`;
      break;
    }
    case "textarea":
      control = `<textarea id="${field.name}" name="${field.name}"${requiredAttr}></textarea>`;
      break;
    case "number":
      control = `<input id="${field.name}" name="${field.name}" type="number"${requiredAttr} />`;
      break;
    case "text":
    default:
      control = `<input id="${field.name}" name="${field.name}" type="text"${requiredAttr} />`;
      break;
  }

  return `<div class="field">${label}${control}</div>`;
}

/** Renders a full HTML page for the form, purely from its JSON schema — no per-form template needed. */
export function renderFormPage(schema: FormSchema): string {
  const fieldsHtml = schema.fields.map(renderField).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(schema.title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; }
    .field { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem; }
    label { font-weight: 600; }
    .required { color: #b00020; }
    input, select, textarea { padding: 0.4rem; font-size: 1rem; }
  </style>
</head>
<body>
  <h1>${escapeHtml(schema.title)}</h1>
  <form method="post" action="/forms/${schema.id}/submit">
${fieldsHtml}
    <button type="submit">Submit</button>
  </form>
  <p><a href="/forms/${schema.id}/entries">View submitted entries</a></p>
</body>
</html>
`;
}
