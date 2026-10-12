import { useEffect } from "react";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  Laptop,
  MessageCircle,
  ShieldCheck,
  Target,
} from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";

const benefits = [
  {
    icon: <MessageCircle size={21} />,
    title: "Clear, guided next steps",
    text: "Understand the enquiry journey before you decide whether to continue. An enquiry is not a loan approval or offer.",
  },
  {
    icon: <Laptop size={21} />,
    title: "Useful digital tools",
    text: "Explore personal-loan information and use the EMI calculator for an estimate before sharing an enquiry.",
  },
  {
    icon: <HeartHandshake size={21} />,
    title: "People behind the process",
    text: "Kuvik's published information describes a team that can help customers understand their enquiry and possible next steps.",
  },
  {
    icon: <ShieldCheck size={21} />,
    title: "Transparency before a decision",
    text: "Loan availability, lender assessment, rates, fees and terms should be understood before accepting any offer.",
  },
];

export default function AboutUs() {
  useEffect(() => {
    document.title = "About Kuvik Loans | Kuvik Solutions";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-forest/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/#home" className="shrink-0" aria-label="Kuvik Loans home">
            <BrandLogo className="w-24 sm:w-28" />
          </a>
          <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-5 overflow-x-auto whitespace-nowrap text-sm font-medium text-forest/75 sm:order-2 sm:w-auto">
            <a className="transition hover:text-forest" href="/#home">Personal loans</a>
            <a className="transition hover:text-forest" href="/#benefits">Why Kuvik</a>
            <a className="transition hover:text-forest" href="/#faqs">FAQs</a>
            <a className="font-semibold text-forest" href="/about-us" aria-current="page">About Us</a>
          </nav>
          <a href="/#home" className="rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-950 sm:px-5">
            Explore loans <ArrowRight className="ml-1 inline" size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-forest px-5 py-16 text-white sm:px-8 sm:py-24">
          <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
          <div className="absolute -right-32 -top-40 -z-10 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf">About Kuvik Loans</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Lending is not only about money. It is about <span className="text-leaf">momentum.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                Kuvik Solutions Pvt. Ltd. operates the Kuvik Loans website. Kuvik describes its platform as a way to help people discover credit options through a clearer, digitally supported journey.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf">Our approach</p>
              <p className="mt-4 text-2xl font-semibold leading-snug text-white sm:text-3xl">
                Clarity over confusion.
                <br />
                Support over complexity.
              </p>
              <p className="mt-4 text-sm leading-6 text-white/65">
                We aim to make the first steps easier to understand, while leaving lending decisions and loan terms to the respective lender.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Purpose, vision & mission</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-forest sm:text-4xl">
                Helping people move forward with more clarity.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <article className="rounded-3xl bg-cream p-6 sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest"><HeartHandshake size={22} /></span>
                <h3 className="mt-5 text-lg font-semibold text-forest">Our purpose</h3>
                <p className="mt-3 text-sm leading-6 text-muted">To help people and businesses move forward without unnecessary financial friction by making the loan journey easier to understand.</p>
              </article>
              <article className="rounded-3xl bg-[#eff4e7] p-6 sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest"><Eye size={22} /></span>
                <h3 className="mt-5 text-lg font-semibold text-forest">Our vision</h3>
                <p className="mt-3 text-sm leading-6 text-muted">To become a trusted name in India's digital lending ecosystem by making credit access more transparent, accessible and customer-friendly.</p>
              </article>
              <article className="rounded-3xl bg-cream p-6 sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest"><Target size={22} /></span>
                <h3 className="mt-5 text-lg font-semibold text-forest">Our mission</h3>
                <p className="mt-3 text-sm leading-6 text-muted">To simplify loan discovery and fulfilment through technology, lending partnerships and a service experience built around trust, speed and clarity.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#f8faf6] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">What you can expect</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-forest sm:text-4xl">A more considered way to explore your options.</h2>
              <p className="mt-4 text-base leading-7 text-muted">The experience is designed to help you understand the process, not to promise an outcome.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-3xl bg-white p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eff4e7] text-forest">{benefit.icon}</span>
                  <h3 className="mt-5 font-semibold text-forest">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-forest p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-leaf"><Target size={16} /> Your choice comes first</span>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Start with information. Decide at your own pace.</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">An enquiry does not guarantee approval or disbursal. Any offer, lender assessment and terms are subject to the lender.</p>
            </div>
            <a href="/#home" className="inline-flex shrink-0 items-center justify-center rounded-full bg-leaf px-6 py-3.5 text-sm font-bold text-forest transition hover:bg-[#c9ed7c]">
              Explore personal loans <ArrowRight className="ml-2" size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-forest px-5 py-10 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 border-b border-white/15 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <a href="/#home" className="inline-flex w-fit rounded-2xl border border-white/15 bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]" aria-label="Kuvik Loans home">
            <BrandLogo className="w-40 sm:w-44" />
          </a>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
            <a className="hover:text-white" href="/#home">Personal loans</a>
            <a className="font-semibold text-white" href="/about-us" aria-current="page">About Us</a>
            <a className="hover:text-white" href="/privacy">Privacy notice</a>
            <a className="hover:text-white" href="/#faqs">FAQs</a>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl pt-6">
          <p className="text-xs leading-5 text-white/60">Kuvik Solutions Pvt. Ltd. · CIN: U66190RJ2026PTC111957</p>
          <p className="mt-2 text-xs leading-5 text-white/50">Loan availability, approval, rates, fees and disbursal are subject to the lender's assessment and terms. This page is informational and is not a loan offer.</p>
          <p className="mt-4 text-xs text-white/35">© {new Date().getFullYear()} Kuvik Loans. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
