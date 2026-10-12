import config from "../config/env.js";
import logger from "../logger.js";

function requireMsg91Config() {
  const { provider, url, token, templateId, testMode } = config.sms;
  if (testMode || provider === "test") return false;
  if (provider !== "msg91" || !url || !token || !templateId) {
    throw new Error(
      "SMS verification is not configured. Set SMS_PROVIDER=msg91, SMS_API_TOKEN and the approved MSG91 OTP SMS_TEMPLATE_ID in backend/.env, or enable SMS_TEST_MODE=true for local testing.",
    );
  }
  return true;
}

function endpoint(path, params) {
  const url = new URL(config.sms.url);
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = path ? `${basePath}/${path}` : basePath;
  url.search = "";
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function requestMsg91(url, options) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        authkey: config.sms.token,
        ...(options.headers || {}),
      },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error("Could not connect to MSG91. Check the provider connection and try again.");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("MSG91 returned an unreadable response. Please try again.");
  }
  if (!response.ok) {
    throw new Error("MSG91 rejected the request. Check the Auth Key, OTP template and account configuration.");
  }
  return result;
}

export async function sendVerificationCode(mobile, code) {
  const { provider, url, token, templateId, senderId, testMode } = config.sms;
  if (testMode || provider === "test") {
    logger.warn(
      { mobile: mobile.slice(-4), code },
      "Development SMS test mode enabled; OTP is not sent to a live provider.",
    );
    return { mode: "test", code };
  }
  if (provider === "http") {
    if (!url || !token || !templateId) {
      throw new Error("SMS verification is not configured. Set the SMS API URL, token and template ID in backend/.env.");
    }
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `+91${mobile}`,
          senderId,
          templateId,
          variables: { code, expiryMinutes: 5 },
          message: `Your Kuvik Loans verification code is ${code}. It expires in 5 minutes. Do not share this code.`,
        }),
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new Error("The verification message could not be sent. Please check the SMS provider connection and try again.");
    }
    if (!response.ok) {
      throw new Error("The verification message could not be sent. Please check the SMS provider configuration and try again.");
    }
    return { mode: "live" };
  }
  requireMsg91Config();

  const result = await requestMsg91(
    endpoint("", {
      template_id: config.sms.templateId,
      mobile: `91${mobile}`,
      otp_length: "4",
    }),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );
  if (result.type !== "success") {
    throw new Error("MSG91 did not accept the OTP request. Check the approved OTP template and MSG91 account.");
  }
  return { mode: "live" };
}

export async function verifyVerificationCode(mobile, code) {
  if (!requireMsg91Config()) {
    throw new Error("MSG91 verification is unavailable while local SMS test mode is enabled.");
  }

  const result = await requestMsg91(
    endpoint("verify", {
      mobile: `91${mobile}`,
      otp: code,
    }),
    { method: "GET" },
  );
  if (result.type === "success") return true;

  const message = typeof result.message === "string" ? result.message.toLowerCase() : "";
  if (message.includes("otp") && (
    message.includes("invalid")
    || message.includes("incorrect")
    || message.includes("wrong")
    || message.includes("not verified")
    || message.includes("expired")
  )) {
    return false;
  }
  throw new Error("MSG91 could not verify the code. Check the provider configuration and try again.");
}
