const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/components/LanguageContext.tsx', 'utf8');

console.log('Starting duplicate removal within language sections...');

// Function to remove duplicate keys within a language section
function removeDuplicatesInSection(content, languageCode) {
  console.log(`Processing ${languageCode} section...`);
  
  // Find the language section
  const langRegex = new RegExp(`(\\s+${languageCode}:\\s*{[\\s\\S]*?})(?=\\s*},?\\s*(?:[a-z]+:|}))`);
  const match = content.match(langRegex);
  
  if (!match) {
    console.log(`Could not find ${languageCode} section`);
    return content;
  }
  
  const langSection = match[1];
  const lines = langSection.split('\n');
  const seenKeys = new Set();
  const filteredLines = [];
  let duplicatesRemoved = 0;
  
  for (const line of lines) {
    // Check if this line contains a translation key
    const keyMatch = line.match(/^\s*"([^"]+)":\s*".*"[,]?$/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (seenKeys.has(key)) {
        console.log(`  Removing duplicate key: "${key}"`);
        duplicatesRemoved++;
        continue; // Skip this duplicate line
      }
      seenKeys.add(key);
    }
    filteredLines.push(line);
  }
  
  console.log(`  Removed ${duplicatesRemoved} duplicate keys from ${languageCode}`);
  
  const newLangSection = filteredLines.join('\n');
  return content.replace(langSection, newLangSection);
}

// Process each language section
content = removeDuplicatesInSection(content, 'en');
content = removeDuplicatesInSection(content, 'hi');
content = removeDuplicatesInSection(content, 'ta');
content = removeDuplicatesInSection(content, 'te');

console.log('Duplicate removal complete. Writing file...');

// Write the fixed content back
fs.writeFileSync('src/components/LanguageContext.tsx', content);
console.log('Duplicates within language sections removed successfully!');
