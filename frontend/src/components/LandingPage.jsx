import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  HeartHandshake,
  IndianRupee,
  LockKeyhole,
  Menu,
  Percent,
  ShieldCheck,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import LeadForm from "./LeadForm.jsx";
import BrandLogo from "./BrandLogo.jsx";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function calculateEmi(principal, annualRate, months) {
  const monthlyRate = annualRate / 1200;
  if (!monthlyRate) return principal / months;
  const multiplier = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * multiplier) / (multiplier - 1);
}

const faqs = [
  {
    question: "Does submitting an enquiry guarantee loan approval?",
    answer:
      "No. Submitting an enquiry does not guarantee approval or disbursal. The lender will review your application, documents, income and credit profile against its eligibility criteria before making a decision.",
  },
  {
    question: "What personal loan amount and interest rate may be available?",
    answer:
      "Kuvik Loans publishes personal-loan options up to ₹50 lakh and rates starting from 9.99% p.a. These are subject to lender, applicant and product eligibility; your actual rate, amount, APR, fees and repayment schedule will be confirmed by the lender in its offer.",
  },
  {
    question: "What repayment tenure can I choose?",
    answer:
      "Repayment options may range from 6 to 60 months in this illustrative calculator; available tenures depend on the lender and product. Review the available tenure, EMI and complete repayment terms in the lender's offer before deciding.",
  },
  {
    question: "Why do you verify my mobile number?",
    answer:
      "A one-time code helps confirm that you control the mobile number you provide. It expires after five minutes and is never shown back to you by our application.",
  },
  {
    question: "Which documents and details may be required?",
    answer:
      "Lenders may ask for identity and PAN details, income or employment information, and supporting documents such as salary slips or bank statements. Requirements differ by lender and applicant; share information only after reviewing the privacy notice and giving consent.",
  },
];

function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-forest sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-base leading-7 text-muted">{text}</p>}
    </div>
  );
}

export default function LandingPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(60);
  const emi = calculateEmi(amount, rate, months);

  const openForm = () => {
    setMenuOpen(false);
    setFormOpen(true);
  };

  return (
    <div className="overflow-hidden bg-white">
      <header className="relative z-20 border-b border-forest/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="shrink-0" aria-label="Kuvik Loans home">
            <BrandLogo className="w-24 sm:w-28" />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-forest/75 lg:flex">
            <a className="transition hover:text-forest" href="#benefits">Why Kuvik Loans</a>
            <a className="transition hover:text-forest" href="#calculator">EMI calculator</a>
            <a className="transition hover:text-forest" href="#eligibility">Eligibility</a>
            <a className="transition hover:text-forest" href="#faqs">FAQs</a>
            <a className="transition hover:text-forest" href="/about-us">About Us</a>
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <a className="text-sm font-semibold text-forest" href="#calculator">Plan your EMI</a>
            <button onClick={openForm} className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950">
              Apply now <ArrowRight className="ml-2 inline" size={16} />
            </button>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-forest/10 lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="absolute left-0 right-0 top-full border-t border-forest/10 bg-white px-5 py-5 shadow-soft lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm font-medium">
              <a onClick={() => setMenuOpen(false)} href="#benefits">Why Kuvik</a>
              <a onClick={() => setMenuOpen(false)} href="#calculator">EMI calculator</a>
              <a onClick={() => setMenuOpen(false)} href="#eligibility">Eligibility</a>
              <a onClick={() => setMenuOpen(false)} href="#faqs">FAQs</a>
              <a onClick={() => setMenuOpen(false)} href="/about-us">About Us</a>
              <button onClick={openForm} className="rounded-full bg-forest px-5 py-3 text-left font-semibold text-white">
                Apply now <ArrowRight className="ml-2 inline" size={16} />
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#f8fbf8] text-forest">
          <div className="pointer-events-none absolute -left-40 top-8 -z-10 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-lime-100/50 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-16">
            <div className="animate-in relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/85 px-3.5 py-2 text-xs font-semibold text-forest shadow-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-800"><IndianRupee size={13} /></span>
                Personal loan options up to ₹50 lakh*
              </span>
              <h1 className="mt-6 max-w-2xl text-[2.25rem] font-bold leading-[1.06] tracking-[-0.045em] text-[#102b3a] sm:text-5xl lg:text-[3.65rem] xl:text-[4rem]">
                Your goals.<br />
                Our support.<br />
                <span className="text-emerald-800">Personal loans</span>
                <span className="block">up to ₹50 lakh*</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                A clearer way to explore personal-loan options. Estimate your EMI, share your needs and get guidance from our team—while the lender reviews your eligibility and final terms.
              </p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6">
                {[
                  { icon: <Zap size={18} />, title: "Quick application", detail: "A few simple steps" },
                  { icon: <ShieldCheck size={18} />, title: "Secure process", detail: "Your details matter" },
                  { icon: <CalendarDays size={18} />, title: "Flexible tenure", detail: "Options up to 60 months" },
                  { icon: <Percent size={18} />, title: "Rates from 9.99%*", detail: "Subject to eligibility" },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100/80 text-emerald-800">{benefit.icon}</span>
                    <span className="pt-0.5">
                      <span className="block text-xs font-bold text-[#102b3a] sm:text-sm">{benefit.title}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500 sm:text-xs">{benefit.detail}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={openForm} className="min-h-12 rounded-full bg-emerald-900 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(6,95,70,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                  Apply now <ArrowRight className="ml-2 inline" size={17} />
                </button>
                <a href="#calculator" className="min-h-12 rounded-full border border-forest/20 bg-white/70 px-6 py-3.5 text-center text-sm font-semibold text-forest transition hover:border-forest/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                  <IndianRupee className="mr-1 inline" size={16} /> Calculate your EMI <ArrowRight className="ml-1 inline" size={15} />
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-700" /> Your details are protected</span>
                <span className="flex items-center gap-1.5"><CircleHelp size={14} className="text-emerald-700" /> Enquiry is not an approval</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[590px] py-3 sm:py-8">
              <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-emerald-900/5 bg-gradient-to-br from-[#e9f5ed] via-[#dff0e5] to-[#d2e9dc] p-5 shadow-[0_28px_80px_rgba(16,44,42,0.12)] sm:min-h-[510px] sm:rounded-[2.5rem] sm:p-8 lg:min-h-[550px]">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[1px] border-white/70 sm:h-96 sm:w-96" />
                <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border-[1px] border-white/70 sm:h-72 sm:w-72" />
                <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#c4e2d0]/70 blur-[1px]" />
                <div className="absolute inset-0 opacity-35" aria-hidden="true" style={{ backgroundImage: "radial-gradient(#438568 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }} />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-[10px] font-semibold text-forest shadow-sm sm:text-xs">
                    <ShieldCheck size={15} className="text-emerald-700" /> A clear, secure start
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-leaf shadow-lg sm:h-12 sm:w-12"><IndianRupee size={21} /></span>
                </div>

                <div className="relative mx-auto mt-8 max-w-[390px] rounded-[1.6rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_65px_rgba(16,44,42,0.16)] backdrop-blur-sm sm:mt-12 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-800">Your loan snapshot</p>
                      <h2 className="mt-1 text-base font-semibold text-[#102b3a] sm:text-lg">A plan that fits your pace</h2>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eaf5ed] text-emerald-800"><Wallet size={19} /></span>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f3f8f4] p-4 sm:p-5">
                    <p className="text-xs text-slate-500">Illustrative monthly EMI</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-[#102b3a] sm:text-4xl">{money.format(calculateEmi(500000, 12, 36))}<span className="ml-1 text-xs font-medium text-slate-500 sm:text-sm">/ month</span></p>
                    <div className="mt-5 flex h-16 items-end gap-1.5" aria-hidden="true">
                      {[27, 34, 31, 43, 39, 49, 45, 58, 52, 63, 58, 70, 64, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-emerald-700/80" style={{ height: `${height}%` }} />)}
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>Month 1</span><span>Month 60</span></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-forest/5 p-3"><p className="text-[10px] text-slate-500">Example amount</p><p className="mt-1 text-sm font-bold text-[#102b3a]">₹50 lakh</p></div>
                    <div className="rounded-2xl border border-forest/5 p-3"><p className="text-[10px] text-slate-500">Example tenure</p><p className="mt-1 text-sm font-bold text-[#102b3a]">60 months</p></div>
                  </div>
                  <p className="mt-3 text-[9px] leading-4 text-slate-500">Illustration at 12% p.a. on a reducing balance. Actual rates, fees and eligibility vary by lender.</p>
                </div>

                <div className="relative mx-auto mt-4 flex max-w-[390px] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur sm:absolute sm:bottom-7 sm:left-8 sm:mx-0 sm:mt-0">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-leaf"><Check size={18} /></span>
                  <span><strong className="block text-xs text-forest">Know before you decide</strong><span className="mt-0.5 block text-[10px] text-slate-500">Review the lender's full terms and offer</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 pb-5 text-[10px] leading-4 text-slate-500 sm:px-8">
            Personal-loan options up to ₹50 lakh* and rates from 9.99% p.a.* are subject to lender and applicant eligibility. Lender identity and final terms will be shared before you proceed. An enquiry does not guarantee approval or disbursal.
          </div>
        </section>

        <section id="benefits" className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why Kuvik Loans"
              title="Explore personal loans with guidance at every step."
              text="From estimating your EMI to understanding the next steps, our team helps make your personal-loan enquiry easier to navigate. The lender makes the final decision."
              centered
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Wallet />, title: "Estimate your EMI", body: "Adjust the amount, illustrative rate and repayment period to explore a monthly estimate." },
                { icon: <HeartHandshake />, title: "Guidance from our team", body: "Tell us about your needs and our team can help explain the enquiry and next steps." },
                { icon: <BadgeCheck />, title: "Options up to ₹50 lakh*", body: "Explore personal-loan options, with eligibility and final terms decided by the lender." },
                { icon: <LockKeyhole />, title: "Your details matter", body: "We request your consent and use safeguards to protect the information you provide." },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl border border-forest/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eff4e7] text-forest">{item.icon}</span>
                  <h3 className="mt-5 text-lg font-semibold text-forest">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="calculator" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Personal loan EMI calculator"
                title="Plan your monthly repayment."
                text="Explore how the loan amount, illustrative interest rate and repayment period can affect your estimated personal-loan EMI."
              />
              <div className="mt-8 space-y-7">
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="amount" className="font-medium text-forest">Loan amount</label>
                    <span className="font-semibold text-forest">{money.format(amount)}</span>
                  </div>
                  <input id="amount" aria-label="Loan amount" className="range-slider w-full cursor-pointer accent-emerald-800" type="range" min="50000" max="10000000" step="25000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>₹50,000</span><span>₹1,00,00,000</span></div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="rate" className="font-medium text-forest">Illustrative annual interest rate</label>
                    <span className="font-semibold text-forest">{rate}%</span>
                  </div>
                  <input id="rate" aria-label="Illustrative annual interest rate" className="range-slider w-full cursor-pointer accent-emerald-800" type="range" min="8" max="36" step="0.5" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>8%</span><span>36%</span></div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="tenure" className="font-medium text-forest">Repayment period</label>
                    <span className="font-semibold text-forest">{months} months</span>
                  </div>
                  <input id="tenure" aria-label="Repayment period in months" className="range-slider w-full cursor-pointer accent-emerald-800" type="range" min="6" max="60" step="1" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>6 months</span><span>5 years</span></div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-forest p-7 text-white shadow-soft sm:p-10">
              <span className="flex items-center gap-2 text-sm text-white/65"><IndianRupee size={17} /> Your estimated monthly EMI</span>
              <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">{money.format(emi)}</p>
              <div className="mt-9 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <span className="text-xs text-white/55">Total repayment</span>
                  <p className="mt-1 text-lg font-semibold">{money.format(emi * months)}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <span className="text-xs text-white/55">Estimated interest</span>
                  <p className="mt-1 text-lg font-semibold">{money.format(emi * months - amount)}</p>
                </div>
              </div>
              <button onClick={openForm} className="mt-7 w-full rounded-full bg-leaf px-6 py-4 text-sm font-bold text-forest transition hover:bg-[#c9ed7c]">
                Talk to our team <ArrowRight className="ml-2 inline" size={16} />
              </button>
              <p className="mt-5 text-xs leading-5 text-white/55">
                This estimate uses a standard monthly reducing-balance calculation and excludes fees and taxes. The selected rate is illustrative, not a quote or guaranteed Kuvik Loans rate. A lender will determine the actual rate, terms and eligibility.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="relative min-h-[310px] overflow-hidden rounded-[2rem] bg-[#eaf0e2] p-8 sm:min-h-[380px] sm:p-10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/60" />
              <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border-[35px] border-[#d9e7c7]" />
              <div className="relative grid h-full min-h-[245px] place-items-center">
                <div className="max-w-xs rounded-3xl bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-leaf"><BriefcaseBusiness size={20} /></span>
                    <div><p className="text-sm font-semibold text-forest">Your personal-loan enquiry</p><p className="text-xs text-muted">Start with a conversation</p></div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {["Share what you need", "Understand possible options", "Review before you decide"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3 text-xs text-forest/80"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#eff4e7] text-[10px] font-bold">{index + 1}</span>{step}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="About Kuvik Loans"
                title="A clearer start to your personal-loan journey."
                text="Explore personal-loan options up to ₹50 lakh*, use the EMI calculator and speak with our team about the next steps. A lender assesses every application and confirms the actual amount, rate and terms."
              />
              <div className="mt-7 space-y-4">
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> Explore an illustrative EMI before sharing an enquiry.</p>
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> Lenders may consider income, employment, credit profile and documents.</p>
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> Review the lender's rate, fees and repayment terms before accepting an offer.</p>
              </div>
              <button onClick={openForm} className="mt-8 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-950">
                Start an enquiry <ArrowRight className="ml-2 inline" size={16} />
              </button>
            </div>
          </div>
        </section>

        <section id="eligibility" className="bg-[#f8faf6] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Personal loan eligibility"
              title="What a lender may consider."
              text="Eligibility criteria vary by lender and product. Your age, income, employment, credit profile and documents may be assessed; meeting common criteria does not guarantee approval."
              centered
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <BriefcaseBusiness />, title: "Employment & income", body: "Your employment type, income and ability to repay the loan." },
                { icon: <Clock3 />, title: "Age & location", body: "The lender's age, residence and serviceability criteria." },
                { icon: <Banknote />, title: "Credit profile", body: "Your credit history, existing obligations and other lender checks." },
                { icon: <ShieldCheck />, title: "Documents", body: "PAN, identity, income and other documents the lender requests." },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl bg-white p-6">
                  <span className="text-emerald-800">{item.icon}</span>
                  <h3 className="mt-4 font-semibold text-forest">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Your personal-loan enquiry" title="Four steps to understand what comes next." centered />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { number: "01", title: "Tell us how to reach you", body: "Share your contact details and verify your mobile number." },
                { number: "02", title: "Share your profile", body: "With your consent, provide employment, income, city and PAN details." },
                { number: "03", title: "Talk through next steps", body: "Our team will review your enquiry and guide you on what may happen next." },
                { number: "04", title: "Review any offer", body: "The lender shares its decision and terms. Review them before choosing to proceed." },
              ].map((step, index) => (
                <article key={step.number} className="relative rounded-3xl border border-forest/10 p-6">
                  <span className="text-sm font-bold tracking-widest text-emerald-800">{step.number}</span>
                  {index < 3 && <span className="absolute right-5 top-8 hidden h-px w-10 bg-forest/15 lg:block" />}
                  <h3 className="mt-5 text-lg font-semibold text-forest">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-[#eff4e7] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-forest"><ShieldCheck size={23} /></span>
              <div>
                <h2 className="text-xl font-semibold text-forest">Clear information. Your decision.</h2>
                <p className="mt-2 text-sm leading-6 text-muted">A personal-loan enquiry is not an approval. Before you proceed with any offer, review the lender, interest rate, fees and repayment terms.</p>
              </div>
            </div>
            <button onClick={openForm} className="shrink-0 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white">
              Make an enquiry <ArrowRight className="ml-2 inline" size={16} />
            </button>
          </div>
        </section>

        <section id="faqs" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Personal loan FAQs"
              title="Good to know before you apply."
              text="Find answers about personal-loan amounts, rates, eligibility and the enquiry process."
            />
            <div className="divide-y divide-forest/10">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-forest [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown className="shrink-0 transition group-open:rotate-180" size={18} />
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-forest px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-white/15 pb-9 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <a href="#home" className="inline-flex w-fit rounded-2xl border border-white/15 bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]" aria-label="Kuvik Loans home">
                <BrandLogo className="w-40 sm:w-44" />
              </a>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Kuvik Loans helps customers explore personal-loan options with digital tools and guidance from our team.
              </p>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:gap-12">
              <section>
                <h2 className="text-sm font-semibold text-white">Kuvik Solutions Pvt. Ltd.</h2>
                <address className="mt-3 max-w-sm text-sm not-italic leading-6 text-white/65">
                  Office No. 103, First Floor, 12 Ram Bharat Villa, Siddharth Colony, Ajmer Road, Jaipur – 302006, Rajasthan
                </address>
                <p className="mt-3 text-sm text-white/65">
                  Ph No.: <a className="hover:text-white" href="tel:+919509439300">+91 95094-39300</a>
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Email ID: <a className="hover:text-white" href="mailto:support@kuvikloans.com">support@kuvikloans.com</a>
                </p>
              </section>
              <section>
                <h2 className="text-sm font-semibold text-white">Corporate Identity Number (CIN)</h2>
                <p className="mt-3 text-sm text-white/65">U66190RJ2026PTC111957</p>
                <nav aria-label="Footer navigation" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/65">
                  <a className="hover:text-white" href="/about-us">About Us</a>
                  <a className="hover:text-white" href="/privacy">Privacy notice</a>
                  <a className="hover:text-white" href="/#faqs">FAQs</a>
                </nav>
              </section>
            </div>
          </div>
          <p className="pt-7 text-xs leading-5 text-white/50">
            Kuvik Solutions Pvt. Ltd. operates the Kuvik Loans website. Loan availability, approval, rate, fees and disbursal are subject to the lender's assessment and terms. The calculator is illustrative only and is not a loan offer. Please review all loan documents and disclosures before accepting an offer.
          </p>
          <p className="mt-4 text-xs text-white/35">© {new Date().getFullYear()} Kuvik Loans. All rights reserved.</p>
        </div>
      </footer>

      {formOpen && <LeadForm onClose={() => setFormOpen(false)} requestedAmount={amount} />}
    </div>
  );
}
