import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  HeartHandshake,
  IndianRupee,
  LockKeyhole,
  Menu,
  MoveUpRight,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import LeadForm from "./LeadForm.jsx";
import BrandLogo from "./BrandLogo.jsx";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatAmount(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 ? 1 : 0)} lakh`;
  return money.format(value);
}

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
      "No. An enquiry is not a loan application approval or offer. A lender will assess your application, documents, credit profile and its own policies before making any decision.",
  },
  {
    question: "What interest rate and fees will apply?",
    answer:
      "There is no single rate quoted on this page. The lender, annual interest rate, APR, fees, repayment schedule and other applicable terms must be shared with you in the lender's offer before you decide whether to proceed.",
  },
  {
    question: "Why do you verify my mobile number?",
    answer:
      "A one-time code helps confirm that you control the mobile number you provide. It expires after five minutes and is never shown back to you by our application.",
  },
  {
    question: "Why do you ask for PAN and income details?",
    answer:
      "If you choose to continue, these details help our team understand your enquiry and may be needed by a lender for eligibility assessment. We request consent first and protect sensitive values in storage.",
  },
  {
    question: "Can I use the EMI calculator as a loan quote?",
    answer:
      "No. It is an estimate using the values you enter and a standard reducing-balance formula. It excludes fees and taxes and does not represent an offer, approval or the exact amount a lender may charge.",
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
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(36);
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
            {/* <a className="transition hover:text-forest" href="#faqs">FAQs</a> */}
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
        <section id="home" className="relative isolate bg-forest text-white">
          <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
          <div className="absolute -right-36 -top-44 -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald-700/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-28">
            <div className="animate-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/85">
                <span className="h-2 w-2 rounded-full bg-leaf" />
                A clearer way to explore personal loans
              </span>
              <h1 className="mt-7 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[4.25rem]">
                Big plans deserve a <span className="text-leaf">clearer</span> first step.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                Tell us what you need. Our team can help you understand the next steps and explore personal loan options that may fit your situation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={openForm} className="rounded-full bg-leaf px-7 py-4 text-sm font-bold text-forest transition hover:bg-[#c9ed7c]">
                  Apply now <ArrowRight className="ml-2 inline" size={17} />
                </button>
                <a href="#calculator" className="rounded-full border border-white/20 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                  Calculate your EMI <ArrowDown className="ml-2 inline" size={16} />
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/65">
                <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-leaf" /> Your details are protected</span>
                <span className="flex items-center gap-2"><CircleHelp size={15} className="text-leaf" /> Enquiry is not an approval</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="absolute -left-5 top-16 hidden rounded-2xl border border-white/10 bg-white/10 p-4 text-xs backdrop-blur sm:block">
                <span className="block text-white/60">Make a plan that feels right</span>
                <span className="mt-1.5 flex items-center gap-2 font-semibold text-leaf"><Check size={14} /> Start with an estimate</span>
              </div>
              <div className="rounded-[2rem] border border-white/15 bg-[#f7f7f1] p-5 text-forest shadow-2xl sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">A quick EMI estimate</span>
                  <span className="rounded-full bg-forest/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-forest/60">Illustrative</span>
                </div>
                <div className="mt-7 rounded-2xl bg-white p-5">
                  <span className="text-xs text-muted">Estimated monthly EMI</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">{money.format(calculateEmi(500000, 12, 36))}</span>
                    <span className="text-xs text-muted">/ month</span>
                  </div>
                  <div className="mt-6 flex items-end gap-1.5" aria-hidden="true">
                    {[28, 40, 33, 51, 45, 62, 55, 72, 61, 83, 70, 96, 78, 88, 72, 100].map((height, index) => (
                      <div key={index} className="flex-1 rounded-full bg-emerald-900/10" style={{ height: `${height}px` }}>
                        <div className="h-2/3 rounded-full bg-emerald-800" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4">
                    <span className="text-xs text-muted">Loan amount</span>
                    <p className="mt-1 font-semibold">{formatAmount(500000)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <span className="text-xs text-muted">Tenure</span>
                    <p className="mt-1 font-semibold">36 months</p>
                  </div>
                </div>
                <p className="mt-4 text-[10px] leading-4 text-muted">
                  Illustration assumes 12% p.a. on a reducing balance. Not a Kuvik offer; actual lender terms, fees and eligibility vary.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-3 rounded-2xl bg-leaf px-4 py-3 text-xs font-bold text-forest shadow-lg sm:-right-7">
                Start with what works for you <MoveUpRight className="ml-1 inline" size={14} />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 pb-6 text-[10px] leading-4 text-white/45 sm:px-8">
            Kuvik Loans is a brand name. Lender identity and all loan terms will be disclosed before any formal application or acceptance. Enquiry does not guarantee approval or disbursal.
          </div>
        </section>

        <section id="benefits" className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="A little more clarity"
              title="A personal loan journey that puts you first."
              text="Good decisions start with the right information. We make it easier to understand your options, one step at a time."
              centered
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Wallet />, title: "Plan before you apply", body: "Estimate a monthly repayment before sharing your details or deciding what to do next." },
                { icon: <HeartHandshake />, title: "A human conversation", body: "Share a few details so our team can understand your enquiry and follow up with you." },
                { icon: <BadgeCheck />, title: "Clear terms, first", body: "Review the lender, rate, fees and repayment conditions before choosing to proceed." },
                { icon: <LockKeyhole />, title: "Your details matter", body: "We ask for your consent and use safeguards to protect the information you provide." },
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
                eyebrow="Know your numbers"
                title="An EMI estimate, on your terms."
                text="Try different amounts, rates and repayment periods to see how the estimated monthly payment changes."
              />
              <div className="mt-8 space-y-7">
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="amount" className="font-medium text-forest">Loan amount</label>
                    <span className="font-semibold text-forest">{money.format(amount)}</span>
                  </div>
                  <input id="amount" className="range-slider w-full cursor-pointer" type="range" min="50000" max="2500000" step="25000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>₹50,000</span><span>₹25,00,000</span></div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="rate" className="font-medium text-forest">Illustrative annual interest rate</label>
                    <span className="font-semibold text-forest">{rate}%</span>
                  </div>
                  <input id="rate" className="range-slider w-full cursor-pointer" type="range" min="8" max="36" step="0.5" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>8%</span><span>36%</span></div>
                </div>
                <div>
                  <div className="mb-3 flex justify-between text-sm">
                    <label htmlFor="tenure" className="font-medium text-forest">Repayment period</label>
                    <span className="font-semibold text-forest">{months} months</span>
                  </div>
                  <input id="tenure" className="range-slider w-full cursor-pointer" type="range" min="6" max="60" step="1" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
                  <div className="mt-1 flex justify-between text-xs text-muted"><span>6 months</span><span>60 months</span></div>
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
                This estimate uses a standard monthly reducing-balance calculation and excludes fees and taxes. The selected rate is illustrative only; it is not a quote or a Kuvik Loans product rate. A lender will determine actual terms and eligibility.
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
                    <div><p className="text-sm font-semibold text-forest">Your next step</p><p className="text-xs text-muted">Starts with a conversation</p></div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {["Understand your needs", "Explore available options", "Decide at your own pace"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3 text-xs text-forest/80"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#eff4e7] text-[10px] font-bold">{index + 1}</span>{step}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="About Kuvik Loans"
                title="A helpful starting point for a considered decision."
                text="We believe borrowing should begin with understanding, not pressure. Kuvik Loans helps you start a personal-loan enquiry, estimate repayments and speak with our team about what may happen next."
              />
              <div className="mt-7 space-y-4">
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> Review the estimate and decide whether you want to share an enquiry.</p>
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> A lender's decision depends on its assessment and policies.</p>
                <p className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 shrink-0 text-emerald-800" size={17} /> You can review the actual lender and terms before making a commitment.</p>
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
              eyebrow="Before you begin"
              title="A few things a lender may consider."
              text="Eligibility rules are set by each lender and can change. These are common factors—not Kuvik Loans requirements or a promise that an application will be approved."
              centered
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <BriefcaseBusiness />, title: "Employment & income", body: "Your work situation and ability to meet repayments." },
                { icon: <Clock3 />, title: "Age & residency", body: "The lender's applicable age and residence criteria." },
                { icon: <Banknote />, title: "Credit profile", body: "Credit history and other checks the lender may perform." },
                { icon: <ShieldCheck />, title: "Documents", body: "Identity, PAN and income documents requested by the lender." },
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
            <SectionHeading eyebrow="Your enquiry, step by step" title="Four simple steps. Your decision, always." centered />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { number: "01", title: "Share your details", body: "Tell us how to reach you and verify your mobile number." },
                { number: "02", title: "Complete your profile", body: "Share employment, income, city and PAN with your consent." },
                { number: "03", title: "Speak with our team", body: "Our team reviews your enquiry and explains the next steps." },
                { number: "04", title: "Review before deciding", body: "If an offer is available, review the lender and all terms before you choose." },
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
                <h2 className="text-xl font-semibold text-forest">A transparent first step.</h2>
                <p className="mt-2 text-sm leading-6 text-muted">We won't promise approval. Before any formal application, you should know which lender is involved and have the opportunity to review the applicable terms.</p>
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
              eyebrow="Good to know"
              title="Questions worth asking."
              text="A little clarity up front can make your next step feel a lot easier."
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
                Kuvik Solutions — Your trusted financial partner for all types of loans and credit solutions.
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
