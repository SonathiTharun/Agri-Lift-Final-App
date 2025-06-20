const ocrService = require('./backend/src/services/ocrService');

// Test text that simulates what would be extracted from a soil health card
const testText = `
SOIL HEALTH CARD
Government of India
Ministry of Agriculture & Farmers Welfare

Farmer Name: Test Farmer
Village: Test Village
District: Test District
State: Test State

SOIL ANALYSIS REPORT

pH: 6.8
Nitrogen (N): 145 kg/ha
Phosphorus (P): 28 kg/ha
Potassium (K): 195 kg/ha
Organic Matter: 4.2%
Moisture Content: 35%

RECOMMENDATIONS:
- Soil pH is optimal for most crops
- Nitrogen levels are adequate
- Phosphorus is in good range
- Potassium is sufficient
- Organic matter content is good
- Moisture level is appropriate

Date of Analysis: 2024-01-15
Laboratory: Soil Testing Laboratory
`;

console.log('🧪 Testing OCR Parameter Extraction...\n');

// Test the parameter extraction
const result = ocrService.parseTextToSoilData(testText);

console.log('\n📊 Final Results:');
console.log('Extracted Count:', result.extractedCount);
console.log('Total Parameters:', result.parameters.length);

console.log('\n📋 Parameters:');
result.parameters.forEach(param => {
  console.log(`${param.name}: ${param.value} ${param.unit} (${param.status}) - Extracted: ${param.extracted}`);
});
