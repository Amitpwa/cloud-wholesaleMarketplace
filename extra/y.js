const express = require('express');
const router = express.Router();

// Sub-route: /admin/dashboard/something
router.get('/', (req, res) => {
    console.log(`Main route - Request Path: ${req.path}`);
  console.log(`Sub-Route Handler in y.js - baseUrl: ${req.baseUrl}`); // Mounted path, e.g., /admin/dashboard
  console.log(`Sub-Route Handler in y.js - originalUrl: ${req.originalUrl}`); // Full path, e.g., /admin/dashboard/something
  console.log(`Sub-Route Handler in y.js - url: ${req.url}`); // Path after the base URL, e.g., /something
  res.send('Admin dashboard something route Success in y.js!!');
});

// Another sub-route in y.js
router.get('/another', (req, res) => {
  console.log(`Sub-Route Handler in y.js - baseUrl: ${req.baseUrl}`); // Mounted path, e.g., /admin/dashboard
  console.log(`Sub-Route Handler in y.js - originalUrl: ${req.originalUrl}`); // Full path, e.g., /admin/dashboard/another
  console.log(`Sub-Route Handler in y.js - url: ${req.url}`); // Path after the base URL, e.g., /another
  res.end();
});

module.exports = router;
