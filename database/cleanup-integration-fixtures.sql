USE kuvik_loans;

START TRANSACTION;

DELETE history
FROM lead_status_history AS history
JOIN leads AS lead ON lead.id = history.lead_id
WHERE lead.name = 'Integration fixture - anonymized'
  AND lead.city = 'Synthetic test data'
  AND lead.consent = FALSE
  AND lead.status = 'rejected'
  AND lead.monthly_income IS NULL
  AND lead.pan_ciphertext IS NULL;

DELETE FROM leads
WHERE name = 'Integration fixture - anonymized'
  AND city = 'Synthetic test data'
  AND consent = FALSE
  AND status = 'rejected'
  AND monthly_income IS NULL
  AND pan_ciphertext IS NULL;

DELETE FROM admin_users
WHERE email LIKE 'integration-%@example.test'
   OR email LIKE 'manager-%@example.test';

COMMIT;
