import fs from 'fs';

const content = fs.readFileSync('/home/thanushiyan/.gemini/antigravity/brain/164841d4-0b8d-4280-852d-7eba4ee7696c/.system_generated/logs/overview.txt', 'utf8');

const jsonMatches = content.match(/\[[\s\n]*{[\s\n]*"grade"[\s\S]*?}\n\]/g);
if (jsonMatches && jsonMatches.length > 0) {
    // Get the last match, which is likely the user's most recent payload
    fs.writeFileSync('data.json', jsonMatches[jsonMatches.length - 1]);
    console.log("Successfully extracted to data.json!");
} else {
    console.log("Could not find the JSON payload in the overview.txt log.");
}
