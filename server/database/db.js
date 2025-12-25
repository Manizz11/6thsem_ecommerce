import mysql from "mysql2/promise";
import { config } from "dotenv";

config({ path: "./config/config.env" });

let database;

try {
  database = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shopmate_db",
    port: process.env.DB_PORT || 3306,
  });
  
  console.log("✅ Connected to MySQL database successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error);
  process.exit(1);
}

export default database;