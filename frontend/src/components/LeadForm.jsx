import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { api } from "../api.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-forest outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/10";

function formatRetryTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function Field({ label, name, type = "text", value, onChange, placeholder, required = true, ...props }) {
  return (
    <label className="block text-sm font-medium text-forest">
      {label}
      <input
        className={inputClass}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </label>
  );
}

function readAttribution() {
  const current = new URL(window.location.href);
  const value = (key) => current.searchParams.get(key)?.slice(0, 120) || undefined;
  const utm = new URLSearchParams();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const entry = value(key);
    if (entry) utm.set(key, entry);
  }
  let referrer;
  if (document.referrer) {
    try {
      const source = new URL(document.referrer);
      referrer = `${source.origin}${source.pathname}`.slice(0, 2048);
    } catch {
      referrer = undefined;
    }
  }
  return {
    pageUrl: `${current.origin}${current.pathname}${utm.size ? `?${utm}` : ""}`.slice(0, 2048),
    referrer,
    utmSource: value("utm_source"),
    utmMedium: value("utm_medium"),
    utmCampaign: value("utm_campaign"),
    utmTerm: value("utm_term"),
    utmContent: value("utm_content"),
  };
}

export default function LeadForm({ onClose, requestedAmount }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    otp: "",
    employmentType: "",
    monthlyIncome: "",
    city: "",
    pan: "",
    requestedAmount: String(requestedAmount),
    consent: false,
  });
  const [attribution] = useState(readAttribution);
  const [otpSent, setOtpSent] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [leadToken, setLeadToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [otpRetryAfter, setOtpRetryAfter] = useState(0);
  const [otpRateLimitMessage, setOtpRateLimitMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [crmSyncStatus, setCrmSyncStatus] = useState("disabled");
  const validName = /^[\p{L}\p{M} .'-]+$/u.test(form.name.trim()) && form.name.trim().length >= 2;

  useEffect(() => {
    if (otpRetryAfter <= 0) {
      if (otpRateLimitMessage) {
        setError("");
        setOtpRateLimitMessage(false);
      }
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setOtpRetryAfter((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [otpRetryAfter, otpRateLimitMessage]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const sendOtp = async () => {
    if (busy || otpRetryAfter > 0) return;
    setError("");
    setOtpRateLimitMessage(false);
    setBusy(true);
    try {
      const result = await api.sendOtp({ mobile: form.mobile, consent: form.consent });
      setOtpSent(true);
      setOtpRetryAfter(result.resendAfterSeconds || 60);
    } catch (requestError) {
      if (requestError.retryAfterSeconds) {
        setOtpRetryAfter(requestError.retryAfterSeconds);
        setOtpRateLimitMessage(true);
      }
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyAndCreate = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const verification = await api.verifyOtp({ mobile: form.mobile, otp: form.otp });
      const lead = await api.createLead(
        { name: form.name, mobile: form.mobile, consent: form.consent },
        verification.verificationToken,
      );
      setLeadId(lead.leadId);
      setLeadToken(lead.leadToken);
      setStep(2);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const submitDetails = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await api.updateLead(
        leadId,
        {
          employmentType: form.employmentType,
          monthlyIncome: Number(form.monthlyIncome),
          city: form.city,
          pan: form.pan,
          requestedAmount: Number(form.requestedAmount),
          attribution,
        },
        leadToken,
      );
      setCrmSyncStatus(result.crmSyncStatus);
      setSuccess(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    if (!busy) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-forest/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-title"
        className="animate-in relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[#fcfcf8] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
      >
        <button onClick={close} aria-label="Close application form" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-forest/5 text-forest hover:bg-forest/10"><X size={18} /></button>
        {success ? (
          <div className="py-9 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eff4e7] text-emerald-800"><CheckCircle2 size={32} /></span>
            <h2 id="application-title" className="mt-5 text-2xl font-semibold text-forest">Thanks, {form.name.split(" ")[0]}.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
              Your enquiry has been recorded.
              {crmSyncStatus === "pending" && " It is queued to sync to Kuvik's internal CRM dashboard."}
              {crmSyncStatus === "disabled" && " CRM sync is not configured, so the enquiry is only in the application database."}
              {" "}This is not a loan approval or offer.
            </p>
            <button onClick={onClose} className="mt-7 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white">Done</button>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Personal loan enquiry</p>
            <h2 id="application-title" className="mt-2 pr-8 text-2xl font-semibold tracking-tight text-forest">A good first step starts here.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Share a few details so our team can understand your enquiry.</p>
            <div className="mt-6 flex items-center gap-3" aria-label={`Step ${step} of 2`}>
              {[1, 2].map((item) => (
                <div key={item} className="flex flex-1 items-center gap-2">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${step >= item ? "bg-forest text-white" : "bg-forest/10 text-muted"}`}>{item < step ? <CheckCircle2 size={15} /> : item}</span>
                  <span className={`text-xs font-medium ${step >= item ? "text-forest" : "text-muted"}`}>{item === 1 ? "Verify mobile" : "Your profile"}</span>
                  {item === 1 && <span className="h-px flex-1 bg-forest/15" />}
                </div>
              ))}
            </div>

            {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {otpRateLimitMessage && otpRetryAfter > 0
                ? `Please wait ${formatRetryTime(otpRetryAfter)} before requesting another code.`
                : error}
            </p>}

            {step === 1 ? (
              <form onSubmit={verifyAndCreate} className="mt-6 space-y-4">
                <Field label="Full name" name="name" value={form.name} onChange={change} placeholder="As shown on your PAN" autoComplete="name" maxLength={80} />
                <label className="block text-sm font-medium text-forest">
                  Mobile number
                  <div className="mt-2 flex gap-2">
                    <span className="grid place-items-center rounded-xl border border-forest/15 bg-forest/5 px-3 text-sm text-forest">+91</span>
                    <input className={`${inputClass} mt-0`} name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" value={form.mobile} onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit mobile number" required minLength={10} maxLength={10} pattern="[6-9][0-9]{9}" />
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f1f3ed] p-3.5 text-xs leading-5 text-muted">
                  <input type="checkbox" name="consent" checked={form.consent} onChange={change} className="mt-1 h-4 w-4 shrink-0 accent-forest" required />
                  <span>I consent to Kuvik Loans using and storing my details in its internal customer-management system to process this enquiry and contacting me by call or SMS about it. I have read the <a className="font-semibold text-forest underline" href="/privacy" target="_blank" rel="noreferrer">privacy notice</a>. I understand that submitting an enquiry does not guarantee a loan.</span>
                </label>
                {!otpSent ? (
                  <button type="button" onClick={sendOtp} disabled={busy || otpRetryAfter > 0 || !form.consent || !validName || !/^[6-9]\d{9}$/.test(form.mobile)} className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                    {busy ? <><LoaderCircle className="mr-2 inline animate-spin" size={16} /> Sending code</> : otpRetryAfter > 0 ? <>Try again in {formatRetryTime(otpRetryAfter)}</> : <>Send verification code <ArrowRight className="ml-2 inline" size={16} /></>}
                  </button>
                ) : (
                  <>
                    <Field label="One-time verification code" name="otp" value={form.otp} onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="Enter the 4-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={4} minLength={4} pattern="[0-9]{4}" />
                    <p className="text-xs leading-5 text-muted">Code sent to your number. It expires in 5 minutes.{" "}
                      <button type="button" onClick={sendOtp} disabled={busy || otpRetryAfter > 0} className="font-semibold text-forest underline disabled:opacity-50">
                        {otpRetryAfter > 0 ? `Resend in ${formatRetryTime(otpRetryAfter)}` : "Resend code"}
                      </button>
                    </p>
                    <button type="submit" disabled={busy || form.otp.length !== 4} className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                      {busy ? <><LoaderCircle className="mr-2 inline animate-spin" size={16} /> Verifying</> : <>Verify & continue <ArrowRight className="ml-2 inline" size={16} /></>}
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={submitDetails} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-forest">
                  Employment type
                  <select className={inputClass} name="employmentType" value={form.employmentType} onChange={change} required>
                    <option value="" disabled>Select employment type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="business_owner">Business owner</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <Field label="Monthly income (₹)" name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={change} placeholder="For example, 50000" min="1" max="100000000" step="1" />
                <Field label="Loan amount requested (₹)" name="requestedAmount" type="number" value={form.requestedAmount} onChange={change} placeholder="Enter the amount you need" min="10000" max="100000000" step="1000" />
                <Field label="City" name="city" value={form.city} onChange={change} placeholder="Your city of residence" autoComplete="address-level2" maxLength={80} />
                <Field label="PAN" name="pan" value={form.pan} onChange={(event) => setForm((current) => ({ ...current, pan: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) }))} placeholder="ABCDE1234F" maxLength={10} minLength={10} pattern="[A-Z]{5}[0-9]{4}[A-Z]" autoComplete="off" />
                <p className="text-xs leading-5 text-muted">Your PAN is encrypted when stored and is shared only as described in our <a className="font-semibold text-forest underline" href="/privacy" target="_blank" rel="noreferrer">privacy notice</a>.</p>
                <button type="button" onClick={() => { setStep(1); setError(""); }} className="mr-3 rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest"><ArrowLeft className="mr-1 inline" size={15} /> Back</button>
                <button type="submit" disabled={busy} className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
                  {busy ? <><LoaderCircle className="mr-2 inline animate-spin" size={16} /> Submitting</> : <>Submit enquiry <ArrowRight className="ml-2 inline" size={16} /></>}
                </button>
                <p className="pt-1 text-[11px] leading-5 text-muted">Enquiry reference: {leadId.slice(0, 8).toUpperCase()}</p>
              </form>
            )}
            <p className="mt-6 border-t border-forest/10 pt-4 text-[11px] leading-5 text-muted">
              No approval or disbursal is promised. A lender may apply its own eligibility checks, loan terms and documentation requirements.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
