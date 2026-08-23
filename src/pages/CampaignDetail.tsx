import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, ChevronDown, ChevronLeft, Eye, Flame, Heart,
  Home, Lock, MessageCircle, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag,
  TrendingDown, Truck, Wallet, X,
} from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Modal, Reveal, SmartImage, Stars, useToast } from "../components/ui";
import {
  cashbackFor, computeImpact, faNum, formatPrice, getCampaign, pctFa, type Campaign, type ImpactResult, type OrderType,
} from "../lib/data";
import { ROLE_QUOTA, useSession } from "../lib/session";

const ORDER_TYPES: OrderType[] = ["regular", "tiered"];

/* ---------- شمارنده ---------- */
function useCountdown(targetIso: string, enabled: boolean) {
  const [left, setLeft] = useState(() => (enabled ? Math.max(0, new Date(targetIso).getTime() - Date.now()) : 0));
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => setLeft(Math.max(0, new Date(targetIso).getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [targetIso, enabled]);
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownBoxes({ c }: { c: Campaign }) {
  const scheduled = c.status === "scheduled";
  const cd = useCountdown(scheduled ? c.startDate : c.endDate, c.status !== "closed");
  if (c.status === "closed") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-navy-700 bg-navy-800/60 px-4 py-3 text-[12.5px] font-extrabold text-navy-200">
        <Lock className="h-4 w-4 text-navy-400" aria-hidden="true" />
        این کمپین به پایان رسیده است
      </div>
    );
  }
  const label = scheduled ? "تا شروع کمپین" : "تا پایان کمپین";
  const boxes = [
    { v: cd.days, l: "روز" },
    { v: cd.hours, l: "ساعت" },
    { v: cd.minutes, l: "دقیقه" },
    { v: cd.seconds, l: "ثانیه" },
  ];
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold text-navy-300">
        <CalendarClock className={`h-3.5 w-3.5 ${scheduled ? "text-sun-400" : "text-rose-400"}`} aria-hidden="true" />
        {label}
      </p>
      <div className="flex items-center gap-2" dir="ltr">
        {boxes.map((b, i) => (
          <div key={b.l} className="flex items-center gap-2">
            <div className="w-14 rounded-xl border border-navy-700 bg-navy-800/70 py-2.5 text-center">
              <div className="font-display text-[24px] leading-6 text-white">{faNum(String(b.v).padStart(2, "0"))}</div>
              <div className="text-[9px] font-bold text-navy-300">{b.l}</div>
            </div>
            {i < boxes.length - 1 && <span className="font-display text-[18px] text-navy-500">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- نردبان قیمت و پیش‌نمایش زنده ---------- */
function TierLadder({ c, impact, liveFlash }: { c: Campaign; impact: ImpactResult; liveFlash: boolean }) {
  const [open, setOpen] = useState(false);
  const displayTier = impact.orderType === "tiered" ? impact.projectedTier : impact.projectedTier;
  const totalFill = Math.min(100, impact.baseFillPct + impact.userFillPct);
  const marker = Math.max(5, Math.min(95, totalFill));

  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8" aria-label="قیمت‌گذاری پله‌ای">
        <div className="pattern-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 font-display text-[26px] text-navy-900">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-600 text-white">
                <TrendingDown className="h-5 w-5" aria-hidden="true" />
              </span>
              قیمت‌گذاری پله‌ای
              <span className="flex items-center gap-1.5 rounded-full bg-leaf-50 px-2.5 py-1 font-sans text-[10.5px] font-extrabold text-leaf-700">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-leaf-500" aria-hidden="true" />
                زنده
              </span>
            </h2>
            {liveFlash && <span className="toast-in rounded-full bg-leaf-100 px-3 py-1 text-[10.5px] font-extrabold text-leaf-700">همین حالا به‌روز شد</span>}
          </div>

          {/* قیمت بزرگ */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11.5px] font-bold text-slate-400">
                قیمت هر {c.unitLabel} — پله‌ی {faNum(displayTier.tierNumber)}
                {impact.tierChangedByUser && <span className="ms-2 rounded-full bg-sun-100 px-2 py-0.5 text-[10px] font-extrabold text-sun-700">با خرید شما</span>}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span key={impact.unitPrice} className="value-pop font-display text-[50px] leading-none text-navy-900 sm:text-[58px]">
                  {formatPrice(impact.unitPrice)}
                </span>
                <span className="text-[15px] font-extrabold text-navy-400">تومان</span>
                <s className="text-[15px] font-bold text-slate-300">{formatPrice(c.priceMax)}</s>
                <span className="flex items-center gap-1 rounded-lg bg-leaf-500 px-2.5 py-1 text-[11.5px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgb(39_174_96/0.9)]">
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                  ٪{pctFa(impact.discountPct)} تخفیف
                </span>
              </div>
              <p className="mt-2 text-[11px] font-bold text-slate-400">
                کارمزد ٪{pctFa(impact.feeRate)} = {formatPrice(impact.feeAmount)} تومان • قیمت با کارمزد: {formatPrice(impact.finalPrice)} تومان
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {[
                { l: "واحد فروخته‌شده", v: faNum(impact.sold) },
                { l: "موجودی باقی‌مانده", v: faNum(impact.remainingInventory) },
                { l: "هزینه ارسال", v: c.shippingAmount === 0 ? "رایگان" : formatPrice(c.shippingAmount) },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-navy-100 bg-paper px-3 py-2.5 text-center">
                  <div className="text-[9.5px] font-extrabold text-slate-400">{s.l}</div>
                  <div className="mt-1 font-display text-[18px] leading-6 text-navy-800">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* اثر خرید کاربر */}
          {impact.tierChangedByUser && (
            <div className="toast-in mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-sun-300 bg-sun-50 px-4 py-3">
              <p className="text-[12.5px] font-extrabold leading-6 text-sun-800">
                خرید شما پله را به {faNum(impact.projectedTier.tierNumber)} می‌رساند؛ قیمت خودتان هم از همین حالا{" "}
                <span className="font-display text-[16px]">{formatPrice(impact.unitPrice)} تومان</span> حساب می‌شود.
              </p>
              <p className="ms-auto rounded-full bg-sun-500 px-3 py-1 text-[11px] font-extrabold text-navy-950">
                +{formatPrice(impact.extraTotal)} تومان تخفیف برای شما و همه
              </p>
            </div>
          )}

          {/* نوار پیشرفت */}
          <div className="mt-7">
            <div className="flex items-center justify-between text-[10.5px] font-extrabold text-navy-500">
              <span>آغاز پله: {faNum(impact.tierStart)} {c.unitLabel}</span>
              <span>پایان: {faNum(impact.tierEnd)} {c.unitLabel}</span>
            </div>
            <div className="relative mt-3 h-6 overflow-hidden rounded-full bg-navy-100 ring-1 ring-navy-200/60 ring-inset">
              <div className="absolute right-0 top-0 h-full bg-[#3A7BD5] transition-[width] duration-700 ease-out" style={{ width: `${impact.baseFillPct}%` }} />
              {impact.userFillPct > 0 && (
                <div
                  className={`absolute top-0 h-full bg-sun-500 transition-[width] duration-700 ease-out ${impact.completesTier ? "pulse-bar" : ""}`}
                  style={{ right: `${impact.baseFillPct}%`, width: `${impact.userFillPct}%` }}
                />
              )}
            </div>
            <div className="relative h-7" aria-hidden="true">
              <div className="absolute -top-1 flex -translate-y-1/2 flex-col items-center transition-[right] duration-700 ease-out" style={{ right: `${marker}%`, transform: "translate(50%,-50%)" }}>
                <span className="rounded-md bg-navy-900 px-2 py-0.5 text-[10.5px] font-extrabold text-white shadow">{faNum(impact.projectedTieredCount)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10.5px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#3A7BD5]" aria-hidden="true" /> خرید خریداران قبلی</span>
              {impact.userFillPct > 0 && <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sun-500" aria-hidden="true" /> سهم شما: {faNum(impact.units)} {c.unitLabel}</span>}
            </div>

            <div className="mt-5 rounded-xl border border-navy-100 bg-paper px-5 py-4 text-center">
              {impact.nextTier ? (
                <>
                  <p className="text-[12.5px] font-bold text-slate-500">
                    <span className="font-display text-[30px] text-navy-900">{faNum(impact.unitsUntilNext)}</span> {c.unitLabel} خرید تا رسیدن به پله‌ی {faNum(impact.effectiveTier.tierNumber + 1)}
                  </p>
                  <p className="mt-1 text-[11.5px] font-bold text-leaf-700">و دریافت {formatPrice(impact.nextDiscountAmount)} تومان تخفیف بیشتر برای همه</p>
                </>
              ) : (
                <p className="font-display text-[20px] text-navy-800">شما در آخرین پله هستید 🎯</p>
              )}
            </div>
          </div>

          {/* جدول پله‌ها */}
          <button onClick={() => setOpen((v) => !v)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3 transition hover:border-navy-300" aria-expanded={open}>
            <span className="text-[12.5px] font-extrabold text-navy-700">جدول کامل پله‌ها و آستانه‌ها</span>
            <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          <div className={`grid transition-all duration-300 ${open ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="overflow-x-auto rounded-xl border border-navy-100">
                <table className="w-full min-w-[440px] text-[12px]">
                  <thead>
                    <tr className="bg-navy-50 text-navy-600">
                      {["پله", "آستانه (واحد تجمعی)", "قیمت واحد", "تخفیف از پایه", "با کارمزد"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-4 py-2.5 text-start font-extrabold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.tiers.map((t) => {
                      const isCurrent = impact.effectiveTier.tierNumber === t.tierNumber;
                      const isProjected = impact.tierChangedByUser && impact.projectedTier.tierNumber === t.tierNumber;
                      const pct = ((c.priceMax - t.unitPrice) / c.priceMax) * 100;
                      return (
                        <tr key={t.tierNumber} className={`border-t border-navy-50 transition ${isProjected ? "bg-sun-50" : isCurrent ? "bg-navy-50/70" : "bg-white hover:bg-paper"}`}>
                          <td className="px-4 py-2.5 font-extrabold text-navy-800">
                            <span className="flex items-center gap-1.5">
                              {faNum(t.tierNumber)}
                              {isCurrent && <span className="rounded-full bg-[#3A7BD5] px-1.5 py-0.5 text-[9px] text-white">فعلی</span>}
                              {isProjected && <span className="rounded-full bg-sun-500 px-1.5 py-0.5 text-[9px] font-extrabold text-navy-950">با خرید شما</span>}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-500">تا {faNum(t.threshold)} {c.unitLabel}</td>
                          <td className="px-4 py-2.5 font-bold text-navy-800">{formatPrice(t.unitPrice)}</td>
                          <td className="px-4 py-2.5 font-extrabold text-leaf-600">٪{pctFa(pct)}</td>
                          <td className="px-4 py-2.5 font-bold text-navy-700">{formatPrice(t.unitPrice + Math.round((t.unitPrice * t.feeRate) / 100))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ---------- اسکلتون ---------- */
function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="shimmer h-8 w-40 rounded-lg" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="shimmer aspect-[4/3] rounded-2xl" />
        <div className="space-y-4">
          <div className="shimmer h-10 w-3/4 rounded-lg" />
          <div className="shimmer h-5 w-1/2 rounded" />
          <div className="shimmer h-24 rounded-xl" />
          <div className="shimmer h-12 rounded-xl" />
        </div>
      </div>
      <div className="mt-8 shimmer h-72 rounded-2xl" />
    </div>
  );
}

function Campaign404() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-300">
        <Lock className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="mt-5 font-display text-[30px] text-navy-900">کمپین پیدا نشد!</h1>
      <p className="mt-2 text-[13.5px] leading-8 text-slate-500">این کمپین وجود ندارد یا از دسترس خارج شده. از فهرست کمپین‌های فعال دیدن کنید.</p>
      <Link to="/campaigns" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-600 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-navy-700">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        بازگشت به کمپین‌ها
      </Link>
    </div>
  );
}

/* ================= صفحه اصلی ================= */
export default function CampaignDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isFavorite, toggleFavorite, login } = useSession();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [packageId, setPackageId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>("tiered");
  const [liveOffset, setLiveOffset] = useState(0);
  const [liveFlash, setLiveFlash] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [question, setQuestion] = useState("");
  const [pendingAction, setPendingAction] = useState<"favorite" | "order" | null>(null);

  useEffect(() => {
    setLoading(true);
    const c = getCampaign(slug ?? "") ?? null;
    const t = setTimeout(() => {
      setCampaign(c);
      setPackageId(c && c.packages.length > 0 ? c.packages[0].id : null);
      setQuantity(1);
      setImageIndex(0);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (loading || !campaign || campaign.status !== "active") return;
    const t = setInterval(() => {
      setLiveOffset((o) => o + 1 + Math.floor(Math.random() * 2));
      setLiveFlash(true);
      setTimeout(() => setLiveFlash(false), 1800);
    }, 30_000);
    return () => clearInterval(t);
  }, [loading, campaign]);

  const pkg = campaign?.packages.find((p) => p.id === packageId) ?? campaign?.packages[0];
  const packageUnits = pkg && campaign ? pkg.baseQuantity * quantity : 0;

  const liveCampaign = useMemo<Campaign | null>(() => {
    if (!campaign) return null;
    if (liveOffset === 0) return campaign;
    return {
      ...campaign,
      tieredSoldCount: Math.min(campaign.totalQuantity, campaign.tieredSoldCount + liveOffset),
      soldCount: Math.min(campaign.totalQuantity, campaign.soldCount + liveOffset),
    };
  }, [campaign, liveOffset]);

  const impact = useMemo<ImpactResult | null>(() => {
    if (!liveCampaign) return null;
    return computeImpact(liveCampaign, orderType === "tiered" ? packageUnits : 0, orderType, 0);
  }, [liveCampaign, packageUnits, orderType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <PageSkeleton />
        <Footer />
      </div>
    );
  }

  if (!liveCampaign || !impact) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <Campaign404 />
        <Footer />
      </div>
    );
  }

  const c = liveCampaign;
  const scheduled = c.status === "scheduled";
  const closed = c.status === "closed";
  const fav = isFavorite(c.id);

  const quota = user ? ROLE_QUOTA[user.role] : 0;
  const quotaUnits = quota > 0 ? Math.floor(quota / impact.finalPrice) : 0;
  const maxQty = user
    ? Math.max(1, Math.min(impact.remainingInventory, user.role === "guest" ? 1 : quotaUnits, 50))
    : Math.max(1, Math.min(impact.remainingInventory, 50));
  const overQuota = user !== null && quota > 0 && quantity > quotaUnits;

  const cashback = user && user.role === "family" ? cashbackFor(c, 1_050_000, 3, 0) : 0;

  const doFavorite = () => {
    const added = toggleFavorite(c.id);
    toast.push(added ? "success" : "info", added ? "کمپین به علاقه‌مندی‌ها اضافه شد." : "کمپین از علاقه‌مندی‌ها حذف شد.");
  };

  const handleFavorite = () => {
    if (!user) {
      setPendingAction("favorite");
      setLoginOpen(true);
      return;
    }
    doFavorite();
  };

  const requireLogin = (action: "favorite" | "order") => {
    setPendingAction(action);
    setLoginOpen(true);
    toast.push("info", "برای ادامه ابتدا وارد شوید.");
  };

  const submitOrder = () => {
    if (closed || scheduled) return;
    if (!user) {
      requireLogin("order");
      return;
    }
    if (orderType === "tiered" && (packageUnits > 1 || impact.isTierMaker)) {
      setWarnOpen(true);
      return;
    }
    toast.push("success", `سفارش شما با موفقیت ثبت شد. مبلغ ${formatPrice(impact.finalPrice * packageUnits + c.shippingAmount)} تومان — در حال انتقال به درگاه پرداخت…`);
  };

  const shareText = encodeURIComponent(`${c.title} را در هم‌برد ببین — قیمت با هر خرید پایین می‌آید!`);
  const shareUrl = encodeURIComponent(window.location.href);

  const faqs = [
    { q: "سهمیه‌ی حساب من چقدر است؟", a: `سهمیه بر اساس نقش شما تعیین می‌شود و برای این کمپین حدود ${user ? faNum(quota.toLocaleString("en-US")) : faNum((20_000_000).toLocaleString("en-US"))} تومان است. با ارتقای نقش یا خرید اشتراک، سهمیه بیشتر می‌شود.` },
    { q: "کش‌بک پله‌ای چطور پرداخت می‌شود؟", a: "اگر بعد از خرید شما پله‌ی بالاتری فعال شود، مابه‌التفاوت به‌صورت خودکار در پایان کمپین به کیف پول شما واریز می‌شود." },
    { q: "ارسال چقدر طول می‌کشد؟", a: "بعد از اتمام کمپین، تأمین‌کننده ۳ تا ۵ روز کاری برای آماده‌سازی زمان نیاز دارد و ارسال ۲ تا ۴ روز کاری طول می‌کشد." },
    { q: "آیا می‌توانم سفارش پله‌ای را لغو کنم؟", a: "سفارش پله‌ایِ بیش از یک واحد یا سفارش پله‌ساز، قبل از ارسال قابل لغو نیست؛ چون قیمت بقیه بر اساس آن محاسبه شده است." },
  ];

  const benefits = [
    { icon: BadgeCheck, title: "تأمین‌کننده‌ی تأییدشده", text: "بازدید میدانی و آزمایش مستقل محصول" },
    { icon: ShieldCheck, title: "پرداخت امن", text: "درگاه بانکی و ضمانت بازگشت وجه" },
    { icon: RotateCcw, title: "۷ روز مهلت بازگشت", text: "برای کالای غیرخوراکی و بسته‌نشده" },
    { icon: Truck, title: "ارسال توسط فروشنده", text: "مستقیم از تولیدکننده به خانه‌ی شما" },
  ];

  const steps = [
    { icon: Flame, title: "اتمام کمپین", sub: "قفل شدن قیمت نهایی" },
    { icon: ShoppingBag, title: "آماده‌سازی", sub: "۳ تا ۵ روز کاری" },
    { icon: Truck, title: "ارسال", sub: "۲ تا ۴ روز کاری" },
    { icon: Home, title: "تحویل", sub: "درب خانه" },
  ];

  return (
    <div className="min-h-screen bg-paper pb-28">
      <Header />

      {/* ---------- هدر فشرده ---------- */}
      <div className="sticky top-[68px] z-30 border-b border-navy-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] font-extrabold text-navy-600 transition hover:bg-navy-50">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            بازگشت
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[13px] font-extrabold text-navy-800">{c.shortTitle}</p>
            <p className="text-[10px] font-bold text-slate-400">{c.category}</p>
          </div>
          <button
            onClick={handleFavorite}
            aria-pressed={fav}
            aria-label="افزودن به علاقه‌مندی"
            className={`grid h-10 w-10 place-items-center rounded-xl border transition ${fav ? "border-rose-200 bg-rose-50" : "border-navy-100 hover:bg-navy-50"}`}
          >
            <Heart className={`h-5 w-5 transition ${fav ? "fill-rose-500 text-rose-500" : "text-navy-400"}`} />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ---------- بریدکرامب ---------- */}
        <nav className="mt-5 flex items-center gap-1.5 text-[11.5px] font-bold text-slate-400" aria-label="مسیر راهنما">
          <Link to="/campaigns" className="flex items-center gap-1 transition hover:text-navy-600"><Home className="h-3.5 w-3.5" aria-hidden="true" /> خانه</Link>
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          <Link to="/campaigns" className="transition hover:text-navy-600">کمپین‌ها</Link>
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          <span>{c.category}</span>
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          <span className="text-navy-700">{c.shortTitle}</span>
        </nav>

        {/* ---------- استیج محصول ---------- */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* گالری */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage key={imageIndex} src={c.images[imageIndex]} alt={c.title} eager className="kenburns absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-navy-800 backdrop-blur-sm">{c.category}</span>
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-navy-900/70 px-3 py-1.5 text-[10.5px] font-extrabold text-white backdrop-blur-sm">
                  <Eye className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />
                  {faNum(c.dailyViewCount.toLocaleString("en-US"))} بازدید امروز
                </span>
                <div className="absolute bottom-4 right-4 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-full bg-navy-950/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">{t}</span>
                  ))}
                </div>
              </div>
              {c.images.length > 1 && (
                <div className="flex gap-2.5 p-4">
                  {c.images.map((img, i) => (
                    <button key={i} onClick={() => setImageIndex(i)} aria-label={`تصویر ${faNum(i + 1)}`} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === imageIndex ? "border-sun-500" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* خرید */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-2xl bg-navy-950 p-6 text-white shadow-lift sm:p-7">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sun-500/40 bg-sun-500/10 px-3 py-1 text-[10.5px] font-extrabold text-sun-400">
                <Flame className="h-3 w-3" aria-hidden="true" />
                {closed ? "پایان‌یافته" : scheduled ? "به‌زودی شروع می‌شود" : "کمپین فعال"}
              </span>
              <h1 className="mt-3 font-display text-[30px] leading-snug sm:text-[34px]">{c.title}</h1>

              <Link to={`/suppliers/${c.supplier.id}`} className="mt-4 flex w-fit items-center gap-3 rounded-xl border border-navy-700 bg-navy-900/60 px-3.5 py-2.5 transition hover:border-sun-500">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-sun-500 font-display text-[15px] text-navy-950">{c.supplier.brandName.slice(0, 2)}</span>
                <span>
                  <span className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-white">
                    {c.supplier.brandName}
                    <BadgeCheck className="h-3.5 w-3.5 text-leaf-400" aria-hidden="true" />
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-navy-300">
                    <Stars rating={c.supplier.ratingAvg} size={10} />
                    {faNum(c.supplier.ratingAvg.toString().replace(".", "٫"))} ({faNum(c.supplier.reviewsCount)} نظر)
                  </span>
                </span>
              </Link>

              {/* انتخاب بسته */}
              {c.packages.length > 1 && (
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-extrabold text-navy-300">انتخاب بسته‌بندی:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {c.packages.map((p) => (
                      <button key={p.id} onClick={() => setPackageId(p.id)} aria-pressed={packageId === p.id} className={`rounded-xl border px-3 py-2.5 text-[11.5px] font-extrabold transition ${packageId === p.id ? "border-sun-500 bg-sun-500/15 text-sun-400" : "border-navy-700 text-navy-200 hover:border-navy-500"}`}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <CountdownBoxes c={c} />
              </div>

              {/* کش‌بک خریدار قبلی */}
              {cashback > 0 && (
                <div className="toast-in mt-5 flex items-start gap-2.5 rounded-xl border border-leaf-500/40 bg-leaf-500/10 px-4 py-3">
                  <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-leaf-400" aria-hidden="true" />
                  <p className="text-[11.5px] font-bold leading-6 text-leaf-300">
                    قیمت کاهش یافت! <span className="font-display text-[15px] text-leaf-400">{formatPrice(cashback)} تومان</span> در پایان کمپین به کیف پول شما اضافه خواهد شد.
                  </p>
                </div>
              )}

              <div className="mt-auto pt-6">
                <div className="flex items-baseline gap-2.5">
                  <span key={impact.unitPrice} className="value-pop font-display text-[42px] leading-none text-sun-400">{formatPrice(impact.unitPrice)}</span>
                  <span className="text-[13px] font-bold text-navy-300">تومان / {c.unitLabel}</span>
                  <s className="ms-auto text-[13px] font-bold text-navy-500">{formatPrice(c.priceMax)}</s>
                </div>
                <p className="mt-2 text-[11px] font-bold leading-6 text-navy-300">
                  {closed ? "این کمپین به پایان رسیده است." : scheduled ? "با شروع کمپین می‌توانید سفارش ثبت کنید." : "قیمت با رسیدن به هر پله، برای همه پایین می‌آید."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------- نردبان قیمت ---------- */}
        <div className="mt-8">
          <TierLadder c={c} impact={impact} liveFlash={liveFlash} />
        </div>

        {/* ---------- توضیحات ---------- */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-[24px] text-navy-900">درباره‌ی این محصول</h2>
              <div className="mt-4 space-y-4">
                {c.description.map((p, i) => (
                  <p key={i} className={`text-[13.5px] leading-8 text-slate-600 ${i === 0 ? "dropcap" : ""}`}>{p}</p>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {benefits.map((b) => (
                  <div key={b.title} className="rounded-xl border border-navy-100 bg-paper p-3.5 text-center transition hover:-translate-y-0.5 hover:border-navy-200">
                    <b.icon className="mx-auto h-5 w-5 text-sun-600" aria-hidden="true" />
                    <p className="mt-2 text-[11px] font-extrabold text-navy-800">{b.title}</p>
                    <p className="mt-1 text-[9.5px] font-bold leading-4 text-slate-400">{b.text}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 font-display text-[20px] text-navy-900">روند کالا بعد از ثبت سفارش</h3>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {steps.map((s, i) => (
                  <div key={s.title} className="relative rounded-xl border border-navy-100 bg-paper p-3 text-center">
                    {i < steps.length - 1 && <ChevronLeft className="absolute -left-2.5 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-navy-300 sm:block" aria-hidden="true" />}
                    <s.icon className="mx-auto h-5 w-5 text-navy-500" aria-hidden="true" />
                    <p className="mt-1.5 text-[10.5px] font-extrabold text-navy-800">{s.title}</p>
                    <p className="text-[8.5px] font-bold text-slate-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 font-display text-[20px] text-navy-900">شرایط بازگشت کالا</h3>
              <p className="mt-3 text-[12.5px] leading-7 text-slate-500">
                کالای خوراکی در صورت باز نشدن بسته‌بندی تا ۷ روز قابل بازگشت است. سفارش پله‌ایِ بیش از یک واحد یا سفارش پله‌ساز، قبل از ارسال قابل لغو نیست؛ زیرا قیمت سایر خریداران بر اساس آن محاسبه شده است. سفارش عادی و پله‌ایِ یک‌واحدیِ غیرپله‌ساز تا قبل از ارسال قابل لغو است.
              </p>
            </section>
          </Reveal>

          {/* ستون کناری */}
          <div className="space-y-6">
            <Reveal delay={100}>
              <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-[20px] text-navy-900">
                  <MessageCircle className="h-5 w-5 text-sun-600" aria-hidden="true" />
                  سوالات متداول
                </h2>
                <div className="mt-4 space-y-2.5">
                  {faqs.map((f, i) => (
                    <div key={f.q} className={`overflow-hidden rounded-xl border transition ${faqOpen === i ? "border-navy-300" : "border-navy-100"}`}>
                      <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start" aria-expanded={faqOpen === i}>
                        <span className="text-[12px] font-extrabold text-navy-800">{f.q}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform duration-300 ${faqOpen === i ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                      <div className={`grid transition-all duration-300 ${faqOpen === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
                          <p className="px-4 pb-4 text-[11.5px] leading-6 text-slate-500">{f.a}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={180}>
              <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-[20px] text-navy-900">سوالی دارید؟</h2>
                <p className="mt-1.5 text-[11.5px] leading-6 text-slate-500">تأمین‌کننده معمولاً {c.supplier.brandName === "برشته‌کاری دانه" ? "کمتر از ۲ ساعت" : "کمتر از ۴ ساعت"} پاسخ می‌دهد.</p>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="مثلاً: تاریخ برشت این قهوه کی هست؟"
                  className="mt-3 w-full resize-none rounded-xl border border-navy-200 bg-paper px-3.5 py-3 text-[12.5px] font-medium leading-6 text-navy-800 placeholder:text-slate-400 focus:border-navy-500 focus:outline-none"
                />
                <p className="mt-1 text-[10px] font-bold text-slate-400">{faNum(question.length)} از ۵۰۰ کاراکتر</p>
                <button
                  onClick={() => {
                    if (!user) { requireLogin("order"); return; }
                    if (question.trim().length < 5) { toast.push("error", "سوال باید حداقل ۵ کاراکتر باشد."); return; }
                    setQuestion("");
                    toast.push("success", "سوال شما ثبت شد و به‌زودی پاسخ داده می‌شود.");
                  }}
                  className="press mt-2 w-full rounded-xl bg-navy-600 py-3 text-[12.5px] font-extrabold text-white transition hover:bg-navy-700"
                >
                  ارسال سوال
                </button>
              </section>
            </Reveal>

            <Reveal delay={240}>
              <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-[20px] text-navy-900">اشتراک‌گذاری</h2>
                <p className="mt-1.5 text-[11.5px] leading-6 text-slate-500">با هر عضو جدید، یک پله به قیمت بهتر نزدیک می‌شویم.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.push("success", "لینک کمپین کپی شد."); }} className="press flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-[11.5px] font-extrabold text-navy-700 transition hover:border-navy-400 hover:bg-navy-50">
                    کپی لینک
                  </button>
                  <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-[11.5px] font-extrabold text-navy-700 transition hover:border-navy-400 hover:bg-navy-50">تلگرام</a>
                  <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-[11.5px] font-extrabold text-navy-700 transition hover:border-navy-400 hover:bg-navy-50">واتساپ</a>
                  <a href={`sms:?body=${shareText}%20${shareUrl}`} className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2 text-[11.5px] font-extrabold text-navy-700 transition hover:border-navy-400 hover:bg-navy-50">پیامک</a>
                </div>
              </section>
            </Reveal>

            <Reveal delay={300}>
              <section className="relative overflow-hidden rounded-2xl bg-navy-950 p-6 text-white shadow-lift">
                <div className="pattern-dots absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative">
                  <p className="text-[11px] font-extrabold text-sun-400">اشتراک هم‌برد</p>
                  <h2 className="mt-1 font-display text-[22px] leading-snug">با خرید اشتراک، سقف کارمزد کمتر و سهمیه بیشتر</h2>
                  <p className="mt-2 text-[11.5px] leading-6 text-navy-300">مشترکان از پله‌ی آخر قیمت شروع می‌کنند و ورود زودهنگام به کمپین‌ها دارند.</p>
                  <Link to="/subscriptions/plans" className="press mt-4 inline-flex items-center gap-2 rounded-xl bg-sun-500 px-5 py-2.5 text-[12px] font-extrabold text-navy-950 transition hover:bg-sun-400">
                    مشاهده‌ی اشتراک‌ها
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </Reveal>
          </div>
        </div>

        {/* ---------- آمار ---------- */}
        <Reveal>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 shadow-card sm:grid-cols-4">
            {[
              { l: "بازدید امروز", v: faNum(c.dailyViewCount.toLocaleString("en-US")), icon: Eye },
              { l: "تعداد کل خریدها", v: faNum(c.totalOrdersCount.toLocaleString("en-US")), icon: ShoppingBag },
              { l: "واحد فروخته‌شده", v: faNum(c.soldCount.toLocaleString("en-US")), icon: TrendingDown },
              { l: "موجودی باقی‌مانده", v: faNum(impact.remainingInventory.toLocaleString("en-US")), icon: Flame },
            ].map((s) => (
              <div key={s.l} className="bg-white px-4 py-5 text-center">
                <s.icon className="mx-auto h-5 w-5 text-sun-600" aria-hidden="true" />
                <div className="mt-2 font-display text-[22px] leading-7 text-navy-900">{s.v}</div>
                <div className="text-[10px] font-extrabold text-slate-400">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </main>

      {/* ---------- نوار چسبان پایین ---------- */}
      <div className="slide-up fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/97 shadow-[0_-8px_30px_-12px_rgb(11_37_69/0.25)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* قیمت */}
            <div className="min-w-[150px]">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[24px] leading-7 text-navy-900">{formatPrice(impact.unitPrice)}</span>
                <span className="text-[10.5px] font-extrabold text-navy-400">تومان / {c.unitLabel}</span>
                <span className="rounded-md bg-leaf-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">٪{pctFa(impact.discountPct)}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <s className="text-[10.5px] font-bold text-slate-300">{formatPrice(c.priceMax)}</s>
                <span className="text-[10.5px] font-bold text-slate-500">
                  جمع: <span className="font-extrabold text-navy-800">{formatPrice(impact.finalPrice * packageUnits + c.shippingAmount)}</span> تومان
                </span>
              </div>
            </div>

            {/* تعداد */}
            <div className="flex items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-xl border border-navy-200">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1 || closed || scheduled} className="grid h-11 w-11 place-items-center text-navy-600 transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:text-slate-200" aria-label="کاهش تعداد">
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="grid h-11 w-12 place-items-center border-x border-navy-100 bg-paper">
                  <span className="font-display text-[19px] text-navy-900">{faNum(quantity)}</span>
                </div>
                <button onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty || closed || scheduled} className="grid h-11 w-11 place-items-center text-navy-600 transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:text-slate-200" aria-label="افزایش تعداد">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden text-[10.5px] font-bold leading-5 text-slate-400 sm:block">
                <p>= <span className="font-extrabold text-navy-700">{faNum(packageUnits)}</span> {c.unitLabel}</p>
                {overQuota ? <p className="font-extrabold text-rose-500">سهمیه شما کافی نیست.</p> : <p>سقف هر سفارش: {faNum(50)} واحد</p>}
              </div>
            </div>

            {/* نوع سفارش */}
            <div className="hidden w-48 gap-1.5 rounded-xl border border-navy-100 bg-paper p-1 lg:flex">
              {ORDER_TYPES.map((t) => (
                <button key={t} onClick={() => setOrderType(t)} aria-pressed={orderType === t} className={`flex-1 rounded-lg px-2 py-2 text-[11px] font-extrabold leading-4 transition ${orderType === t ? "bg-navy-700 text-white shadow" : "text-slate-500 hover:bg-navy-50"}`}>
                  {t === "regular" ? "سفارش عادی" : "سفارش پله‌ای"}
                  <span className={`block text-[8.5px] font-bold ${orderType === t ? "text-navy-200" : "text-slate-300"}`}>{t === "regular" ? "قیمت قطعی" : "کش‌بک پله‌ها"}</span>
                </button>
              ))}
            </div>

            {/* ثبت سفارش */}
            <div className="ms-auto w-full lg:w-auto">
              <button
                onClick={submitOrder}
                disabled={closed || scheduled || overQuota}
                className={`shine press flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-[13.5px] font-extrabold transition lg:w-auto ${
                  closed || scheduled || overQuota
                    ? "cursor-not-allowed bg-navy-100 text-navy-300"
                    : "bg-sun-500 text-navy-950 shadow-[0_10px_24px_-10px_rgb(245_166_35/0.9)] hover:-translate-y-0.5 hover:bg-sun-400"
                }`}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {closed ? "پایان رسیده" : scheduled ? "به‌زودی" : "ثبت سفارش"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- مودال هشدار لغو ---------- */}
      <Modal open={warnOpen} onClose={() => setWarnOpen(false)}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-[22px] text-navy-900">توجه: این سفارش پله‌ای است</h2>
            <button onClick={() => setWarnOpen(false)} className="text-slate-300 transition hover:text-slate-500" aria-label="بستن"><X className="h-5 w-5" /></button>
          </div>
          <p className="mt-3 text-[13px] leading-7 text-slate-600">
            چون این سفارش بیش از یک واحد است{impact.isTierMaker ? " و پله‌ساز هم هست" : ""}، قیمت بقیه‌ی خریداران بر اساس آن محاسبه می‌شود. به همین دلیل <span className="font-extrabold text-rose-600">قبل از ارسال قابل لغو نیست.</span> با آگاهی کامل ادامه دهید.
          </p>
          <div className="mt-5 flex gap-2.5">
            <button onClick={() => { setWarnOpen(false); toast.push("success", "سفارش شما ثبت شد. در حال انتقال به درگاه پرداخت…"); }} className="press flex-1 rounded-xl bg-navy-600 py-3 text-[12.5px] font-extrabold text-white transition hover:bg-navy-700">
              متوجه‌ام، ادامه می‌دهم
            </button>
            <button onClick={() => setWarnOpen(false)} className="press rounded-xl border border-navy-200 px-5 py-3 text-[12.5px] font-extrabold text-navy-600 transition hover:bg-navy-50">
              انصراف
            </button>
          </div>
        </div>
      </Modal>

      {/* ---------- مودال ورود ---------- */}
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="font-display text-[22px] text-navy-900">برای ادامه وارد شوید</h2>
            <button onClick={() => setLoginOpen(false)} className="text-slate-300 transition hover:text-slate-500" aria-label="بستن"><X className="h-5 w-5" /></button>
          </div>
          <p className="mt-2 text-[12.5px] leading-7 text-slate-500">ثبت سفارش، علاقه‌مندی و پرسش سوال نیاز به حساب کاربری دارد. یک نقش نمایشی انتخاب کنید:</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {(Object.entries({ family: "خانوار", business: "کسب‌وکار", admin: "مدیر" }) as ["family" | "business" | "admin", string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  login(key);
                  setLoginOpen(false);
                  if (pendingAction === "favorite") doFavorite();
                  setPendingAction(null);
                }}
                className="press rounded-xl border border-navy-200 px-3 py-3 text-[12.5px] font-extrabold text-navy-700 transition hover:border-navy-500 hover:bg-navy-50"
              >
                {label}
              </button>
            ))}
          </div>
          <Link to={`/login?redirect=/campaigns/${c.slug}`} onClick={() => setLoginOpen(false)} className="mt-4 block w-full rounded-xl border border-dashed border-navy-300 py-2.5 text-center text-[11.5px] font-extrabold text-navy-500 transition hover:border-navy-500">
            رفتن به صفحه‌ی ورود کامل
          </Link>
        </div>
      </Modal>
    </div>
  );
}
