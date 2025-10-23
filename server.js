// server.js - Entry point for Render
delete process.env.DEBUG_URL; // remove Render's injected DEBUG_URL
require("./backend/index.js");        // load the app after cleanup