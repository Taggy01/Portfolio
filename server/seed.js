import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "0.0.0.0"]);

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding in production");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding");

    const existingAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (existingAdmin) {
      console.log("Admin already exists");
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await Admin.create({ email: email.trim().toLowerCase(), password });
    console.log(`Admin created successfully with email: ${admin.email}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`Seeding error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
