const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/components/LanguageContext.tsx', 'utf8');

// Top problematic duplicates - we'll fix these systematically
const topDuplicates = [
  'previous', 'next', 'machinery-title', 'post-jobs', 'export-description',
  'specialization', 'monitoring-description', 'labour-description', 
  'machinery-description', 'contact-description', 'job-description',
  'loans-description', 'footer-text', 'reviews', 'job-type', 'loans-title',
  'worker-hired', 'crop-allocation-description', 'post-job', 'market-description',
  'crop-allocation-title', 'success-rate', 'labor-management', 'job-title',
  'market', 'pay-rate', 'sort-by', 'dashboard-title', 'share', 'plan-crops',
  'view-all', 'market-title', 'dashboard-welcome', 'message-sent', 'export',
  'subsidies-available', 'team-hired', 'location', 'rating', 'dashboard'
];

// For each duplicate, we'll add a suffix to subsequent occurrences
topDuplicates.forEach((key, index) => {
  const regex = new RegExp(`"${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}"\\s*:`, 'g');
  const matches = [...content.matchAll(regex)];
  
  if (matches.length > 1) {
    console.log(`Fixing ${matches.length} occurrences of "${key}"`);
    
    // Replace from the last match backwards to avoid position shifting
    for (let i = matches.length - 1; i >= 1; i--) {
      const match = matches[i];
      const startPos = match.index;
      const endPos = startPos + match[0].length;
      
      // Create a unique suffix for this occurrence
      const suffix = i === 1 ? '-alt' : `-alt${i}`;
      const replacement = `"${key}${suffix}":`;
      
      content = content.substring(0, startPos) + replacement + content.substring(endPos);
    }
  }
});

// Write the fixed content back
fs.writeFileSync('src/components/LanguageContext.tsx', content);
console.log('Top duplicates fixed successfully!');