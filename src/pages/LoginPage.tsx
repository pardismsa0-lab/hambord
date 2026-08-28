import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronLeft, LogIn, Sparkles, TrendingDown, Wallet } from "lucide-react";
import { Logo } from "../components/Layout";
import { PERSONAS, ROLE_LABELS, useSession, type Role } from "../lib/session";
import { faNum } from "../lib/data";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useSession();
  const [choosing, setChoosing] = useState<Role | null>(null);

  const redirect = params.get("redirect");
  const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/campaigns";

  const doLogin = (role: Exclude<Role, "guest">) => {
    setChoosing(role);
    login(role);
    setTimeout(() => navigate(safeRedirect, { replace: true }), 450);
  };

  const personaEntries = Object.entries(PERSONAS) as [Exclude<Role, "guest">, (typeof PERSONAS)["family"]][];

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      {/* پنل برند */}
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <div className="pattern-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-navy-600/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sun-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo dark />
          <div>
            <h1 className="font-display text-[50px] leading-[1.3] text-white">
              هم‌بردی‌ها<br />
              همیشه <span className="text-sun-400">یک پله جلوترند</span>
            </h1>
            <ul className="mt-8 space-y-4">
              {[
                { icon: TrendingDown, title: "پله‌های تخفیف اختصاصی", text: "مشترکان از پله‌ی آخرِ قیمت شروع می‌کنند." },
                { icon: Wallet, title: "کش‌بک خودکار پله‌ای", text: "با هر پله‌ی جدید، مابه‌التفاوت به کیف پول برمی‌گردد." },
                { icon: BadgeCheck, title: "سهمیه‌ی بالاتر", text: "تا ۵۰۰ میلیون تومان برای خریدهای سازمانی." },
              ].map((b) => (
                <li key={b.title} className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-800 text-sun-400">
                    <b.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[14px] font-extrabold text-white">{b.title}</span>
                    <span className="mt-0.5 block text-[12px] leading-6 text-navy-300">{b.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-floaty w-fit rotate-2 rounded-2xl bg-sun-500 p-5 text-navy-950 shadow-lift">
            <p className="flex items-center gap-2 text-[11px] font-extrabold">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              میانگین صرفه‌جویی مشترکان
            </p>
            <p className="mt-1 font-display text-[30px] leading-8">{faNum(340)} هزار تومان / ماه</p>
          </div>
        </div>
      </div>

      {/* فرم ورود */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to={safeRedirect} className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-slate-400 transition hover:text-navy-600">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            بازگشت به صفحه‌ی قبل
          </Link>
          <div className="mt-6 lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-6 font-display text-[36px] text-navy-900">ورود به هم‌برد</h2>
          <p className="mt-2 text-[13px] leading-7 text-slate-500">
            {redirect ? "برای ادامه‌ی کار، وارد شوید؛ بعد از ورود مستقیم به صفحه‌ی موردنظر برمی‌گردید." : "با حساب کاربری‌تان وارد شوید تا کمپین‌ها و کش‌بک‌هایتان را ببینید."}
          </p>

          <div className="mt-8 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <p className="flex items-center gap-2 text-[12.5px] font-extrabold text-navy-700">
              <LogIn className="h-4 w-4 text-sun-600" aria-hidden="true" />
              ورود نمایشی — نقش دلخواه را انتخاب کنید
            </p>
            <div className="mt-4 grid gap-2.5">
              {personaEntries.map(([key, persona]) => (
                <button
                  key={key}
                  onClick={() => doLogin(key)}
                  disabled={choosing !== null}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-start transition-all duration-200 disabled:opacity-60 ${choosing === key ? "border-leaf-500 bg-leaf-50" : "border-navy-100 hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-card"}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[12px] font-bold text-white" style={{ backgroundColor: persona.color }}>
                    {persona.initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-extrabold text-navy-900">{persona.name}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-400">
                      {ROLE_LABELS[persona.role]}
                      {persona.hasActivePlan && <span className="ms-1.5 rounded-full bg-leaf-100 px-1.5 py-0.5 text-[9.5px] font-extrabold text-leaf-700">اشتراک فعال</span>}
                    </span>
                  </span>
                  <ChevronLeft className="h-4 w-4 text-navy-300" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-navy-50 px-3 py-2.5 text-[10.5px] leading-5 text-navy-500">
              این یک محیط نمایشی است؛ ورود واقعی با شماره موبایل در نسخه‌ی اصلی فعال می‌شود. نقش انتخابی برای تست رفتار صفحه‌ها (سهمیه، کش‌بک، CTA) ذخیره می‌ماند.
            </p>
          </div>

          <button onClick={() => navigate(safeRedirect)} className="press mt-5 w-full rounded-xl border border-dashed border-navy-300 py-3 text-[12.5px] font-extrabold text-navy-500 transition hover:border-navy-500 hover:bg-white">
            ادامه به‌عنوان مهمان
          </button>
        </div>
      </div>
    </div>
  );
}
