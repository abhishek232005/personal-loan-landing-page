import { ArrowLeft } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";

export default function PrivacyNotice() {
  return (
    <main className="min-h-screen bg-cream px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-forest">
          <ArrowLeft size={16} /> Back to Kuvik Loans
        </a>
        <article className="mt-8 rounded-3xl bg-white p-6 shadow-soft sm:p-10">
          <BrandLogo className="w-40 sm:w-44" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Privacy notice · version 2026-10</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest">Your information, handled with care.</h1>
          <p className="mt-4 text-sm leading-6 text-muted">This notice explains how information is handled when you submit a personal-loan enquiry through this site. Kuvik Solutions Pvt. Ltd. operates the Kuvik Loans website. Contact details are provided below.</p>

          <div className="mt-8 space-y-7 text-sm leading-6 text-muted">
            <section>
              <h2 className="font-semibold text-forest">Information you provide</h2>
              <p className="mt-2">For a personal-loan enquiry, we collect your name, mobile number, employment type, monthly income, city and PAN. A verification code is sent to confirm access to your mobile number. Do not share that code with anyone.</p>
            </section>
            <section>
              <h2 className="font-semibold text-forest">Why we use it</h2>
              <p className="mt-2">Kuvik Solutions Pvt. Ltd. uses the details to verify your mobile number, record and respond to your enquiry, and support follow-up about possible next steps. Enquiry details are stored in the application database and are queued for the internal customer-management system when that integration is configured. We do not treat an enquiry as consent to an unrelated marketing campaign. If a lending partner is to receive your information, its identity and the applicable purpose must be explained before that sharing occurs.</p>
            </section>
            <section>
              <h2 className="font-semibold text-forest">Storage and security</h2>
              <p className="mt-2">Mobile numbers and PAN are encrypted in the application database. Queued CRM payloads are encrypted, and PAN is not copied to the CRM integration. Access to lead records is authenticated and role-limited. No system can be guaranteed completely secure; the operator should maintain access controls, backups, retention rules and incident response procedures.</p>
            </section>
            <section>
              <h2 className="font-semibold text-forest">Retention and your choices</h2>
              <p className="mt-2">Enquiry records are retained only as long as needed for the stated purpose and applicable legal requirements. The site operator must publish a working contact channel for access, correction, deletion, consent withdrawal and grievance requests before launch. You can decline to submit the form; required information is needed to process an enquiry.</p>
            </section>
            <section>
              <h2 className="font-semibold text-forest">Cookies and third parties</h2>
              <p className="mt-2">This implementation does not add analytics or advertising trackers. The SMS provider processes your mobile number to deliver a verification code. Any production analytics, lender integrations, additional processors or cross-border transfers must be disclosed and configured in accordance with applicable law.</p>
            </section>
            <section>
              <h2 className="font-semibold text-forest">Contact and operator details</h2>
              <p className="mt-2">Kuvik Solutions Pvt. Ltd., Office No. 103, First Floor, 12 Ram Bharat Villa, Siddharth Colony, Ajmer Road, Jaipur – 302006, Rajasthan. Contact: <a className="font-semibold text-forest underline" href="mailto:support@kuvikloans.com">support@kuvikloans.com</a> or <a className="font-semibold text-forest underline" href="tel:+919509439300">+91 95094-39300</a>. Corporate Identity Number (CIN): U66190RJ2026PTC111957. Contact this address for privacy enquiries. Applicable response timelines and grievance procedures should be confirmed by the operator.</p>
            </section>
          </div>
          <p className="mt-8 border-t border-forest/10 pt-5 text-xs leading-5 text-muted">This starter notice is not legal advice and is not a substitute for a privacy notice reviewed for the actual Kuvik Loans operating entity, lender relationships and applicable laws.</p>
        </article>
      </div>
    </main>
  );
}
