// Vercel Serverless Function entry point.
// This forwards all incoming /api requests to the Express backend application.

const app = require("../backend/app");

module.exports = app;
