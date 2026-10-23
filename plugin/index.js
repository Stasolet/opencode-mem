// Wrapper for OpenCode's local-directory plugin loading (dir must contain a
// root index.*; the loader does not read package.json "exports"). Re-exports
// the built V2 plugin entry — build with: bun run build (in repo root).
export { default } from "../dist/v2/plugin.js";
