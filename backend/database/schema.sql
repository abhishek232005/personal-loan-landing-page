CREATE DATABASE IF NOT EXISTS kuvik_personal_loan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE kuvik_personal_loan;

CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('admin', 'manager') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_requests (
  mobile_hash CHAR(64) NOT NULL PRIMARY KEY,
  otp_hash CHAR(64) NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_rate_limits (
  mobile_hash CHAR(64) NOT NULL PRIMARY KEY,
  window_started_at DATETIME NOT NULL,
  request_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_sent_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_otp_rate_last_sent (last_sent_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leads (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  mobile_ciphertext VARCHAR(128) NOT NULL,
  mobile_iv CHAR(24) NOT NULL,
  mobile_tag CHAR(32) NOT NULL,
  mobile_hash CHAR(64) NOT NULL UNIQUE,
  employment_type ENUM('salaried', 'self_employed', 'business_owner', 'other') NULL,
  monthly_income DECIMAL(12, 0) NULL,
  requested_amount DECIMAL(12, 0) NULL,
  city VARCHAR(80) NULL,
  pan_ciphertext VARCHAR(128) NULL,
  pan_iv CHAR(24) NULL,
  pan_tag CHAR(32) NULL,
  status ENUM('details_pending', 'submitted', 'contacted', 'qualified', 'rejected', 'disbursed')
    NOT NULL DEFAULT 'details_pending',
  consent BOOLEAN NOT NULL,
  consent_version VARCHAR(32) NOT NULL,
  consented_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leads_status_created (status, created_at),
  INDEX idx_leads_name (name),
  INDEX idx_leads_city (city)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  lead_id CHAR(36) NOT NULL,
  previous_status ENUM('details_pending', 'submitted', 'contacted', 'qualified', 'rejected', 'disbursed') NULL,
  next_status ENUM('details_pending', 'submitted', 'contacted', 'qualified', 'rejected', 'disbursed') NOT NULL,
  changed_by CHAR(36) NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status_history_lead_changed (lead_id, changed_at),
  CONSTRAINT fk_status_history_lead FOREIGN KEY (lead_id) REFERENCES leads(id),
  CONSTRAINT fk_status_history_admin FOREIGN KEY (changed_by) REFERENCES admin_users(id)
) ENGINE=InnoDB;
