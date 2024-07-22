const express = require('express');
const router = express.Router();

// Importing the sub-route y.js
const yRoute = require('./y');

// Middleware to log the request path within the sub-route
// router.use((req, res, next) => {
//   console.log(`Sub-Route Middleware - baseUrl: ${req.baseUrl}`); // Mounted path, e.g., /admin
//   console.log(`Sub-Route Middleware - originalUrl: ${req.originalUrl}`); // Full path, e.g., /admin/dashboard
//   console.log(`Sub-Route Middleware - url: ${req.url}`); // Path after the base URL, e.g., /dashboard
//   next();
// });

// Previous routing in b.js
// Sub-route: /admin/dashboard
router.get('/a', (req, res) => {
     console.log(`sub route - Request Path: ${req.path}`);
  console.log(`Sub-Route Handler - baseUrl: ${req.baseUrl}`); // Mounted path, e.g., /admin/dashboard
   console.log(`Sub-Route Handler - originalUrl: ${req.originalUrl}`); // Full path, e.g., /admin/dashboard
   console.log(`Sub-Route Handler - url: ${req.url}`); // Path after the base URL, e.g., /dashboard
     res.send('Admin dashboard route Success!!');
});

// Additional sub-route: /admin/settings
router.get('/settings', (req, res) => {
     console.log(`sub route - Request Path: ${req.path}`);
  console.log(`Sub-Route Handler - baseUrl: ${req.baseUrl}`); // Mounted path, e.g., /admin
  console.log(`Sub-Route Handler - originalUrl: ${req.originalUrl}`); // Full path, e.g., /admin/settings
  console.log(`Sub-Route Handler - url: ${req.url}`); // Path after the base URL, e.g., /settings
     res.send('Admin settings route Success!!');
});

// Routing to y.js
// Sub-route: /admin/dashboard/something
router.use('/dashboard', yRoute);

module.exports = router;
