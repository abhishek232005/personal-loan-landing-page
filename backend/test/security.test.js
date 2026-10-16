import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

process.env.DB_HOST = "localhost";
process.env.DB_NAME = "kuvik_test";
process.env.DB_USER = "kuvik_test";
process.env.DB_PASSWORD = "test-only";
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.JWT_SECRET = randomBytes(32).toString("hex");
process.env.DATA_ENCRYPTION_KEY = randomBytes(32).toString("hex");
process.env.PHONE_HASH_SECRET = randomBytes(32).toString("hex");
process.env.OTP_HASH_SECRET = randomBytes(32).toString("hex");
process.env.NODE_ENV = "test";
process.env.SMS_TEST_MODE = "false";
process.env.SMS_PROVIDER = "msg91";
process.env.SMS_API_URL = "https://control.msg91.com/api/v5/otp";
process.env.SMS_API_TOKEN = "test-msg91-auth-key";
process.env.SMS_TEMPLATE_ID = "test-approved-template";
const security = await import("../src/services/security.js");
const {
  createLeadSchema,
  updateLeadSchema,
  verifyOtpSchema,
} = await import("../src/validation/schemas.js");

test("normalizes Indian mobile numbers without changing their identity", () => {
  assert.equal(security.normalizeMobile("9876543210"), "9876543210");
  assert.equal(security.normalizeMobile("+91 98765 43210"), "9876543210");
  assert.throws(() => security.normalizeMobile("1234567890"));
});

test("encrypts and decrypts sensitive fields with authenticated encryption", () => {
  const pan = "ABCDE1234F";
  const encrypted = security.encrypt(pan);
  assert.notEqual(encrypted.ciphertext, pan);
  assert.equal(security.decrypt(encrypted.ciphertext, encrypted.iv, encrypted.tag), pan);
  assert.throws(() => security.decrypt(encrypted.ciphertext, encrypted.iv, "00".repeat(16)));
});

test("generates a fresh four-digit code and compares only its keyed hash", () => {
  const mobileHash = security.hashPhone("9876543210");
  const code = security.createOtp();
  const hash = security.hashOtp(mobileHash, code);
  assert.match(code, /^\d{4}$/);
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.notEqual(hash, code);
  assert.equal(security.isEqualHash(hash, security.hashOtp(mobileHash, code)), true);
  assert.equal(security.isEqualHash(hash, security.hashOtp(mobileHash, "0000")), false);
});

test("validates lead profile fields and rejects malformed PAN or income", () => {
  assert.equal(createLeadSchema.safeParse({
    name: "Asha Kumar",
    mobile: "9876543210",
    consent: true,
  }).success, true);
  assert.equal(updateLeadSchema.safeParse({
    employmentType: "salaried",
    monthlyIncome: 50000,
    city: "Mumbai",
    pan: "ABCDE1234F",
    requestedAmount: 500000,
    attribution: {
      pageUrl: "https://kuvikloans.com/",
      utmSource: "newsletter",
    },
  }).success, true);
  assert.equal(updateLeadSchema.safeParse({
    employmentType: "salaried",
    monthlyIncome: -100,
    city: "Mumbai",
    pan: "not-a-pan",
    requestedAmount: 500000,
  }).success, false);
});

test("accepts exactly four digits for OTP verification", () => {
  assert.equal(verifyOtpSchema.safeParse({ mobile: "9876543210", otp: "1234" }).success, true);
  assert.equal(verifyOtpSchema.safeParse({ mobile: "9876543210", otp: "123456" }).success, false);
});

test("requests a provider-generated MSG91 OTP using the OTP template", async () => {
  const { sendVerificationCode } = await import("../src/services/sms.js");
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, ...options };
    return new Response(JSON.stringify({ type: "success", message: "OTP sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await sendVerificationCode("9876543210", "1234");
  } finally {
    globalThis.fetch = originalFetch;
  }

  const requestUrl = new URL(request.url);
  assert.equal(requestUrl.origin, "https://control.msg91.com");
  assert.equal(requestUrl.pathname, "/api/v5/otp");
  assert.equal(requestUrl.searchParams.get("template_id"), "test-approved-template");
  assert.equal(requestUrl.searchParams.get("mobile"), "919876543210");
  assert.equal(requestUrl.searchParams.get("otp_length"), "4");
  assert.equal(request.method, "POST");
  assert.equal(request.headers.authkey, "test-msg91-auth-key");
  assert.deepEqual(JSON.parse(request.body), {});
});

test("verifies a provider-generated MSG91 OTP using the verify endpoint", async () => {
  const { verifyVerificationCode } = await import("../src/services/sms.js");
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, ...options };
    return new Response(JSON.stringify({ type: "success", message: "OTP verified successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    assert.equal(await verifyVerificationCode("9876543210", "1234"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const requestUrl = new URL(request.url);
  assert.equal(requestUrl.pathname, "/api/v5/otp/verify");
  assert.equal(requestUrl.searchParams.get("mobile"), "919876543210");
  assert.equal(requestUrl.searchParams.get("otp"), "1234");
  assert.equal(request.method, "GET");
  assert.equal(request.headers.authkey, "test-msg91-auth-key");
});

test("does not treat MSG91 provider error responses as successful OTP sends", async () => {
  const { sendVerificationCode } = await import("../src/services/sms.js");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ type: "error", message: "provider detail must not reach the client" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  try {
    await assert.rejects(
      sendVerificationCode("9876543210", "1234"),
      /MSG91 did not accept the OTP request/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("treats an invalid MSG91 OTP response as an unsuccessful verification", async () => {
  const { verifyVerificationCode } = await import("../src/services/sms.js");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ type: "error", message: "OTP not verified" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  try {
    assert.equal(await verifyVerificationCode("9876543210", "1234"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("does not treat HTTP failures from MSG91 as successful OTP verification", async () => {
  const { verifyVerificationCode } = await import("../src/services/sms.js");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ type: "error", message: "provider detail must not reach the client" }),
    { status: 401, headers: { "Content-Type": "application/json" } },
  );

  try {
    await assert.rejects(
      verifyVerificationCode("9876543210", "1234"),
      /MSG91 rejected the request/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("queues CRM lead details encrypted and replaces stale queued payloads safely", async () => {
  const { enqueueCrmSync } = await import("../src/services/crm-sync.js");
  let statement;
  let values;
  await enqueueCrmSync({
    async execute(query, parameters) {
      statement = query;
      values = parameters;
    },
  }, {
    leadId: "test-lead-id",
    name: "Asha Kumar",
    mobile: "9876543210",
    employmentType: "salaried",
    monthlyIncome: 50000,
    city: "Jaipur",
    requestedAmount: 500000,
  });

  assert.match(statement, /ON DUPLICATE KEY UPDATE/);
  assert.match(statement, /payload_version = payload_version \+ 1/);
  assert.equal(values[0], "test-lead-id");
  assert.equal(JSON.stringify(values).includes("Asha Kumar"), false);
  assert.deepEqual(
    JSON.parse(security.decrypt(values[1], values[2], values[3])),
    {
      leadId: "test-lead-id",
      name: "Asha Kumar",
      mobile: "9876543210",
      employmentType: "salaried",
      monthlyIncome: 50000,
      city: "Jaipur",
      requestedAmount: 500000,
    },
  );
});

test("syncs new CRM customers with the configured creator and Kuvik Loans source", async () => {
  const { upsertCrmLead } = await import("../src/services/crm-sync.js");
  const statements = [];
  const sequenceValues = { customer: 0, lead: 0 };
  let committed = false;
  const connection = {
    async beginTransaction() {},
    async execute(sql, parameters = []) {
      statements.push({ sql, parameters });
      if (sql.includes("SELECT id FROM lead_sources")) {
        return [[{ id: "test-source-id" }], []];
      }
      if (sql.includes("SELECT DISTINCT u.id")) {
        return [[{ id: "test-configured-admin-user-id" }], []];
      }
      if (sql.includes("SELECT id FROM loan_products")) {
        return [[{ id: "test-product-id" }], []];
      }
      if (sql.includes("SELECT customers.id AS customer_id")) {
        return [[], []];
      }
      if (sql.includes("UPDATE business_id_sequences")) {
        sequenceValues[parameters[0]] += 1;
        return [{ affectedRows: 1 }, []];
      }
      if (sql.includes("SELECT `last_value`")) {
        return [[{ last_value: sequenceValues[parameters[0]] }], []];
      }
      return [{ affectedRows: 1 }, []];
    },
    async commit() {
      committed = true;
    },
    async rollback() {},
    release() {},
  };

  const result = await upsertCrmLead({
    leadId: "test-application-lead-id",
    name: "Asha Kumar",
    mobile: "9876543210",
    employmentType: "salaried",
    monthlyIncome: 50000,
    city: "Jaipur",
    requestedAmount: 500000,
  }, {
    async getConnection() {
      return connection;
    },
  });

  const sourceInsert = statements.find(({ sql }) => sql.includes("INSERT INTO lead_sources"));
  const customerInsert = statements.find(({ sql }) => sql.includes("INSERT INTO customers"));
  const leadInsert = statements.find(({ sql }) => sql.includes("INSERT INTO leads"));
  assert.equal(sourceInsert.parameters[1], "Kuvik Loans");
  assert.match(customerInsert.sql, /created_by_user_id/);
  assert.equal(customerInsert.parameters[8], "test-source-id");
  assert.equal(customerInsert.parameters[10], "test-configured-admin-user-id");
  assert.equal(leadInsert.parameters[3], "test-source-id");
  assert.equal(leadInsert.parameters[5], "test-configured-admin-user-id");
  assert.equal(result, "KUV-LEAD-000001");
  assert.equal(committed, true);
});

test("fills missing creator attribution without replacing an existing customer creator", async () => {
  const { upsertCrmLead } = await import("../src/services/crm-sync.js");
  const statements = [];
  const connection = {
    async beginTransaction() {},
    async execute(sql, parameters = []) {
      statements.push({ sql, parameters });
      if (sql.includes("SELECT id FROM lead_sources")) {
        return [[{ id: "test-source-id" }], []];
      }
      if (sql.includes("SELECT DISTINCT u.id")) {
        return [[{ id: "test-configured-admin-user-id" }], []];
      }
      if (sql.includes("SELECT id FROM loan_products")) {
        return [[{ id: "test-product-id" }], []];
      }
      if (sql.includes("SELECT customers.id AS customer_id")) {
        return [[{
          customer_id: "test-customer-id",
          deleted_at: null,
          crm_lead_id: "test-crm-lead-id",
          lead_business_id: "KUV-LEAD-000042",
        }], []];
      }
      return [{ affectedRows: 1 }, []];
    },
    async commit() {},
    async rollback() {},
    release() {},
  };

  await upsertCrmLead({
    leadId: "test-application-lead-id",
    name: "Asha Kumar",
    mobile: "9876543210",
    employmentType: "salaried",
    monthlyIncome: 50000,
    city: "Jaipur",
    requestedAmount: 500000,
  }, {
    async getConnection() {
      return connection;
    },
  });

  const customerUpdate = statements.find(({ sql }) => sql.includes("UPDATE customers"));
  assert.match(customerUpdate.sql, /created_by_user_id = COALESCE\(created_by_user_id, \?\)/);
  assert.equal(customerUpdate.parameters.at(-3), "test-configured-admin-user-id");
  assert.equal(customerUpdate.parameters.at(-1), "test-customer-id");
});
