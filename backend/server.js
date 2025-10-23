// server.js - Entry point that deletes DEBUG_URL before loading the main app
delete process.env.DEBUG_URL;
require("./index.js");
