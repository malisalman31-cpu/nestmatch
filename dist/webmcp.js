export function registerNestMatchTools({ modelContext, configurePreferences, readCandidate, recordDecision, listMatches, signal }) {
  if (!modelContext?.registerTool) return { supported: false, count: 0 };
  if (![configurePreferences, readCandidate, recordDecision, listMatches].every((callback) => typeof callback === "function")) throw new Error("WebMCP registration requires marketplace callbacks.");
  const tools = [
    {
      name: "configure_nestmatch_preferences",
      title: "Configure NestMatch preferences",
      description: "Update renter or landlord preferences and refresh the visibly ranked candidate feed.",
      inputSchema: { type: "object", properties: { role: { type: "string", enum: ["renter", "landlord"] }, budget: { type: "number" }, commute: { type: "number" }, homeType: { type: "string", enum: ["Any", "Apartment", "House", "Loft"] }, petFriendly: { type: "boolean" }, minIncome: { type: "number" }, moveWithin: { type: "number" }, petPolicy: { type: "string", enum: ["Either", "Yes", "No"] }, minStay: { type: "number" } }, required: ["role"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) { return configurePreferences(input); },
    },
    {
      name: "read_current_nestmatch_candidate",
      title: "Read current NestMatch candidate",
      description: "Read the currently displayed rental or renter candidate with score factors and reasons.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute() { return readCandidate(); },
    },
    {
      name: "record_nestmatch_decision",
      title: "Record NestMatch decision",
      description: "Pass, save, or express private interest in the currently visible candidate and update the visible feed.",
      inputSchema: { type: "object", properties: { candidateId: { type: "string" }, decision: { type: "string", enum: ["pass", "save", "like"] } }, required: ["candidateId", "decision"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (!input?.candidateId) throw new Error("candidateId is required.");
        if (!["pass", "save", "like"].includes(input?.decision)) throw new Error("decision must be pass, save, or like.");
        return recordDecision(input.candidateId, input.decision);
      },
    },
    {
      name: "list_nestmatch_matches",
      title: "List NestMatch matches",
      description: "Read reciprocal matches that have formed in the current local workspace.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute() { return listMatches(); },
    },
  ];
  for (const tool of tools) void Promise.resolve(modelContext.registerTool(tool, signal ? { signal } : undefined)).catch(() => {});
  return { supported: true, count: tools.length, names: tools.map((tool) => tool.name) };
}
