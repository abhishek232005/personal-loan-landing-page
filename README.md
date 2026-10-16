# Kuvik Loans landing page

Responsive Kuvik Loans personal-loan enquiry site with dedicated About Us and privacy pages, built with React/Vite, Express, and MySQL-backed OTP/lead intake. Submitted enquiries are queued for the internal CRM dashboard when its integration is configured; the public site has no admin login or dashboard.

## Structure

```text
frontend/                   React pages (personal loan, About Us, privacy), components, logo, Vite and public env
backend/                    Express routes, controllers/services, private env
database/schema.sql         Existing personal-loan application schema
database/migrations/        Additive app-local migrations
```

The backend uses `DB_*` for application data and `CRM_DB_*` for the custom CRM database. Enquiry data is encrypted in an application outbox, then synced to the CRM customer and lead tables. The frontend receives only `VITE_API_BASE_URL`; all database credentials and SMS secrets remain in `backend/.env`.

## Install and run

Prerequisites: Node.js 20+, MySQL 8+, and an approved SMS API for live OTP delivery.

In one PowerShell terminal, install and start the frontend:

```powershell
cd frontend
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

The frontend runs at `http://localhost:5173`; `frontend/.env` should contain:

```dotenv
VITE_API_BASE_URL=http://localhost:4000/api
```

In a second terminal, configure the backend and run it:

```powershell
cd backend
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

Set the app-local `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `DATA_ENCRYPTION_KEY`, `PHONE_HASH_SECRET` and `OTP_HASH_SECRET` in `backend/.env`. The secrets must be separate; the encryption key must be 64 hexadecimal characters. Generate a secret locally with:

If `backend/.env` already exists, preserve it and update only the app database, SMS, and CRM settings needed for this project.

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

The Express API listens on `http://localhost:4000` (the current local backend configuration). In live mode, MSG91 generates and sends the OTP, then verifies it through its OTP API. The application issues its phone-verification token only after MSG91 confirms the code.

### Configure MSG91 OTP delivery

1. Configure and approve an MSG91 OTP template and its matching Indian DLT sender/template. This must be an OTP template ID, not an SMS Flow ID.
2. In the private `backend/.env`, set:

   ```dotenv
   SMS_TEST_MODE=false
   SMS_PROVIDER=msg91
   SMS_API_URL=https://control.msg91.com/api/v5/otp
   SMS_API_TOKEN=<your MSG91 auth key>
   SMS_TEMPLATE_ID=<your approved MSG91 OTP template ID>
   ```

   `SMS_TEST_MODE=false` is required to send live messages; when it is `true`, the backend does not call MSG91. Use the auth key from MSG91's API settings and the OTP template ID shown in the OTP configuration. Keep the auth key private and do not put it in frontend environment variables or chat. The backend requests MSG91's `POST /api/v5/otp` endpoint with `otp_length=4` and calls `GET /api/v5/otp/verify` to verify the four-digit code. Configure the MSG91 OTP template to contain four digits as well.
3. Restart the backend after changing its environment. A successful send response means MSG91 accepted the request; check MSG91 delivery reports and the handset if the SMS does not arrive. OTP verification succeeds only when MSG91 confirms the submitted code.

Creating an MSG91 account, approving the OTP template, and setting a real auth key and OTP template ID are required before live delivery can be tested. Do not test with a customer's phone without consent.

## App database

The application schema in `database/schema.sql` creates/selects `kuvik_personal_loan`, matching the current local `DB_NAME`. Apply it once to initialize OTP and lead tables; its statements use `CREATE TABLE IF NOT EXISTS` and do not delete or replace existing rows. In MySQL Workbench, open and execute `database/schema.sql` as a script. Or use PowerShell with a MySQL client and an account authorized to create the database and tables:

```powershell
Get-Content database\schema.sql | mysql -u <database-user> -p
```

Confirm `backend/.env` `DB_NAME` matches the selected database and the runtime user can use it and read/write the OTP and lead tables. Apply the additive migrations once to the application database:

```powershell
Get-Content database\migrations\002_crm_sync_outbox.sql | mysql -u <database-user> -p kuvik_personal_loan
Get-Content database\migrations\003_lead_requested_amount.sql | mysql -u <database-user> -p kuvik_personal_loan
```

### CRM lead sync

Set `CRM_DB_HOST`, `CRM_DB_PORT`, `CRM_DB_NAME`, `CRM_DB_USER`, and `CRM_DB_PASSWORD` in the private `backend/.env` for the custom CRM database. The CRM schema must include `customers`, `leads`, `lead_sources`, `business_id_sequences`, `users`, `user_roles`, `roles`, and `loan_products`, with `customer` / `lead` sequence scopes and an active Personal Loan product. Personal Loan leads use product `Personal Loan` and source `Kuvik Loans`. The worker resolves the uniquely configured active Admin account `Kuvik Administrator`, assigns the CRM lead to that account, and writes its user ID to `customers.created_by_user_id` for a new customer. The worker uses the existing business-ID allocator, retries transient failures, and reports queue status to the form. Enqueued or pending does not mean CRM delivery has been confirmed. PAN is not copied to CRM; sales webhook notifications are sent only if separately configured.

New enquiries sync after form submission. A verified applicant who returns using the same mobile can update an existing enquiry while CRM delivery is still pending. After the CRM successfully receives the lead, the same mobile cannot submit another enquiry and receives an already-submitted message, preventing duplicate leads. The one-time migration adds `requested_amount` because older app records did not persist it. An older enquiry must be resubmitted to provide its missing requested amount.

## Application security and operations

- In live mode, MSG91 generates and verifies four-digit OTPs; the application stores only an opaque challenge record and issues its verification token after provider confirmation. In local development only, `SMS_TEST_MODE=true` returns an app-generated four-digit code in the API response for manual testing; production rejects test mode and requires a configured live SMS provider. OTP verification and rate limits remain enforced in both modes.
- Consent is required before OTP request. Phone and PAN remain encrypted in the app-local lead database; the CRM outbox is encrypted, and PAN is intentionally not copied into CRM.
- API input uses Zod validation and parameterized MySQL queries; request/IP limits are enabled.
- OTP requests are limited to five per number per hour and one resend per 60 seconds. The form displays the server-provided wait time and disables resend until it elapses.
- Admin login, dashboard and admin endpoints have been removed from the application. Existing database tables are left untouched.
- Schedule `npm run cleanup:expired` in `backend/` for expired OTP data. Establish an approved retention and deletion policy for application and CRM leads.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API/database readiness |
| `POST` | `/api/otp/send` | Consent-gated OTP request |
| `POST` | `/api/otp/verify` | Verify OTP and issue a phone-bound token |
| `POST` | `/api/leads` | Create the verified lead draft |
| `PATCH` | `/api/leads/:id` | Submit/update the verified enquiry profile and queue CRM sync |

## Verify

```powershell
cd backend
npm test
npm run test:integration
cd ..\frontend
npm run build
```

The backend tests and integration smoke test require working app-local database credentials and installed application tables. CRM delivery additionally requires the outbox migration and valid `CRM_DB_*` credentials/schema. The smoke test verifies database/API health, CORS, malformed JSON, consent enforcement, and that removed admin endpoints return 404. For a full live OTP submission test, configure an approved SMS provider in `backend/.env`; without it, the API intentionally rejects OTP requests with a clear error.

The displayed EMI values are estimates, not lender quotes. An enquiry is not an approval or loan offer. Verify the company details, lender terms and required legal/privacy disclosures before launch.
