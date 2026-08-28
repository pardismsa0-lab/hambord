import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Check, ChevronDown, ChevronLeft, Crown, RefreshCw, Wallet, X } from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, useToast } from "../components/ui";
import { faNum } from "../lib/data";
import { useSession } from "../lib/session";

interface Plan {
  id: string;
  name: string;
  desc: string;
  monthly: number;
  quota: string;
  feeCap: string;
  popular?: boolean;
  features: { text: string; included: boolean }[];
}

const PLANS: Plan[] = [
  {
    id: "family",
    name: "خانوار",
    desc: "برای خرید ماهانه‌ی خانه و گروه‌های محله‌ای",
    monthly: 99,
    quota: "۲۰ میلیون تومان",
    feeCap: "کارمزد متغیر",
    popular: true,
    features: [
      { text: "ورود زودهنگام به کمپین‌های ویژه", included: true },
      { text: "پله‌های تخفیف اختصاصی مشترکان", included: true },
      { text: "ارسال رایگان سفارش‌های ماهانه", included: true },
      { text: "پشتیبانی اولویت‌دار", included: true },
      { text: "فاکتور رسمی و خرید چندکاربره", included: false },
    ],
  },
  {
    id: "business",
    name: "کسب‌وکار",
    desc: "برای کافه‌ها، رستوران‌ها و فروشگاه‌های محلی",
    monthly: 249,
    quota: "۲۰۰ میلیون تومان",
    feeCap: "سقف کارمزد ٪۱",
    features: [
      { text: "همه‌ی مزایای طرح خانوار", included: true },
      { text: "قیمت پلکانی حجم بالا", included: true },
      { text: "فاکتور رسمی و تسویه‌ی اعتباری", included: true },
      { text: "مدیر خرید اختصاصی", included: true },
      { text: "API اتصال به صندوق فروش", included: false },
    ],
  },
  {
    id: "org",
    name: "سازمانی",
    desc: "برای خرید گروهی شرکت‌ها و سازمان‌ها",
    monthly: 890,
    quota: "۵۰۰ میلیون تومان",
    feeCap: "سقف کارمزد ٪۰٫۵",
    features: [
      { text: "همه‌ی مزایای طرح کسب‌وکار", included: true },
      { text: "مدیریت چندکاربره و سقف خرید", included: true },
      { text: "API اتصال به سامانه‌ی تدارکات", included: true },
      { text: "گزارش مصرف فصلی", included: true },
      { text: "تأمین‌کننده‌ی اختصاصی", included: true },
    ],
  },
];

const FAQS = [
  { q: "آیا اشتراک تعهد بلندمدت دارد؟", a: "خیر؛ همه‌ی طرح‌ها ماهانه یا سالانه هستند و در هر زمان قابل لغو. هزینه‌ی روزهای باقی‌مانده‌ی دوره هم به کیف پول شما برمی‌گردد." },
  { q: "تخفیف پله‌ای کمپین‌ها با تخفیف اشتراک جمع می‌شود؟", a: "بله؛ مشترکان علاوه بر پله‌های عمومی هر کمپین، یک پله‌ی اختصاصی هم می‌گیرند. در عمل یعنی همیشه یک پله جلوتر از بقیه هستید." },
  { q: "طرح سازمانی چند کاربر را پشتیبانی می‌کند؟", a: "تا ۲۵ کاربر همزمان با نقش‌های متفاوت (ثبت سفارش، تأیید، مالی). برای سازمان‌های بزرگ‌تر، طرح اختصاصی طراحی می‌شود." },
];

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const toast = useToast();
  const { user } = useSession();
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  const price = yearly ? plan.monthly * 10 : plan.monthly;

  const handleClick = () => {
    if (!user) {
      toast.push("info", "برای خرید اشتراک ابتدا وارد شوید؛ می‌توانید از ورود نمایشی هدر استفاده کنید.");
      return;
    }
    setState("processing");
    setTimeout(() => {
      setState("done");
      toast.push("success", `درخواست طرح ${plan.name} ثبت شد (نمایشی). در نسخه‌ی اصلی به درگاه پرداخت می‌روید.`);
      setTimeout(() => setState("idle"), 2200);
    }, 1400);
  };

  return (
    <div className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${plan.popular ? "border-navy-600 lg:-translate-y-3 lg:hover:-translate-y-4" : "border-navy-100"}`}>
      {plan.popular && (
        <span className="absolute -top-3.5 right-6 flex items-center gap-1 rounded-full bg-sun-500 px-3.5 py-1 text-[11px] font-extrabold text-navy-950 shadow-md">
          <Crown className="h-3 w-3" aria-hidden="true" />
          محبوب‌ترین
        </span>
      )}
      <h2 className="font-display text-[24px] text-navy-900">{plan.name}</h2>
      <p className="mt-1 text-[12px] leading-6 text-slate-500">{plan.desc}</p>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="font-display text-[42px] leading-none text-navy-900">{faNum(price)}</span>
        <span className="text-[11.5px] font-bold text-slate-400">هزار تومان / {yearly ? "سالانه" : "ماهانه"}</span>
      </div>
      {yearly && (
        <p className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-0.5 text-[10.5px] font-extrabold text-leaf-700">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          ۲ ماه رایگان
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-paper px-3 py-2.5 text-center">
          <p className="text-[9.5px] font-extrabold text-slate-400">سهمیه‌ی خرید</p>
          <p className="mt-0.5 font-display text-[14px] leading-5 text-navy-800">{plan.quota}</p>
        </div>
        <div className="rounded-xl bg-paper px-3 py-2.5 text-center">
          <p className="text-[9.5px] font-extrabold text-slate-400">کارمزد</p>
          <p className="mt-0.5 font-display text-[14px] leading-5 text-navy-800">{plan.feeCap}</p>
        </div>
      </div>
      <ul className="mt-5 flex-1 space-y-3 border-t border-dashed border-navy-100 pt-5">
        {plan.features.map((f) => (
          <li key={f.text} className={`flex items-center gap-2.5 text-[12.5px] font-semibold ${f.included ? "text-slate-600" : "text-slate-300"}`}>
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${f.included ? "bg-leaf-100" : "bg-navy-50"}`}>
              {f.included ? <Check className="h-3 w-3 text-leaf-600" strokeWidth={3} aria-hidden="true" /> : <X className="h-3 w-3 text-navy-200" strokeWidth={3} aria-hidden="true" />}
            </span>
            {f.text}
          </li>
        ))}
      </ul>
      <button
        onClick={handleClick}
        disabled={state !== "idle"}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-extrabold transition disabled:cursor-wait ${
          state === "done"
            ? "bg-leaf-500 text-white"
            : plan.popular
              ? "press bg-navy-600 text-white hover:-translate-y-0.5 hover:bg-navy-700"
              : "press border border-navy-200 text-navy-700 hover:-translate-y-0.5 hover:border-navy-400 hover:bg-navy-50"
        }`}
      >
        {state === "processing" && <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {state === "idle" && `انتخاب طرح ${plan.name}`}
        {state === "processing" && "در حال انتقال به درگاه…"}
        {state === "done" && "درخواست ثبت شد (دمو)"}
      </button>
    </div>
  );
}

export default function PlansPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user } = useSession();

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------- ماست‌هد ---------- */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pattern-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-navy-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-sun-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11.5px] font-bold text-navy-300" aria-label="مسیر راهنما">
            <Link to="/campaigns" className="transition hover:text-white">خانه</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            <span className="text-sun-400">طرح‌های اشتراک</span>
          </nav>

          <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sun-500/40 bg-sun-500/10 px-3.5 py-1.5 text-[11.5px] font-extrabold text-sun-400">
                <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                {user?.hasActivePlan ? `اشتراک فعال: ${user.planName}` : "هم‌بردی‌ها یک پله جلوترند"}
              </span>
              <h1 className="mt-4 font-display text-[44px] leading-[1.3] text-white sm:text-[54px]">
                طرح‌های اشتراک <span className="text-sun-400">هم‌برد</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-8 text-navy-200">
                هزینه‌ی اشتراک معمولاً با اولین سفارش برمی‌گردد؛ مشترکان به‌طور میانگین ماهی ۳۴۰ هزار تومان بیش از خرید عادی صرفه‌جویی می‌کنند.
              </p>
            </div>
            <div className="flex w-fit items-center gap-1 rounded-xl border border-navy-700 bg-navy-900/70 p-1.5 backdrop-blur-sm">
              <button onClick={() => setYearly(false)} className={`rounded-lg px-4 py-2 text-[12.5px] font-extrabold transition ${!yearly ? "bg-sun-500 text-navy-950 shadow" : "text-navy-300 hover:text-white"}`}>
                ماهانه
              </button>
              <button onClick={() => setYearly(true)} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-extrabold transition ${yearly ? "bg-sun-500 text-navy-950 shadow" : "text-navy-300 hover:text-white"}`}>
                سالانه
                <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-extrabold ${yearly ? "bg-navy-950 text-sun-400" : "bg-leaf-500/20 text-leaf-400"}`}>۲ ماه رایگان</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 110}>
              <PlanCard plan={plan} yearly={yearly} />
            </Reveal>
          ))}
        </div>

        {/* نوار تضمین */}
        <Reveal>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 shadow-card sm:grid-cols-4">
            {[
              { icon: Wallet, t: "بازگشت وجه", s: "روزهای استفاده‌نشده" },
              { icon: RefreshCw, t: "لغو در هر زمان", s: "بدون جریمه" },
              { icon: BadgeCheck, t: "ضمانت کیفیت", s: "تأمین‌کننده‌ی تأییدشده" },
              { icon: Crown, t: "پله‌ی اختصاصی", s: "همیشه جلوتر از بقیه" },
            ].map((b) => (
              <div key={b.t} className="bg-white px-4 py-5 text-center">
                <b.icon className="mx-auto h-5 w-5 text-sun-600" aria-hidden="true" />
                <p className="mt-2 text-[12.5px] font-extrabold text-navy-900">{b.t}</p>
                <p className="mt-0.5 text-[10.5px] font-bold text-slate-400">{b.s}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-center font-display text-[30px] text-navy-900">سوالات پرتکرار</h2>
            <div className="mt-6 space-y-3">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.q} className={`overflow-hidden rounded-xl border bg-white transition-colors ${open ? "border-navy-300 shadow-card" : "border-navy-100"}`}>
                    <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start" aria-expanded={open}>
                      <span className="text-[13.5px] font-extrabold text-navy-800">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-[12.5px] leading-7 text-slate-500">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
