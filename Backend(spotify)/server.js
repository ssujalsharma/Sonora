require('dotenv').config();
const app = require("./src/app");
const connectDB = require('./src/db/db');

async function start() {
  try {
    await connectDB();
    const server = app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
    server.on('error', (err) => {
      console.error("Server listen error:", err);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

start();