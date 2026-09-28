import test from "node:test";
import assert from "node:assert/strict";
import { registerNestMatchTools } from "../dist/webmcp.js";

function harness() {
  const tools = new Map(); let current = { id: "home-1" }; let matches = [];
  return { tools, modelContext: { registerTool(tool, options) { tools.set(tool.name, { ...tool, options }); } }, callbacks: { configurePreferences(input) { current = { id: "home-2", role: input.role }; return current; }, readCandidate() { return current; }, recordDecision(id, decision) { if (id !== current.id) throw new Error("stale"); if (decision === "like") matches.push(id); return { candidateId: id, decision }; }, listMatches() { return { count: matches.length, matches }; } } };
}

test("returns unsupported without modelContext", () => { assert.deepEqual(registerNestMatchTools({}), { supported: false, count: 0 }); });
test("requires all callbacks", () => { assert.throws(() => registerNestMatchTools({ modelContext: { registerTool() {} } }), /requires marketplace callbacks/); });
test("registers four tools", () => { const kit = harness(); const result = registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.equal(result.count, 4); assert.equal(kit.tools.size, 4); });
test("uses stable tool names", () => { const kit = harness(); const result = registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.deepEqual(result.names, ["configure_nestmatch_preferences", "read_current_nestmatch_candidate", "record_nestmatch_decision", "list_nestmatch_matches"]); });
test("annotations distinguish reads and writes", () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.equal(kit.tools.get("configure_nestmatch_preferences").annotations.readOnlyHint, false); assert.equal(kit.tools.get("read_current_nestmatch_candidate").annotations.readOnlyHint, true); });
test("passes AbortSignal", () => { const kit = harness(); const controller = new AbortController(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks, signal: controller.signal }); assert.equal(kit.tools.get("list_nestmatch_matches").options.signal, controller.signal); });
test("configuration updates visible state callback", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.equal((await kit.tools.get("configure_nestmatch_preferences").execute({ role: "landlord" })).role, "landlord"); });
test("read tool returns current candidate", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.equal((await kit.tools.get("read_current_nestmatch_candidate").execute({})).id, "home-1"); });
test("decision tool rejects missing candidate", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); await assert.rejects(() => kit.tools.get("record_nestmatch_decision").execute({ decision: "like" }), /candidateId/); });
test("decision tool rejects invalid decision before callback", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); await assert.rejects(() => kit.tools.get("record_nestmatch_decision").execute({ candidateId: "home-1", decision: "hack" }), /decision must/); });
test("valid decision reaches callback", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); assert.equal((await kit.tools.get("record_nestmatch_decision").execute({ candidateId: "home-1", decision: "like" })).decision, "like"); });
test("list tool returns matches", async () => { const kit = harness(); registerNestMatchTools({ modelContext: kit.modelContext, ...kit.callbacks }); await kit.tools.get("record_nestmatch_decision").execute({ candidateId: "home-1", decision: "like" }); assert.equal((await kit.tools.get("list_nestmatch_matches").execute({})).count, 1); });
