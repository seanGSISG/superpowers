# Superpowers Hooks

## SessionStart Hook

The SessionStart hook injects the `using-superpowers` skill content into every Claude Code session.

### Current Implementation: Node.js (session-start.js)

**Used by:** `hooks.json` (active)

**Platform Support:**
- ✅ Windows (native)
- ✅ macOS (native)
- ✅ Linux (native)

**Why Node.js:**
- Cross-platform path handling via `path.join()` and `os.homedir()`
- Automatic JSON escaping via `JSON.stringify()`
- No external dependencies (bash, sed, awk)
- Consistent with `.codex/superpowers-codex` implementation

### Legacy Implementation: Bash (session-start.sh)

**Status:** Kept for reference, not used

**Platform Support:**
- ❌ Windows (requires Git Bash)
- ✅ macOS (native)
- ✅ Linux (native)

**Why kept:**
- Reference implementation
- Useful for debugging/comparison
- Historical context

## Switching Between Implementations

To use the bash version (not recommended for Windows):

Edit `hooks/hooks.json`:
```json
"command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
```

To use the Node.js version (recommended, default):
```json
"command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.js"
```

## Testing Hooks

Test hook directly:
```bash
# Node.js version (current)
node hooks/session-start.js

# Bash version (legacy)
bash hooks/session-start.sh
```

Both should produce identical JSON output.
