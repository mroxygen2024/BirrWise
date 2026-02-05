import mongoose from "mongoose";
import { app } from "./app";
import { env } from "./config/env";

async function start() {
  await mongoose.connect(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
