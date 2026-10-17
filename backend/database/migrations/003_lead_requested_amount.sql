USE kuvik_personal_loan;

ALTER TABLE leads
  ADD COLUMN requested_amount DECIMAL(12, 0) NULL AFTER monthly_income;
