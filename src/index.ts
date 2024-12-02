import { initServer } from "./api";
import { connectToDb } from "./config/database.config";
import dotenv from "dotenv";
import morgan from "morgan";

morgan("tiny", {
  immediate: true,
});

dotenv.config();
connectToDb();

async function startServer() {
  const app = await initServer();

  app.listen(8000, function () {
    console.log("listening on port 8000");
  });
}

startServer();
