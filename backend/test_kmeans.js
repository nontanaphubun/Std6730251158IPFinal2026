const { kMeans1D } = require('./kmeans');

const testCases = [
  {
    name: 'Normal distribution matching exam example',
    salaries: [18000, 19000, 18500, 17500, 19500, 45000, 44000, 46000, 85000, 88000],
    expectedTiers: 3
  },
  {
    name: 'Initial 5 mock employees',
    salaries: [45000, 85000, 18500, 52000, 20000],
    expectedTiers: 3
  },
  {
    name: 'Empty array',
    salaries: [],
    expectedTiers: 3
  },
  {
    name: 'Single salary',
    salaries: [50000],
    expectedTiers: 3
  },
  {
    name: 'All identical salaries',
    salaries: [40000, 40000, 40000, 40000],
    expectedTiers: 3
  }
];

for (const tc of testCases) {
  console.log(`\n--- Test: ${tc.name} ---`);
  const result = kMeans1D(tc.salaries);
  console.log(JSON.stringify(result, null, 2));
}
