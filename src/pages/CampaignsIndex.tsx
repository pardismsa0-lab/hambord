import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarClock, ChevronLeft, Flame, Lock, TrendingDown, Zap } from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, SmartImage, Stars } from "../components/ui";
import { CAMPAIGNS, computeImpact, faNum, formatPrice, pctFa, type Campaign } from "../lib/data";
import { useSession } from "../lib/session";

/* ---------------- شمارنده معکوس ---------------- */
function useCountdown(targetIso: string) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(targetIso).getTime() - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(targetIso).getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [targetIso]);
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/* ---------------- هیروی نردبان قیمت زنده ---------------- */
const BUYERS = ["سارا از تهران", "بابک از اصفهان", "مریم از شیراز", "علی از مشهد", "نگار از تبریز", "حسین از کرج", "لیلا از رشت", "امیر از اهواز"];

function LiveTierHero() {
  const c = CAMPAIGNS[0];
  const [offset, setOffset] = useState(0);
  const [feed, setFeed] = useState<{ id: number; text: string; tierMaker: boolean }[]>([
    { id: 0, text: "سارا از تهران ۳ کیلوگرم خرید", tierMaker: false },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setOffset((o) => {
        const next = o + 2 + Math.floor(Math.random() * 4);
        const before = computeImpact(c, 0, "regular", o).projectedTier.tierNumber;
        const after = computeImpact(c, 0, "regular", next).projectedTier.tierNumber;
        const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
        const units = 2 + Math.floor(Math.random() * 5);
        setFeed((f) => [{ id: Date.now(), text: `${buyer} ${faNum(units)} کیلوگرم خرید`, tierMaker: after > before }, ...f.slice(0, 4)]);
        return next;
      });
    }, 3400);
    return () => clearInterval(t);
  }, [c]);

  const impact = computeImpact(c, 0, "regular", offset);
  const discount = impact.discountPct;
  const progress = Math.min(100, (impact.tieredSold / c.totalQuantity) * 100);
  const currentTier = impact.projectedTier;

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pattern-dots absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-navy-600/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-sun-500/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-20">
        {/* متن */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sun-500/40 bg-sun-500/10 px-3.5 py-1.5 text-[11.5px] font-extrabold text-sun-400">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            خرید جمعی هوشمند — قیمت با هر خرید پایین می‌آید
          </span>
          <h1 className="mt-5 font-display text-[44px] leading-[1.3] sm:text-[58px]">
            هرچه بیشتر بخریم،
            <br />
            <span className="text-sun-400">همه</span> ارزان‌تر می‌خریم
          </h1>
          <p className="mt-5 max-w-xl text-[14.5px] leading-8 text-navy-200">
            در هم‌برد، سفارش‌های خردِ خانوارها و کسب‌وکارها به یک سفارش بزرگ تبدیل می‌شود و مستقیم از تأمین‌کننده‌ی تأییدشده خرید می‌شود. قیمت روی یک نردبان پله‌ای حرکت می‌کند؛ با هر خریدِ گروه، یک پله پایین‌تر.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="#campaigns" className="shine press flex items-center gap-2 rounded-xl bg-sun-500 px-7 py-3.5 text-[14px] font-extrabold text-navy-950 shadow-[0_12px_28px_-10px_rgb(245_166_35/0.8)] transition hover:-translate-y-0.5 hover:bg-sun-400">
              مشاهده‌ی کمپین‌های فعال
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/blog?category=kharid-pollei" className="press flex items-center gap-2 rounded-xl border border-navy-700 px-6 py-3.5 text-[13.5px] font-extrabold text-white transition hover:-translate-y-0.5 hover:border-sun-500 hover:text-sun-400">
              خرید پله‌ای چیست؟
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-y-5">
            {[
              { v: faNum(48_200), l: "عضو فعال" },
              { v: faNum(340), l: "هزار تومان صرفه‌جویی ماهانه" },
              { v: "٪" + faNum(31), l: "میانگین تخفیف پله‌ی آخر" },
            ].map((s, i) => (
              <div key={s.l} className={`pe-7 ${i > 0 ? "border-e border-navy-700 ps-7" : ""}`}>
                <div className="font-display text-[26px] leading-8 text-white">{s.v}</div>
                <div className="mt-1 text-[10.5px] font-bold text-navy-300">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* نردبان قیمت زنده */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/70 p-6 shadow-lift backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-navy-300">کمپین زنده</p>
              <h2 className="mt-0.5 font-display text-[22px] text-white">{c.shortTitle} — {c.title.split("—")[1]?.trim() ?? ""}</h2>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-leaf-500/15 px-3 py-1 text-[10.5px] font-extrabold text-leaf-400">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf-400" aria-hidden="true" />
              زنده
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span key={currentTier.tierNumber} className="value-pop font-display text-[46px] leading-none text-white">
              {formatPrice(currentTier.unitPrice)}
            </span>
            <span className="text-[13px] font-bold text-navy-300">تومان / کیلوگرم</span>
            <span className="rounded-lg bg-leaf-500 px-2 py-1 text-[11px] font-extrabold text-white">٪{pctFa(discount)} تخفیف</span>
          </div>
          <p className="mt-1.5 text-[11px] font-bold text-navy-400">
            قیمت پایه: <s>{formatPrice(c.priceMax)}</s> تومان
          </p>

          {/* نردبان پله‌ها */}
          <div className="mt-6 space-y-2">
            {c.tiers.map((t) => {
              const reached = impact.tieredSold >= t.threshold || currentTier.tierNumber >= t.tierNumber;
              const isCurrent = currentTier.tierNumber === t.tierNumber;
              return (
                <div
                  key={t.tierNumber}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2.5 transition-all duration-500 ${
                    isCurrent ? "tier-glow border-sun-500 bg-sun-500/10" : reached ? "border-navy-700 bg-navy-800/50" : "border-navy-800 bg-navy-900/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-7 w-7 place-items-center rounded-lg font-display text-[15px] ${isCurrent ? "bg-sun-500 text-navy-950" : reached ? "bg-leaf-500 text-white" : "bg-navy-800 text-navy-400"}`}>
                      {faNum(t.tierNumber)}
                    </span>
                    <span className={`text-[12px] font-bold ${isCurrent ? "text-white" : "text-navy-300"}`}>
                      از {faNum(t.threshold)} کیلوگرم
                    </span>
                  </div>
                  <span className={`font-display text-[19px] ${isCurrent ? "text-sun-400" : "text-navy-200"}`}>{formatPrice(t.unitPrice)}</span>
                </div>
              );
            })}
          </div>

          {/* نوار پیشرفت */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-[10.5px] font-extrabold text-navy-300">
              <span>{faNum(impact.tieredSold)} کیلوگرم فروخته‌شده</span>
              <span>هدف: {faNum(c.totalQuantity)} کیلوگرم</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-navy-800">
              <div className="h-full rounded-full bg-gradient-to-l from-sun-500 to-leaf-400 transition-[width] duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* فید خرید زنده */}
          <div className="mt-6 border-t border-navy-800 pt-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-[10.5px] font-extrabold text-navy-400">
              <Flame className="h-3.5 w-3.5 text-sun-500" aria-hidden="true" />
              خریدهای همین لحظه
            </p>
            <ul className="space-y-1.5">
              {feed.map((f) => (
                <li key={f.id} className={`feed-in flex items-center justify-between text-[11.5px] font-bold ${f.tierMaker ? "text-sun-400" : "text-navy-300"}`}>
                  <span>{f.text}</span>
                  {f.tierMaker && <span className="rounded-full bg-sun-500 px-2 py-0.5 text-[9px] font-extrabold text-navy-950">پله‌ساز!</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- کارت کمپین ---------------- */
function CampaignCard({ c, index }: { c: Campaign; index: number }) {
  const navigate = useNavigate();
  const impact = computeImpact(c, 0, "regular");
  const progress = Math.min(100, Math.round((c.soldCount / c.totalQuantity) * 100));
  const remaining = Math.max(0, c.totalQuantity - c.soldCount);
  const ended = c.status === "closed";
  const scheduled = c.status === "scheduled";
  const cd = useCountdown(scheduled ? c.startDate : c.endDate);

  return (
    <Reveal delay={(index % 2) * 100}>
      <div
        role="link"
        tabIndex={0}
        onClick={() => navigate(`/campaigns/${c.slug}`)}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/campaigns/${c.slug}`)}
        className={`shine group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${ended ? "border-navy-100 opacity-90" : "border-navy-100 hover:border-navy-200"}`}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-navy-100">
          <SmartImage src={c.images[0]} alt={c.title} className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07] ${ended ? "grayscale-[35%]" : ""}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" aria-hidden="true" />
          {scheduled && (
            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-900/80 px-3 py-1.5 text-[10.5px] font-extrabold text-sun-400 backdrop-blur-sm">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              شروع تا {faNum(cd.days)} روز و {faNum(cd.hours)} ساعت
            </span>
          )}
          {ended && (
            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-navy-900/80 px-3 py-1.5 text-[10.5px] font-extrabold text-navy-200 backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              پایان‌یافته
            </span>
          )}
          {!ended && !scheduled && (
            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-leaf-500 px-3 py-1.5 text-[10.5px] font-extrabold text-white shadow">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
              فعال — {faNum(cd.days)} روز و {faNum(cd.hours)} ساعت مانده
            </span>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-extrabold text-navy-800 backdrop-blur-sm">
            {c.category}
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-navy-900/80 px-2.5 py-1 text-[10px] font-extrabold text-sun-400 backdrop-blur-sm">
            ٪{pctFa(impact.discountPct)} تخفیف فعلی
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="clamp-2 text-[16.5px] font-extrabold leading-7 text-navy-900 transition-colors group-hover:text-navy-600">
            {c.title}
          </h3>
          <p className="mt-1.5 text-[11px] font-bold text-slate-400">
            <Link to={`/suppliers/${c.supplier.id}`} onClick={(e) => e.stopPropagation()} className="font-extrabold text-navy-500 underline decoration-sun-400 decoration-[1.5px] underline-offset-4 transition hover:text-navy-800">
              {c.supplier.brandName}
            </Link>{" "}
            • {c.category}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-[26px] leading-7 text-navy-900">{formatPrice(impact.unitPrice)}</span>
            <span className="text-[11px] font-bold text-navy-400">تومان / {c.unitLabel}</span>
            <s className="ms-auto text-[11px] font-bold text-slate-300">{formatPrice(c.priceMax)}</s>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
              <span>پله‌ی {faNum(impact.projectedTier.tierNumber)} از {faNum(c.tiers.length)}</span>
              <span>{faNum(remaining)} {c.unitLabel} باقی‌مانده</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-navy-100">
              <div className={`h-full rounded-full transition-[width] duration-1000 ${ended ? "bg-navy-400" : "bg-gradient-to-l from-sun-500 to-leaf-400"}`} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-dashed border-navy-100 pt-4 [margin-top:1rem]">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Stars rating={c.supplier.ratingAvg} size={12} />
              {faNum(c.supplier.ratingAvg.toString().replace(".", "٫"))}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-sun-600 transition-colors group-hover:text-sun-700">
              {ended ? "مشاهده‌ی نتیجه" : "مشاهده‌ی کمپین"}
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- صفحه ---------------- */
export default function CampaignsIndex() {
  const [filter, setFilter] = useState<string | null>(null);
  const { user } = useSession();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    CAMPAIGNS.forEach((c) => map.set(c.category, (map.get(c.category) ?? 0) + 1));
    return Array.from(map.entries());
  }, []);

  const list = filter ? CAMPAIGNS.filter((c) => c.category === filter) : CAMPAIGNS;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <LiveTierHero />

      <main id="campaigns" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-extrabold text-sun-600">در حال برگزاری</span>
              <h2 className="relative mt-1 inline-block font-display text-[32px] leading-tight text-navy-900 sm:text-[38px]">
                کمپین‌های خرید جمعی
                <svg viewBox="0 0 130 8" className="absolute -bottom-1 left-0 h-2 w-full" aria-hidden="true">
                  <path d="M3 6 C 35 1, 95 1, 127 5" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
                </svg>
              </h2>
              <p className="mt-4 max-w-2xl text-[13.5px] leading-8 text-slate-500">
                {user ? `${user.name} عزیز، ` : ""}روی هر کمپین بزنید تا تأثیر خریدتان را روی پله‌ها زنده ببینید. قیمت با هر خریدِ گروه پایین می‌آید و خریدهای قبلی کش‌بک می‌گیرند.
              </p>
            </div>
            <Link to="/suppliers" className="press ms-auto hidden items-center gap-1.5 rounded-lg border border-navy-200 px-4 py-2 text-[11.5px] font-extrabold text-navy-600 transition hover:-translate-y-0.5 hover:border-sun-400 hover:bg-sun-50 sm:flex">
              تأمین‌کننده‌های شبکه
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button onClick={() => setFilter(null)} className={`rounded-full border px-4 py-2 text-[12px] font-extrabold transition ${filter === null ? "border-transparent bg-navy-700 text-white shadow" : "border-navy-200 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-700"}`}>
              همه ({faNum(CAMPAIGNS.length)})
            </button>
            {categories.map(([name, count]) => (
              <button key={name} onClick={() => setFilter(filter === name ? null : name)} className={`rounded-full border px-4 py-2 text-[12px] font-extrabold transition ${filter === name ? "border-transparent bg-navy-700 text-white shadow" : "border-navy-200 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-700"}`}>
                {name} ({faNum(count)})
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-7 md:grid-cols-2">
          {list.map((c, i) => (
            <CampaignCard key={c.slug} c={c} index={i} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
