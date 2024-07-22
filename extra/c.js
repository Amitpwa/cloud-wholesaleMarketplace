const express = require('express');
const app = express();
const port = 3000;
const path=require('path');

// Importing the sub-route module
const adminRoute = require('./b');

//Middleware to log the request path for all routes
// app.use((req, res, next) => {
//   console.log(`Main Middleware - Request Path: ${req.path}`);
//   next();
// });

// Define a simple main route for testing
app.get('/user/:id', (req, res) => {
    console.log(`Main route - Request Path: ${req.path}`);
  console.log(`Main Route - baseUrl: ${req.baseUrl}`); // Should be empty
  console.log(`Main Route - originalUrl: ${req.originalUrl}`); // Full path, e.g., /user/123
  console.log(`Main Route - url: ${req.url}`); // Path after the host, e.g., /user/123
  res.send('User route Success!!');
});

// Using the sub-route module
app.use('/admin', adminRoute);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
