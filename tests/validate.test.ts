import { describe, it, expect } from "vitest";
import { validateSubmission } from "../src/validate.js";
import { loadFormSchema } from "../src/schema.js";

const schema = loadFormSchema("forms/urban-tree.json");

describe("validateSubmission", () => {
  it("accepts a fully valid submission", () => {
    const result = validateSubmission(schema, { species: "Ipê", height_m: "4.5", health: "healthy", notes: "" });
    expect(result.valid).toBe(true);
    expect(result.data.species).toBe("Ipê");
    expect(result.data.height_m).toBe("4.5");
  });

  it("rejects a missing required field", () => {
    const result = validateSubmission(schema, { species: "", height_m: "4.5", health: "healthy" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('"Species" is required');
  });

  it("rejects a non-numeric value for a number field", () => {
    const result = validateSubmission(schema, { species: "Ipê", height_m: "tall", health: "healthy" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('"Height (m)" must be a number');
  });

  it("rejects a select value outside the allowed options", () => {
    const result = validateSubmission(schema, { species: "Ipê", height_m: "4.5", health: "sparkling" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.startsWith('"Health status" must be one of'))).toBe(true);
  });

  it("allows an optional field to be omitted", () => {
    const result = validateSubmission(schema, { species: "Ipê", height_m: "4.5", health: "healthy" });
    expect(result.valid).toBe(true);
    expect(result.data.notes).toBeUndefined();
  });
});
