import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, ChevronLeft, Copy, Flame, Heart, Home,
  Lock, MapPin, Store, Timer, TrendingDown, UserPlus, Users,
} from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, SmartImage, Stars, useCountUp, useToast } from "../components/ui";
import { CAMPAIGNS, computeImpact, faNum, formatPrice, pctFa } from "../lib/data";
import { getSupplier, SUPPLIER_PROMISES } from "../lib/suppliers";
import { useSession } from "../lib/session";

function Stat({ label, value, suffix, delay }: { label: string; value: number; suffix?: string; delay: number }) {
  const v = useCountUp(value, 1300, delay);
  return (
    <div className="px-4 py-4 text-center">
      <div className="font-display text-[26px] leading-8 text-navy-900">
        {faNum(v.toLocaleString("en-US"))}{suffix ?? ""}
      </div>
      <div className="mt-0.5 text-[10px] font-extrabold text-slate-400">{label}</div>
    </div>
  );
}

function SupplierCampaignCard({ slug }: { slug: string }) {
  const c = CAMPAIGNS.find((x) => x.slug === slug)!;
  const impact = computeImpact(c, 0, "regular");
  const ended = c.status === "closed";
  const progress = Math.min(100, Math.round((c.soldCount / c.totalQuantity) * 100));
  return (
    <Link to={`/campaigns/${c.slug}`} className="shine group flex items-center gap-4 rounded-2xl border border-navy-100 bg-white p-3.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift">
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
        <SmartImage src={c.images[0]} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {ended && <span className="absolute inset-0 grid place-items-center bg-navy-950/60 text-navy-100"><Lock className="h-4 w-4" /></span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {c.status === "active" && (
            <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-2 py-0.5 text-[9px] font-extrabold text-leaf-700">
              <Flame className="h-2.5 w-2.5" aria-hidden="true" />
              فعال
            </span>
          )}
          {c.status === "scheduled" && (
            <span className="flex items-center gap-1 rounded-full bg-navy-100 px-2 py-0.5 text-[9px] font-extrabold text-navy-600">
              <CalendarClock className="h-2.5 w-2.5" aria-hidden="true" />
              به‌زودی
            </span>
          )}
          {ended && <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[9px] font-extrabold text-navy-500">پایان‌یافته</span>}
        </div>
        <h3 className="clamp-2 mt-1 text-[13px] font-extrabold leading-6 text-navy-900">{c.title}</h3>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-100">
          <div className={`h-full rounded-full ${ended ? "bg-navy-400" : "bg-gradient-to-l from-sun-500 to-leaf-400"}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="shrink-0 text-left">
        <div className="font-display text-[19px] leading-6 text-navy-900">{formatPrice(impact.unitPrice)}</div>
        <div className="text-[9px] font-bold text-slate-400">تومان / {c.unitLabel}</div>
        <span className="mt-1 inline-block rounded-md bg-leaf-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">٪{pctFa(impact.discountPct)}</span>
      </div>
    </Link>
  );
}

function CooperationForm({ accent }: { accent: string }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (name.trim().length < 3) { toast.push("error", "نام مجموعه را کامل بنویسید."); return; }
    if (!/^09\d{9}$/.test(phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))))) {
      toast.push("error", "شماره موبایل باید مثل ۰۹۱۲۳۴۵۶۷۸۹ باشد.");
      return;
    }
    setSent(true);
    toast.push("success", "درخواست همکاری شما ثبت شد؛ کارشناسان تا ۴۸ ساعت تماس می‌گیرند.");
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-leaf-500 text-white">
          <BadgeCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-display text-[22px] text-navy-900">درخواست شما ثبت شد</h3>
        <p className="mt-2 text-[12.5px] leading-7 text-slate-500">کارشناسان تأمین هم‌برد ظرف ۴۸ ساعت با شما تماس می‌گیرند و مراحل بازدید میدانی و آزمایش محصول را هماهنگ می‌کنند.</p>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-3 text-[12.5px] font-medium text-navy-800 placeholder:text-slate-400 focus:border-navy-500 focus:outline-none";

  return (
    <div className="rounded-2xl border border-navy-100 bg-paper p-6">
      <h3 className="font-display text-[20px] text-navy-900">درخواست همکاری</h3>
      <p className="mt-1 text-[11.5px] leading-6 text-slate-500">اگر تولیدکننده یا تعاونی هستید، فرم را پر کنید؛ قیمت کف تضمینی و تسویه‌ی ۷ روزه در انتظار شماست.</p>
      <div className="mt-4 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام مجموعه / تعاونی" className={field} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره موبایل (۰۹xxxxxxxxx)" className={field} dir="ltr" style={{ textAlign: "right" }} />
        <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="محصول اصلی (مثلاً زعفران نگین)" className={field} />
        <button onClick={submit} className="press w-full rounded-xl py-3.5 text-[13px] font-extrabold text-white transition hover:-translate-y-0.5" style={{ backgroundColor: accent }}>
          ارسال درخواست همکاری
        </button>
      </div>
    </div>
  );
}

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, login } = useSession();
  const supplier = getSupplier(id ?? "");
  const [following, setFollowing] = useState(false);

  useEffect(() => setFollowing(false), [id]);

  if (!supplier) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-300">
            <Store className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-[30px] text-navy-900">تأمین‌کننده پیدا نشد!</h1>
          <p className="mt-2 text-[13.5px] leading-8 text-slate-500">این تأمین‌کننده در شبکه‌ی هم‌برد وجود ندارد.</p>
          <Link to="/suppliers" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-600 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-navy-700">
            <ArrowRight className="h-4 w-4" />
            فهرست تأمین‌کننده‌ها
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const campaigns = CAMPAIGNS.filter((c) => c.supplier.id === supplier.id);
  const followers = supplier.followers + (following ? 1 : 0);

  const handleFollow = () => {
    if (!user) {
      login("family");
      toast.push("info", "برای دنبال کردن، با نقش خانوار وارد شدید.");
      return;
    }
    setFollowing((f) => {
      toast.push(f ? "info" : "success", f ? "دنبال کردن لغو شد." : "این تأمین‌کننده را دنبال می‌کنید؛ از کمپین‌های جدید باخبر می‌شوید.");
      return !f;
    });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------- جلد سینمایی ---------- */}
      <section className="relative h-[420px] overflow-hidden sm:h-[480px]">
        <SmartImage src={supplier.cover} alt={supplier.brandName} eager className="kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/20" aria-hidden="true" />
        <div className="absolute inset-0 pattern-dots opacity-30" aria-hidden="true" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 lg:px-8">
          <nav className="absolute left-4 top-5 flex items-center gap-1.5 text-[11.5px] font-bold text-navy-200 lg:left-8" aria-label="مسیر راهنما">
            <Link to="/campaigns" className="flex items-center gap-1 transition hover:text-white"><Home className="h-3.5 w-3.5" aria-hidden="true" /> خانه</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            <Link to="/suppliers" className="transition hover:text-white">تأمین‌کننده‌ها</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            <span className="text-sun-400">{supplier.brandName}</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[44px] leading-tight text-white sm:text-[56px]">{supplier.brandName}</h1>
                {supplier.verified && (
                  <span className="flex items-center gap-1.5 rounded-full bg-leaf-500 px-3 py-1.5 text-[10.5px] font-extrabold text-white shadow">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    تأییدشده
                  </span>
                )}
              </div>
              <p className="mt-1 text-[14px] font-bold text-sun-400">{supplier.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-bold text-navy-200">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />{supplier.city}</span>
                <span className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />از {supplier.since}</span>
                <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />پاسخ {supplier.responseTime}</span>
                <span className="flex items-center gap-1.5">
                  <Stars rating={4.9} size={11} />
                  {faNum("4.9")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.push("success", "لینک صفحه کپی شد."); }} className="press flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-950/50 px-4 py-3 text-[12px] font-extrabold text-white backdrop-blur-sm transition hover:border-sun-500 hover:text-sun-400" aria-label="کپی لینک">
                <Copy className="h-4 w-4" aria-hidden="true" />
                کپی لینک
              </button>
              <button onClick={handleFollow} className={`press flex items-center gap-2 rounded-xl px-5 py-3 text-[12.5px] font-extrabold transition ${following ? "border border-leaf-400 bg-leaf-500/15 text-leaf-400" : "bg-sun-500 text-navy-950 shadow-[0_10px_24px_-10px_rgb(245_166_35/0.8)] hover:-translate-y-0.5 hover:bg-sun-400"}`}>
                {following ? <Heart className="h-4 w-4 fill-leaf-400" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
                {following ? "دنبال می‌کنید" : "دنبال کردن"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- نوار آمار شناور ---------- */}
      <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 shadow-lift sm:grid-cols-4">
            <Stat label="واحد فروخته‌شده" value={supplier.stats.soldUnits} delay={0} />
            <Stat label="کمپین برگزارشده" value={supplier.stats.campaigns} delay={120} />
            <Stat label="تحویل به‌موقع (٪)" value={supplier.stats.onTimeDelivery} suffix="" delay={240} />
            {supplier.stats.members ? (
              <Stat label="عضو (خانوار/باغدار)" value={supplier.stats.members} delay={360} />
            ) : (
              <Stat label="دنبال‌کننده" value={followers} delay={360} />
            )}
          </div>
        </Reveal>
      </div>

      {/* ---------- نوار متحرک تخصص‌ها ---------- */}
      <div className="marquee mt-10 overflow-hidden border-y border-navy-100 bg-white py-3" dir="ltr">
        <div className="marquee-track" dir="rtl">
          {[...supplier.specialties, ...supplier.specialties, ...supplier.specialties].map((s, i) => (
            <span key={i} className="flex shrink-0 items-center gap-3 px-5 text-[12.5px] font-extrabold text-navy-600">
              <Flame className="h-3.5 w-3.5 text-sun-500" aria-hidden="true" />
              {s}
              <span className="h-1 w-1 rounded-full bg-navy-200" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* ---------- داستان ---------- */}
      <main className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          {/* ستون چسبان */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="text-[12px] font-extrabold text-sun-600">داستان تأمین‌کننده</span>
              <h2 className="mt-1 font-display text-[32px] leading-tight text-navy-900">
                {supplier.brandName}<br />از زبان خودش
              </h2>
              <blockquote className="mt-6 rounded-2xl border-r-4 bg-white p-5 shadow-card" style={{ borderRightColor: supplier.accent }}>
                <p className="font-display text-[22px] leading-relaxed text-navy-800">«{supplier.pullQuote}»</p>
                <footer className="mt-3 text-[11.5px] font-extrabold text-slate-400">{supplier.quoteBy}</footer>
              </blockquote>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-navy-950 p-5 text-white">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sun-500 font-display text-[17px] text-navy-950">
                  {supplier.brandName.slice(0, 2)}
                </span>
                <div>
                  <p className="text-[12.5px] font-extrabold">{supplier.brandName}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-bold text-navy-300">
                    <Users className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />
                    {faNum(followers.toLocaleString("en-US"))} دنبال‌کننده
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* متن داستان */}
          <div>
            <Reveal>
              <p className="dropcap text-[14.5px] font-bold leading-9 text-navy-800">{supplier.storyLead}</p>
            </Reveal>
            <div className="mt-5 space-y-5">
              {supplier.story.map((p, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="text-[13.5px] leading-8 text-slate-600">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <h3 className="mt-10 font-display text-[22px] text-navy-900">تعهدات کیفیت شبکه</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SUPPLIER_PROMISES.map((pr, i) => (
                  <div key={pr.title} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-navy-200">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-[15px] text-white" style={{ backgroundColor: supplier.accent }}>
                      {faNum(i + 1)}
                    </span>
                    <div>
                      <p className="text-[12.5px] font-extrabold text-navy-800">{pr.title}</p>
                      <p className="mt-1 text-[11px] leading-6 text-slate-500">{pr.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---------- کمپین‌های زنده ---------- */}
        <div className="mt-16">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[12px] font-extrabold text-sun-600">در حال برگزاری</span>
                <h2 className="mt-1 font-display text-[30px] text-navy-900">کمپین‌های {supplier.brandName}</h2>
              </div>
              <Link to="/campaigns" className="flex items-center gap-1.5 text-[12px] font-extrabold text-navy-500 transition hover:text-navy-800">
                همه‌ی کمپین‌ها
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {campaigns.map((c, i) => (
              <Reveal key={c.slug} delay={i * 100}>
                <SupplierCampaignCard slug={c.slug} />
              </Reveal>
            ))}
            {campaigns.length === 0 && (
              <Reveal>
                <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-white/70 px-6 py-12 text-center md:col-span-2">
                  <TrendingDown className="mx-auto h-8 w-8 text-navy-300" strokeWidth={1.5} />
                  <h3 className="mt-4 font-display text-[22px] text-navy-800">کمپین بعدی در راه است</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-7 text-slate-500">
                    این تأمین‌کننده در حال حاضر کمپین فعالی ندارد. او را دنبال کنید تا از کمپین بعدی باخبر شوید.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* ---------- همکاری ---------- */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="text-[12px] font-extrabold text-sun-600">به شبکه بپیوندید</span>
              <h2 className="mt-1 font-display text-[32px] leading-tight text-navy-900">تولیدکننده‌اید؟ جای شما اینجاست</h2>
              <p className="mt-4 max-w-lg text-[13.5px] leading-8 text-slate-500">
                مثل {supplier.brandName}، محصولتان را بدون واسطه به هزاران خریدار جمعی بفروشید. قیمت کف تضمینی، تسویه‌ی سریع و بازخورد مستقیم خریداران، سه چیزی است که در بازار سنتی پیدا نمی‌کنید.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <CooperationForm accent={supplier.accent} />
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
