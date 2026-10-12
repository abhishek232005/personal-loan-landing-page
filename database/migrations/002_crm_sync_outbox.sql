CREATE TABLE IF NOT EXISTS crm_sync_outbox (
  lead_id CHAR(36) NOT NULL PRIMARY KEY,
  payload_ciphertext MEDIUMTEXT NOT NULL,
  payload_iv CHAR(24) NOT NULL,
  payload_tag CHAR(32) NOT NULL,
  sync_status ENUM('pending', 'processing', 'synced', 'complete') NOT NULL DEFAULT 'pending',
  notification_status ENUM('pending', 'sent', 'not_configured') NOT NULL DEFAULT 'pending',
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  payload_version BIGINT UNSIGNED NOT NULL DEFAULT 1,
  next_attempt_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  locked_until DATETIME NULL,
  crm_lead_business_id VARCHAR(30) NULL,
  last_error VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_crm_outbox_work (sync_status, notification_status, next_attempt_at),
  CONSTRAINT fk_crm_outbox_lead FOREIGN KEY (lead_id) REFERENCES leads(id)
) ENGINE=InnoDB;
