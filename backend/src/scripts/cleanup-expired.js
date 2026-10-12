import pool from "../database/pool.js";

try {
  const [otpResult] = await pool.execute(
    "DELETE FROM otp_requests WHERE expires_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)",
  );
  const [rateLimitResult] = await pool.execute(
    "DELETE FROM otp_rate_limits WHERE last_sent_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)",
  );
  console.info(
    `Removed ${otpResult.affectedRows} expired verification records and ${rateLimitResult.affectedRows} inactive rate-limit records.`,
  );
} catch (error) {
  console.error(`OTP cleanup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
