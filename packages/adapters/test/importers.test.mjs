import assert from "node:assert/strict";
import test from "node:test";
import { importCommandOutput } from "../dist/importers.js";

test("importCommandOutput always records evidence", () => {
  const events = importCommandOutput("debug-task", "npm test", "All suites passed.");

  assert.equal(events.length, 1);
  assert.equal(events[0]?.type, "evidence");
  assert.equal(events[0]?.task_id, "debug-task");
  assert.match(events[0]?.payload.summary ?? "", /npm test/);
});

test("importCommandOutput records a failure when output contains a failure signal", () => {
  const events = importCommandOutput("debug-task", "npm test", "Test run failed with exception: boom");

  assert.equal(events.length, 2);
  assert.equal(events[0]?.type, "evidence");
  assert.equal(events[1]?.type, "failure");
  assert.match(events[1]?.payload.summary ?? "", /reported a failure/);
  assert.match(events[1]?.payload.error ?? "", /failed/i);
});
