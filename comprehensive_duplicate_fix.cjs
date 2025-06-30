const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/components/LanguageContext.tsx', 'utf8');

console.log('Starting comprehensive duplicate removal...');

// Function to extract and clean a language section
function cleanLanguageSection(content, langCode) {
  console.log(`Processing ${langCode} section...`);
  
  // Find the start and end of the language section
  const startPattern = new RegExp(`\\s+${langCode}:\\s*{`);
  const startMatch = content.search(startPattern);
  
  if (startMatch === -1) {
    console.log(`Could not find start of ${langCode} section`);
    return content;
  }
  
  // Find the end of this language section (next language or end of object)
  let braceCount = 0;
  let inSection = false;
  let sectionStart = -1;
  let sectionEnd = -1;
  
  for (let i = startMatch; i < content.length; i++) {
    const char = content[i];
    
    if (char === '{') {
      if (!inSection) {
        inSection = true;
        sectionStart = i + 1;
      }
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && inSection) {
        sectionEnd = i;
        break;
      }
    }
  }
  
  if (sectionStart === -1 || sectionEnd === -1) {
    console.log(`Could not find boundaries of ${langCode} section`);
    return content;
  }
  
  const sectionContent = content.substring(sectionStart, sectionEnd);
  const lines = sectionContent.split('\n');
  
  const seenKeys = new Set();
  const cleanedLines = [];
  let duplicatesRemoved = 0;
  
  for (const line of lines) {
    // Check if this line contains a translation key
    const keyMatch = line.match(/^\s*"([^"]+)":\s*".*"[,]?\s*$/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (seenKeys.has(key)) {
        console.log(`  Removing duplicate key: "${key}"`);
        duplicatesRemoved++;
        continue; // Skip this duplicate line
      }
      seenKeys.add(key);
    }
    cleanedLines.push(line);
  }
  
  console.log(`  Removed ${duplicatesRemoved} duplicate keys from ${langCode}`);
  
  const cleanedSection = cleanedLines.join('\n');
  const before = content.substring(0, sectionStart);
  const after = content.substring(sectionEnd);
  
  return before + cleanedSection + after;
}

// Process each language section
content = cleanLanguageSection(content, 'en');
content = cleanLanguageSection(content, 'hi');
content = cleanLanguageSection(content, 'ta');
content = cleanLanguageSection(content, 'te');

console.log('Comprehensive duplicate removal complete. Writing file...');

// Write the fixed content back
fs.writeFileSync('src/components/LanguageContext.tsx', content);
console.log('All duplicates removed successfully!');
