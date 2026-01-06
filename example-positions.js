// Example showing position tracking
const config = {
  apiEndpoint: '/api/v1/users',           // Line 3
  awsKey: 'AKIAIOSFODNN7EXAMPLE',          // Line 4
  email: 'admin@example.com',              // Line 5
  dbUrl: 'mongodb://user:pass@db:27017',   // Line 6
};

const urls = [
  'https://api.github.com/repos',          // Line 10
  'https://bucket.s3.amazonaws.com/data',  // Line 11
];

// This will produce output like:
// {
//   "category": "endpoints",
//   "value": "/api/v1/users",
//   "source": "example-positions.js",
//   "position": { "line": 3, "column": 17 }
// }
