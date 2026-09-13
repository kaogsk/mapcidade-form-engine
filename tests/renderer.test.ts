import { describe, it, expect } from "vitest";
import { renderFormPage } from "../src/renderer.js";
import { loadFormSchema } from "../src/schema.js";

const schema = loadFormSchema("forms/urban-tree.json");

describe("renderFormPage", () => {
  const html = renderFormPage(schema);

  it("includes the form title and one input per field", () => {
    expect(html).toContain("<h1>Urban Tree Registration</h1>");
    expect(html).toContain('name="species"');
    expect(html).toContain('name="height_m" type="number"');
    expect(html).toContain('name="notes"');
  });

  it("renders a select with all options for a select field", () => {
    expect(html).toContain('<select id="health" name="health" required>');
    expect(html).toContain('<option value="healthy">healthy</option>');
    expect(html).toContain('<option value="declining">declining</option>');
    expect(html).toContain('<option value="dead">dead</option>');
  });

  it("marks required fields but not optional ones", () => {
    expect(html).toContain('id="species" name="species" type="text" required');
    expect(html).not.toContain('id="notes" name="notes" required');
  });
});
