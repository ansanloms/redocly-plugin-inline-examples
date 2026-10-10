import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import plugin, { preprocessors } from "./index.ts";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "test/fixtures");

const visitor = preprocessors["inline-examples"]({});
const leave = (target: unknown) => {
  const ctx = {
    location: { source: { absoluteRef: join(fixtures, "operation.yaml") } },
  };
  (visitor.Operation as { leave: (...args: unknown[]) => void }).leave(target, ctx);
};

test("plugin は id と inline-examples preprocessor を持つ", () => {
  const p = plugin();
  assert.equal(p.id, "ansanloms");
  assert.equal(typeof p.preprocessors.oas3["inline-examples"], "function");
});

test("examples 配下の yaml $ref のみ再帰的に展開する", () => {
  const target = {
    requestBody: {
      content: {
        "application/json": {
          schema: { $ref: "./schema.yaml" },
          examples: { a: { $ref: "./examples/request.yaml" } },
        },
      },
    },
    responses: {
      "200": {
        content: {
          "application/json": {
            examples: {
              b: { $ref: "./examples/response.yaml" },
              c: { $ref: "./examples/other.json" },
            },
          },
        },
      },
    },
  };
  leave(target);

  const req = target.requestBody.content["application/json"];
  assert.deepEqual(req.examples.a, {
    value: { id: 1, nested: { name: "child" } },
  });
  assert.deepEqual(req.schema, { $ref: "./schema.yaml" });

  const res = target.responses["200"].content["application/json"];
  assert.deepEqual(res.examples.b, { value: { ok: true } });
  assert.deepEqual(res.examples.c, { $ref: "./examples/other.json" });
});

test("requestBody / responses が無くても例外にならない", () => {
  assert.doesNotThrow(() => leave({}));
});
