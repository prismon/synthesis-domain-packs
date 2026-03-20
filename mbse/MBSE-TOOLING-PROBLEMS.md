# MBSE Tooling Problems Inventory

An honest inventory of what sucks about current MBSE tools (Cameo Systems Modeler,
Rhapsody, Enterprise Architect, Capella) and the SysML ecosystem in general —
and how this domain pack addresses each problem.

---

## 1. Licensing Cost Barrier

**Problem**: Cameo Systems Modeler runs $5,000–$50,000/seat/year. Enterprise
deployments with Teamwork Cloud add another $15K–$30K/year for server licenses.
This prices out small teams and creates "model gatekeepers" who hold seats.

**Synthesis approach**: Domain packs are YAML configuration — no seat licensing.
Every team member can view and contribute to the model.

---

## 2. Catastrophic Learning Curve

**Problem**: Average time to SysML proficiency: 6–12 months. Most engineers never
get past activity diagrams. The 9 diagram types, stereotype system, profile
mechanism, and OCL constraint language create a cliff that kills adoption.

**Synthesis approach**: Trait-based composition replaces stereotypes. YAML fields
replace OCL. Table views replace diagram-first thinking. The model is navigable
without SysML expertise.

---

## 3. Desktop-Centric, 2000s-Era UX

**Problem**: Cameo and Rhapsody are Swing/Eclipse desktop apps. No real-time
collaboration. File-based model storage with binary formats (.mdzip). The UI
paradigm hasn't evolved since 2005.

**Synthesis approach**: Web-native SPA with React. Real-time collaboration via
MCP. Models stored in PostgreSQL with proper version history.

---

## 4. Model-Code Gap (The Original Sin)

**Problem**: MBSE models diverge from implementation within weeks of initial
creation. No automated synchronization. Manual model maintenance is the #1 reason
MBSE programs fail. Cameo's code generation is fragile and rarely used in
practice.

**Synthesis approach**: AI agents continuously scan codebases and propose model
updates through HITL review. The model stays current because maintenance is
automated, not manual.

---

## 5. Poor Version Control

**Problem**: SysML models are stored as binary XML archives (.mdzip). Merging
branches is a nightmare. Git diff is useless. Teamwork Cloud's version control
is proprietary and doesn't integrate with development workflows.

**Synthesis approach**: Domain items are atomic JSON objects in PostgreSQL. Every
change is individually addressable, diffable, and auditable.

---

## 6. No CI/CD Integration

**Problem**: MBSE tools exist in a silo. No webhook on model change. No
programmatic API worth using. No integration with GitHub Actions, Jenkins, or
GitLab CI. Models can't trigger builds or validate against code.

**Synthesis approach**: MCP-first architecture means every operation is an API
call. AI agents, CI/CD pipelines, and human users all use the same tool surface.

---

## 7. Vendor Lock-In

**Problem**: Each tool uses proprietary formats. Moving from Cameo to Capella
requires complete model recreation. XMI "interoperability" is a joke in practice
— round-tripping between tools loses 20–40% of model fidelity.

**Synthesis approach**: YAML domain packs and JSON domain items are portable,
human-readable, and tool-agnostic.

---

## 8. Diagram Visual Complexity

**Problem**: SysML diagrams become unreadable at scale. A Block Definition Diagram
with 50+ blocks is a spaghetti disaster. Internal Block Diagrams with many ports
are visually overwhelming. The notation itself (9 diagram types, each with unique
visual syntax) is a cognitive tax.

**Synthesis approach**: Multiple view types (table, hierarchy board, reference
graph, tech radar) replace the one-diagram-fits-all mentality. Each view is
optimized for its purpose. Tables for requirements. Graphs for traceability.
Boards for hierarchy.

---

## 9. SysML v1 Semantic Ambiguities

**Problem**: SysML v1 inherits UML's semantic gaps. The difference between
«block» and «class» is confused. Allocation semantics are vague. The stereotype
mechanism is overloaded for everything from domain concepts to tool extensions.
Profile compatibility between tools is poor.

**Synthesis approach**: Explicit typed definitions replace stereotypes. Each
artifact type (block, requirement, activity) has a clear schema with typed fields.
No ambiguity.

---

## 10. Collaboration is an Afterthought

**Problem**: Cameo's Teamwork Cloud enables "check-out/check-in" collaboration —
a model from the CVS era. No real-time co-editing. Merge conflicts require a
specialist to resolve. Remote teams struggle with model access.

**Synthesis approach**: Multi-tenant web platform with concurrent access. No
checkout locks. Conflict resolution at the field level.

---

## 11. Requirements Traceability is Manual

**Problem**: In Cameo, traceability relationships (derive, satisfy, verify) must
be manually created and maintained. A single requirement change can invalidate
dozens of trace links. Impact analysis requires expensive manual review.

**Synthesis approach**: Reference kinds with typed constraints enforce traceability
at the schema level. The V-model traceability view automatically shows the full
chain: need → requirement → block → test case.

---

## 12. No Incremental Adoption Path

**Problem**: MBSE tools demand all-or-nothing adoption. You can't start with
"just requirements" and add structural modeling later. The tool assumes you're
doing full SysML from day one. This creates a 12-month runway before any value.

**Synthesis approach**: Domain packs are composable. Start with requirements only.
Add blocks when ready. Add verification when mature. Each domain pack is
independent with optional cross-domain references.

---

## 13. Parametric Analysis is Disconnected

**Problem**: Cameo's parametric diagrams look great in demos but rarely connect
to actual analysis tools. Binding constraint parameters to Simulink or MATLAB
requires expensive plugins (Cameo Simulation Toolkit) and fragile integrations.

**Synthesis approach**: Constraints are data — equations, parameters, and results
stored as domain items. Integration with analysis tools happens through MCP tools,
not proprietary plugins.

---

## 14. Enterprise Architect: Cheap But Shallow

**Problem**: Enterprise Architect (Sparx) is the budget alternative ($229/seat)
but its SysML support is incomplete, rendering is ugly, and the database backend
is fragile. It's a UML tool with a SysML skin. Serious MBSE practitioners avoid
it.

**Synthesis approach**: First-class MBSE domain model with proper traceability,
not a skin on a generic diagramming tool.

---

## 15. Capella: Good Ideas, Arcane UX

**Problem**: Capella (Eclipse-based, ARCADIA methodology) has excellent
architecture decomposition concepts but imposes a rigid methodology and Eclipse's
notoriously poor UX. It's free but costs more in training and adoption friction.

**Synthesis approach**: Methodology-neutral domain model. The MBSE domain pack
supports V-model traceability but doesn't force a specific process.

---

## 16. SysML v2: Promise Unfulfilled

**Problem**: SysML v2 was supposed to fix everything with a text-based language
and API-first approach. But after 8+ years of specification work, tool support
is nascent. No major vendor fully supports SysML v2. The specification is over
400 pages and still has conformance gaps.

**Synthesis approach**: We took the good ideas from SysML v2 (text-based, API-first,
usage-definition pattern) and implemented them now in a shipping product, without
waiting for the OMG specification process to conclude.

---

## Summary: Why MBSE Fails

The common thread: **MBSE tools optimize for model fidelity at the expense of
adoption**. They assume that if you build a perfect meta-model, engineers will
fill it in. In practice:

1. The learning curve kills adoption
2. Manual maintenance kills currency
3. Desktop isolation kills collaboration
4. Licensing costs kill scale
5. Vendor lock-in kills portability

The Synthesis MBSE domain pack inverts every assumption: web-native, AI-maintained,
trait-composed, YAML-configured, and MCP-accessible. The model serves the team,
not the other way around.
