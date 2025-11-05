#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine plugin root directory using __dirname
const scriptDir = __dirname;
const pluginRoot = path.resolve(scriptDir, '..');

// Get home directory (cross-platform)
const homeDir = os.homedir();

// Main execution
try {
    main();
} catch (error) {
    console.error(JSON.stringify({
        hookSpecificOutput: {
            hookEventName: "SessionStart",
            additionalContext: `Error in SessionStart hook: ${error.message}`
        }
    }));
    process.exit(1);
}

function main() {
    // Check if legacy skills directory exists and build warning
    const legacySkillsDir = path.join(homeDir, '.config', 'superpowers', 'skills');
    let warningMessage = '';

    if (fs.existsSync(legacySkillsDir)) {
        warningMessage = '\n\n<important-reminder>IN YOUR FIRST REPLY AFTER SEEING THIS MESSAGE YOU MUST TELL THE USER:⚠️ **WARNING:** Superpowers now uses Claude Code\'s skills system. Custom skills in ~/.config/superpowers/skills will not be read. Move custom skills to ~/.claude/skills instead. To make this message go away, remove ~/.config/superpowers/skills</important-reminder>';
    }

    // Read using-superpowers content
    const skillFile = path.join(pluginRoot, 'skills', 'using-superpowers', 'SKILL.md');
    let skillContent = '';

    try {
        skillContent = fs.readFileSync(skillFile, 'utf8');
    } catch (error) {
        skillContent = `Error reading using-superpowers skill: ${error.message}`;
    }

    // Build additional context string
    const additionalContext =
        '<EXTREMELY_IMPORTANT>\n' +
        'You have superpowers.\n\n' +
        '**Below is the full content of your \'superpowers:using-superpowers\' skill - your introduction to using skills. For all other skills, use the \'Skill\' tool:**\n\n' +
        skillContent +
        '\n\n' +
        warningMessage +
        '\n</EXTREMELY_IMPORTANT>';

    // Output hook result as JSON
    const output = {
        hookSpecificOutput: {
            hookEventName: 'SessionStart',
            additionalContext: additionalContext
        }
    };

    console.log(JSON.stringify(output, null, 2));
}
