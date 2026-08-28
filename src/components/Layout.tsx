import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, Mail, MapPin, Menu, Phone, UserPlus, X, Zap } from "lucide-react";
import { PERSONAS, ROLE_LABELS, useSession, type Role } from "../lib/session";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/campaigns" className="group flex items-center gap-2.5" aria-label="هم‌برد — صفحه کمپین‌ها">
      <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-navy-600 shadow-[0_6px_16px_-6px_rgb(26_75_140/0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
          <path d="M8 13.5h16l-2.1 8.6a2.1 2.1 0 0 1-2.04 1.6H12.1a2.1 2.1 0 0 1-2.04-1.6L8 13.5z" fill="#F5A623" />
          <circle cx="12.3" cy="9.4" r="2.2" fill="#fff" />
          <circle cx="19.7" cy="9.4" r="2.2" fill="#fff" opacity="0.85" />
          <path d="M12.7 16.4v3.4M16 16.4v3.4M19.3 16.4v3.4" stroke="#0B2545" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-leaf-500 ring-2 ring-white/80" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[26px] ${dark ? "text-white" : "text-navy-800"}`}>هم‌برد</span>
        <span className={`mt-0.5 block text-[10.5px] font-medium tracking-[0.18em] ${dark ? "text-navy-200" : "text-navy-400"}`}>
          خرید جمعی هوشمند
        </span>
      </span>
    </Link>
  );
}

const TICKER = [
  "کمپین زعفران نگین؛ فقط ۸ بسته باقی مانده",
  "کمپین عسل کُنار تا ۳ روز دیگر شروع می‌شود",
  "میانگین صرفه‌جویی اعضای خانوار این ماه: ۳۴۰ هزار تومان",
  "تأمین‌کننده‌ی جدید: باغداران رفسنجان به شبکه اضافه شد",
];

function TickerBar() {
  const track = [...TICKER, ...TICKER];
  return (
    <div className="marquee overflow-hidden border-b border-navy-800 bg-navy-950 py-2 text-[12.5px] text-navy-100" dir="ltr">
      <div className="marquee-track" dir="rtl">
        {track.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 px-5" aria-hidden={i >= TICKER.length}>
            <Zap className="h-3.5 w-3.5 fill-sun-500 text-sun-500" aria-hidden="true" />
            <span className="whitespace-nowrap font-medium">{item}</span>
            <span className="h-1 w-1 rounded-full bg-navy-600" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { user, login, logout } = useSession();
  const location = useLocation();
  const [params] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) setLoginMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setLoginMenuOpen(false);
  }, [location, params]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCampaigns = location.pathname.startsWith("/campaigns");
  const isSuppliers = location.pathname.startsWith("/supplier");
  const isBlog = location.pathname.startsWith("/blog");
  const isPlans = location.pathname === "/subscriptions/plans";
  const category = params.get("category");

  const links = [
    { to: "/campaigns", label: "کمپین‌ها", active: isCampaigns },
    { to: "/suppliers", label: "تأمین‌کننده‌ها", active: isSuppliers },
    { to: "/blog", label: "بلاگ", active: isBlog && category !== "kharid-pollei" },
    { to: "/blog?category=kharid-pollei", label: "خرید پله‌ای", active: isBlog && category === "kharid-pollei" },
    { to: "/subscriptions/plans", label: "طرح‌های اشتراک", active: isPlans },
  ];

  const personaEntries = Object.entries(PERSONAS) as [Exclude<Role, "guest">, (typeof PERSONAS)["family"]][];

  return (
    <>
      {!scrolled && <TickerBar />}
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "border-navy-100 shadow-[0_8px_30px_-12px_rgb(11_37_69/0.18)]" : "border-navy-100"
        }`}
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 lg:px-8 ${scrolled ? "h-[56px]" : "h-[68px]"}`}>
          <Logo />
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="منوی اصلی">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`group relative rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors lg:px-3.5 lg:text-sm ${
                  l.active ? "text-navy-700" : "text-slate-500 hover:text-navy-600"
                }`}
              >
                {l.label}
                <span className={`absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-sun-500 transition-all duration-300 ${l.active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/60 py-1.5 pe-2.5 ps-1.5 transition hover:border-navy-200 hover:bg-navy-50"
                  aria-expanded={userMenuOpen}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: user.color }}>
                    {user.initials}
                  </span>
                  <span className="hidden text-sm font-semibold text-navy-800 sm:block">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 origin-top-left overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lift">
                    <div className="border-b border-navy-50 bg-navy-50/50 px-4 py-3">
                      <p className="text-sm font-bold text-navy-800">{user.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        نقش:
                        <span className="rounded-full bg-navy-600 px-2 py-0.5 text-[10.5px] font-bold text-white">{ROLE_LABELS[user.role]}</span>
                        {user.hasActivePlan && <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[10.5px] font-bold text-leaf-700">اشتراک فعال</span>}
                      </p>
                    </div>
                    <div className="p-1.5">
                      {user.role === "admin" && (
                        <Link to="/campaigns" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-navy-50 hover:text-navy-700">
                          <LayoutDashboard className="h-4 w-4 text-navy-400" />
                          مدیریت کمپین‌ها
                          <span className="ms-auto rounded bg-sun-100 px-1.5 py-0.5 text-[10px] font-bold text-sun-700">پنل ادمین</span>
                        </Link>
                      )}
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                        <LogOut className="h-4 w-4" />
                        خروج از حساب
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={loginRef}>
                <button
                  onClick={() => setLoginMenuOpen((v) => !v)}
                  className="press flex items-center gap-2 rounded-xl bg-navy-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgb(26_75_140/0.8)] transition hover:-translate-y-0.5 hover:bg-navy-700"
                  aria-expanded={loginMenuOpen}
                >
                  <UserPlus className="h-4 w-4" />
                  ورود / ثبت‌نام
                </button>
                {loginMenuOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 origin-top-left overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lift">
                    <div className="border-b border-navy-50 px-4 py-3">
                      <p className="text-sm font-bold text-navy-800">ورود نمایشی با نقش دلخواه</p>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-slate-500">برای تست رفتار صفحه بر اساس سطح دسترسی، یک نقش انتخاب کنید.</p>
                    </div>
                    <div className="p-1.5">
                      {personaEntries.map(([key, persona]) => (
                        <button key={key} onClick={() => { login(key); setLoginMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start transition hover:bg-navy-50">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: persona.color }}>
                            {persona.initials}
                          </span>
                          <span>
                            <span className="block text-[13px] font-bold text-navy-800">{persona.name}</span>
                            <span className="block text-[11px] text-slate-500">
                              {ROLE_LABELS[persona.role]}
                              {persona.hasActivePlan ? " • اشتراک فعال" : " • بدون اشتراک"}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-navy-100 text-navy-700 transition hover:bg-navy-50 md:hidden"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-navy-50 bg-white px-4 pb-5 pt-3 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="منوی موبایل">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${l.active ? "bg-navy-50 text-navy-700" : "text-slate-600 hover:bg-navy-50/60"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
            {!user && (
              <div className="mt-3 border-t border-dashed border-navy-100 pt-3">
                <p className="mb-2 px-3 text-[11px] font-bold text-slate-400">ورود نمایشی:</p>
                <div className="grid grid-cols-2 gap-2">
                  {personaEntries.map(([key, persona]) => (
                    <button key={key} onClick={() => { login(key); setMenuOpen(false); }} className="flex items-center gap-2 rounded-lg border border-navy-100 px-2.5 py-2 text-xs font-bold text-navy-700 transition hover:bg-navy-50">
                      <span className="grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: persona.color }}>
                        {persona.initials}
                      </span>
                      {ROLE_LABELS[persona.role]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

const SOCIALS = [
  { label: "اینستاگرام", href: "https://instagram.com", path: "M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.9 4.9.06 1.3.07 1.6.07 4.83 0 3.2-.01 3.6-.07 4.83-.15 3.2-1.66 4.77-4.9 4.92-1.3.06-1.6.07-4.9.07-3.2 0-3.6-.01-4.83-.07-3.3-.15-4.8-1.66-4.92-4.92C2.2 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9C2.4 3.9 3.9 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.4-3.7a1.44 1.44 0 1 0 0 2.9 1.44 1.44 0 0 0 0-2.9z" },
  { label: "تلگرام", href: "https://telegram.org", path: "M21.9 4.6c.3-1.2-.9-2.2-2-1.7L2.7 9.6c-1.2.5-1.2 2.2.1 2.6l4.4 1.4 1.7 5.3c.4 1.2 1.9 1.5 2.7.6l2.4-2.4 4.4 3.2c1 .7 2.4.2 2.7-1L21.9 4.6zM8.5 13l8.6-5.5c.4-.2.8.3.4.6l-7 6.5-.3 3-1.7-4.6z" },
  { label: "ایکس", href: "https://x.com", path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2zm-1.1 18.1h1.7L7.1 3.8H5.3l12.5 16.3z" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-navy-950 text-navy-100">
      <div className="pattern-dots absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-navy-600/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-sun-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-[13px] leading-7 text-navy-200">
              هم‌برد پلتفرم خرید جمعی است؛ جایی که خانوارها و کسب‌وکارها با هم به قیمت تولیدکننده می‌رسند و تأمین‌کننده‌ها مستقیم می‌فروشند.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-lg border border-navy-700 text-navy-300 transition hover:-translate-y-0.5 hover:border-sun-500 hover:text-sun-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg text-white">دسترسی سریع</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "کمپین‌های فعال", to: "/campaigns" },
                { label: "تأمین‌کننده‌های شبکه", to: "/suppliers" },
                { label: "بلاگ و راهنماها", to: "/blog" },
                { label: "آموزش خرید پله‌ای", to: "/blog?category=kharid-pollei" },
                { label: "طرح‌های اشتراک", to: "/subscriptions/plans" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="group inline-flex items-center gap-2 text-[13px] text-navy-200 transition hover:text-sun-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 transition group-hover:w-3 group-hover:bg-sun-500" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-white">تماس با ما</h3>
            <ul className="mt-4 space-y-3 text-[13px] text-navy-200">
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />تهران، خیابان ولی‌عصر، برج تعاون، طبقه‌ی هفتم</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-sun-500" /><a href="tel:02191009900" dir="ltr" className="transition hover:text-sun-400">۰۲۱-۹۱۰۰۹۹۰۰</a></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-sun-500" /><a href="mailto:hello@hambord.ir" dir="ltr" className="transition hover:text-sun-400">hello@hambord.ir</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-[12px] text-navy-300">© ۱۴۰۵ هم‌برد — خرید جمعی هوشمند. همه‌ی حقوق محفوظ است.</p>
          <span className="rounded-lg border border-navy-700 px-2.5 py-1.5 text-[10.5px] font-medium text-navy-300">نسخه‌ی نمایشی — داده‌ها آزمایشی‌اند</span>
        </div>
      </div>
    </footer>
  );
}
