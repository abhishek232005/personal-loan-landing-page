import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const crmConfig = {
  crm: {
    host: process.env.CRM_DB_HOST || "localhost",
    port: Number(process.env.CRM_DB_PORT || 3306),
    name: process.env.CRM_DB_NAME || "kuvik_crm",
    user: process.env.CRM_DB_USER || "",
    password: process.env.CRM_DB_PASSWORD || "",
    connectionLimit: Number(process.env.CRM_DB_CONNECTION_LIMIT || 5),
    ssl: process.env.CRM_DB_SSL === "true"
      ? {
          rejectUnauthorized: true,
          ...(process.env.CRM_DB_SSL_CA_PATH
            ? { ca: readFileSync(process.env.CRM_DB_SSL_CA_PATH, "utf8") }
            : {}),
        }
      : undefined,
  },
  salesWebhook: {
    url: process.env.SALES_WEBHOOK_URL || "",
    token: process.env.SALES_WEBHOOK_TOKEN || "",
  },
};

export default crmConfig;
