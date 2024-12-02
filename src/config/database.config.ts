import mongoose from "mongoose";

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb://admin:admin@localhost:27017/raftlabs?authSource=admin",
      {}
    );
    console.log("connected to db");
  } catch (error) {
    console.error("Error connecting mongoose", error);
    process.exit(1);
  }
}

export { connectToDb };
