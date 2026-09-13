import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createDb } from "../src/db.js";
import { loadFormSchema } from "../src/schema.js";

const schema = loadFormSchema("forms/urban-tree.json");

describe("mapcidade-form-engine app", () => {
  it("GET /forms/:id renders the form", async () => {
    const app = createApp(schema, createDb(":memory:"));
    const res = await request(app).get("/forms/urban_tree");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Urban Tree Registration");
  });

  it("GET /forms/:id 404s for an unknown form id", async () => {
    const app = createApp(schema, createDb(":memory:"));
    const res = await request(app).get("/forms/nonexistent");
    expect(res.status).toBe(404);
  });

  it("POST /forms/:id/submit rejects an invalid submission with 400", async () => {
    const app = createApp(schema, createDb(":memory:"));
    const res = await request(app).post("/forms/urban_tree/submit").send({ species: "", height_m: "4", health: "healthy" });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('"Species" is required');
  });

  it("POST then GET entries: a valid submission shows up in the entries list", async () => {
    const db = createDb(":memory:");
    const app = createApp(schema, db);

    const post = await request(app)
      .post("/forms/urban_tree/submit")
      .send({ species: "Ipê", height_m: "4.5", health: "healthy", notes: "corner lot" });
    expect(post.status).toBe(201);
    expect(post.body.id).toBeTypeOf("number");

    const entries = await request(app).get("/forms/urban_tree/entries");
    expect(entries.status).toBe(200);
    expect(entries.text).toContain("Ipê");
    expect(entries.text).toContain("corner lot");
  });
});
