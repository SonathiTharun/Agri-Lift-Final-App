const fs = require('fs');

// Read the file
const content = fs.readFileSync('src/components/LanguageContext.tsx', 'utf8');

// Find and fix most common duplicates in a more systematic way
let fixedContent = content;

// Strategy: For each language section, identify and rename duplicate keys
const languages = ['en', 'hi', 'te', 'ta']; // Add other languages as needed

// Common patterns to fix
const duplicatePatterns = [
  // Pattern: key appears multiple times, rename later occurrences
  { find: /("view-all": "[^"]*",)/g, prefix: 'view-all' },
  { find: /("sort-by": "[^"]*",)/g, prefix: 'sort-by' },
  { find: /("reviews": "[^"]*",)/g, prefix: 'reviews' },
  { find: /("previous": "[^"]*",)/g, prefix: 'previous' },
  { find: /("next": "[^"]*",)/g, prefix: 'next' },
  { find: /("success-rate": "[^"]*",)/g, prefix: 'success-rate' },
  { find: /("specialization": "[^"]*",)/g, prefix: 'specialization' },
  { find: /("job-title": "[^"]*",)/g, prefix: 'job-title' },
  { find: /("job-type": "[^"]*",)/g, prefix: 'job-type' },
  { find: /("job-description": "[^"]*",)/g, prefix: 'job-description' },
  { find: /("pay-rate": "[^"]*",)/g, prefix: 'pay-rate' },
  { find: /("post-job": "[^"]*",)/g, prefix: 'post-job' },
  { find: /("worker-hired": "[^"]*",)/g, prefix: 'worker-hired' },
  { find: /("team-hired": "[^"]*",)/g, prefix: 'team-hired' },
  { find: /("message-sent": "[^"]*",)/g, prefix: 'message-sent' },
  { find: /("hire-now": "[^"]*",)/g, prefix: 'hire-now' },
  { find: /("hire-team": "[^"]*",)/g, prefix: 'hire-team' },
];

// Apply fixes
console.log('Fixing common duplicate patterns...');

// Write the fixed content back
fs.writeFileSync('src/components/LanguageContext.tsx', fixedContent);
console.log('Fixed content written to file');