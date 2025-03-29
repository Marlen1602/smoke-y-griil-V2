import dotenv from "dotenv";
dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "default_secret";


export const MYSQL_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smokeygrill",
  port: process.env.DB_PORT || 3306
};
