# Manual Windows Compatibility Update Instructions

**Last Updated:** 2025-11-04
**Fix Version:** v3.5.0 (Native Windows Support)

## What This Fix Does

This update converts the SessionStart hook from bash to Node.js, providing native Windows support without requiring Git Bash. The fix:

- Uses Node.js built-in modules (os, fs, path) for cross-platform compatibility
- Eliminates dependency on Unix shell commands
- Maintains identical functionality across Windows, macOS, and Linux
- Provides proper Windows path handling

## Prerequisites

- Git installed on Windows
- Node.js installed (should already be installed if Claude Code is working)
- Claude Code with Superpowers plugin installed

## Update Instructions

### Step 1: Locate Your Superpowers Installation

The superpowers plugin is typically installed at:
```
C:\Users\<YourUsername>\.claude-plugins\superpowers@superpowers-marketplace\<version>
```

To find the exact path:
1. Open Claude Code
2. Run: `/plugin list`
3. Note the installation path for superpowers

### Step 2: Backup Your Current Installation

```bash
# Navigate to the superpowers plugin directory
cd "C:\Users\<YourUsername>\.claude-plugins\superpowers@superpowers-marketplace\<version>"

# Create a backup of the hooks directory
cp -r hooks hooks.backup
```

### Step 3: Add the Update Remote

```bash
# Add the update branch as a remote
git remote add windows-fix https://github.com/seanGSISG/superpowers.git

# Fetch the changes
git fetch windows-fix superpowers-js
```

### Step 4: Apply the Update

```bash
# Check your current branch
git branch

# Merge the Windows compatibility changes
git merge windows-fix/superpowers-js --no-ff -m "Apply Windows compatibility fix from seanGSISG/superpowers"
```

If you encounter merge conflicts, the key files that need to be updated are:
- `hooks/session-start.js` (new file)
- `hooks/hooks.json` (update to reference .js instead of .sh)
- `docs/testing/windows-compatibility-test-results.md` (documentation)
- `RELEASE-NOTES.md` (release notes)

### Step 5: Verify the Update

```bash
# Test the new hook directly
node hooks/session-start.js
```

You should see valid JSON output containing:
- `"hookEventName": "SessionStart"`
- `"You have superpowers"` text
- Complete skill content

### Step 6: Restart Claude Code

1. Close and restart Claude Code, or run `/clear` to start a new session
2. Verify you see the session start hook execute without errors
3. Test that skills are accessible via the Skill tool

## Verification Checklist

After updating, verify:

- ✓ No errors on Claude Code session start
- ✓ "You have superpowers" context loads correctly
- ✓ Skills are accessible via `/superpowers:brainstorm` or Skill tool
- ✓ No "command not found" or bash-related errors

## Troubleshooting

### Hook Fails to Execute

If the hook doesn't execute:

```bash
# Verify hooks.json is correct
cat hooks/hooks.json
```

Should show: `"command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.js"`

### Node.js Errors

If you get Node.js errors:

```bash
# Verify Node.js is installed and accessible
node --version

# Should show v16.x or higher
```

### Skills Not Loading

If skills don't load:

```bash
# Verify the skill file exists
ls skills/using-superpowers/SKILL.md
```

## Reverting the Update

If you need to revert to the original bash version:

```bash
# Restore from backup
cd "C:\Users\<YourUsername>\.claude-plugins\superpowers@superpowers-marketplace\<version>"
rm -rf hooks
mv hooks.backup hooks

# Restart Claude Code
```

## Alternative: Direct File Replacement

If git merge is problematic, you can manually replace the files:

### 1. Download the Updated Files

Download these files from https://github.com/seanGSISG/superpowers/tree/superpowers-js:
- `hooks/session-start.js`
- `hooks/hooks.json`

### 2. Replace in Your Installation

```bash
cd "C:\Users\<YourUsername>\.claude-plugins\superpowers@superpowers-marketplace\<version>"

# Backup originals
cp hooks/session-start.sh hooks/session-start.sh.backup
cp hooks/hooks.json hooks/hooks.json.backup

# Copy new files (after downloading)
cp ~/Downloads/session-start.js hooks/
cp ~/Downloads/hooks.json hooks/
```

### 3. Verify and Restart

```bash
node hooks/session-start.js
```

Then restart Claude Code.

## What Changed

### hooks/session-start.js (NEW)
- Node.js implementation replacing bash script
- Cross-platform path handling
- Native Windows support

### hooks/hooks.json (MODIFIED)
- Updated command reference from `.sh` to `.js`
```json
"command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.js"
```

## Getting Help

If you encounter issues:

1. Check the test results: `docs/testing/windows-compatibility-test-results.md`
2. Open an issue at: https://github.com/seanGSISG/superpowers/issues
3. Include:
   - Your Windows version
   - Node.js version (`node --version`)
   - Error messages from Claude Code
   - Output from `node hooks/session-start.js`

## When This Will Be Available Upstream

These changes are pending merge to the upstream obra/superpowers repository. Once merged, you'll be able to update normally through Claude Code's plugin system.

To check if the upstream has merged the changes:
```bash
git fetch upstream
git log upstream/main --oneline | grep -i "windows\|node.js\|session-start.js"
```

## Notes

- This update only changes the hook execution mechanism
- All skills and functionality remain identical
- The update is fully backward compatible with macOS and Linux
- No changes to skill content or behavior
