import dotenv from "dotenv";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });
process.env.LOG_LEVEL = "silent";

const [{ default: pool }, { createApp }] = await Promise.all([
  import("./src/database/pool.js"),
  import("./src/index.js"),
]);
const server = createApp({ serveFrontend: false }).listen(0, "127.0.0.1");

async function request(path, options) {
  const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
  return { status: response.status, body: await response.text() };
}

try {
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  await pool.query("SELECT 1");
  const health = await request("/api/health");
  assert.equal(health.status, 200);
  assert.deepEqual(JSON.parse(health.body), { status: "ok" });
  console.log("PASS database and API health");

  const invalidOtpInput = await request("/api/otp/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.CLIENT_ORIGIN,
    },
    body: JSON.stringify({ mobile: "0000000000", consent: true }),
  });
  assert.equal(invalidOtpInput.status, 400);
  assert.equal(
    JSON.parse(invalidOtpInput.body).error,
    "Enter a valid Indian mobile number.",
  );
  console.log("PASS OTP endpoint validates phone number and returns client-readable errors");

  const corsPreflight = await fetch(`http://127.0.0.1:${server.address().port}/api/otp/send`, {
    method: "OPTIONS",
    headers: {
      Origin: process.env.CLIENT_ORIGIN,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  });
  assert.equal(corsPreflight.status, 204);
  assert.equal(corsPreflight.headers.get("access-control-allow-origin"), process.env.CLIENT_ORIGIN);
  console.log("PASS OTP CORS preflight allows the configured frontend origin");

  const malformed = await request("/api/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not-json",
  });
  assert.equal(malformed.status, 400);
  console.log("PASS malformed request returns 400");

  const noConsent = await request("/api/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile: "9876543210", consent: false }),
  });
  assert.equal(noConsent.status, 400);
  console.log("PASS OTP requests require consent");

  for (const path of ["/api/admin/login", "/api/admin/leads"]) {
    const removedAdminApi = await request(path);
    assert.equal(removedAdminApi.status, 404);
  }
  console.log("PASS removed admin API routes return 404");

  console.log("PASS API validation does not require opening a CRM database connection");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
}
