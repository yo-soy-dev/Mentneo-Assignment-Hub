import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@mentneo.com";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hash = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Mentor Admin",
    email,
    password: hash,
    role: "mentor"
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
