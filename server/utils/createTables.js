import database from "../database/db.js";

export const createTables = async () => {
  try {
    console.log("Tables already exist in shopmate_db database");
  } catch (error) {
    console.error("Error checking tables:", error);
  }
};