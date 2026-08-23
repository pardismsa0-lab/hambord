import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, ChevronLeft, MapPin, Star, Store, Truck } from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, SmartImage, Stars } from "../components/ui";
import { CAMPAIGNS } from "../lib/data";
import { SUPPLIER_PROFILES } from "../lib/suppliers";
import { faNum, formatPrice } from "../lib/data";

export default function SuppliersIndex() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <section className="relative overflow-hidden bg-navy-950">
        <div className="pattern-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-navy-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 left-16 h-80 w-80 rounded-full bg-leaf-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11.5px] font-bold text-navy-300" aria-label="مسیر راهنما">
            <Link to="/campaigns" className="transition hover:text-white">خانه</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            <span className="text-sun-400">تأمین‌کننده‌ها</span>
          </nav>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-leaf-500/40 bg-leaf-500/10 px-3.5 py-1.5 text-[11.5px] font-extrabold text-leaf-400">
                <Store className="h-3.5 w-3.5" aria-hidden="true" />
                شبکه‌ی تأمین هم‌برد
              </span>
              <h1 className="mt-4 font-display text-[44px] leading-[1.3] text-white sm:text-[54px]">
                از <span className="text-sun-400">مزرعه و کارگاه</span>،<br />
                بدون واسطه تا سفره
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-8 text-navy-200">
                هر تأمین‌کننده‌ی شبکه‌ی هم‌برد سه فیلتر را گذرانده: بازدید میدانی، آزمایش مستقل محصول و دوره‌ی آزمایشی فروش. اینجا همه‌شان را یک‌جا ببینید و داستان‌شان را بخوانید.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "تأمین‌کننده‌ی فعال", value: faNum(SUPPLIER_PROFILES.length), icon: Store },
                { label: "شهر و منطقه", value: faNum(SUPPLIER_PROFILES.length), icon: MapPin },
                { label: "تحویل به‌موقع", value: "٪" + faNum(97), icon: Truck },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-navy-800 bg-navy-900/60 px-3 py-4 text-center backdrop-blur-sm">
                  <s.icon className="mx-auto h-5 w-5 text-sun-400" aria-hidden="true" />
                  <div className="mt-1.5 font-display text-[22px] leading-7 text-white">{s.value}</div>
                  <div className="mt-0.5 text-[9.5px] font-bold leading-4 text-navy-300">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {SUPPLIER_PROFILES.map((p, i) => {
            const campaigns = CAMPAIGNS.filter((c) => c.supplier.id === p.id);
            const activeCount = campaigns.filter((c) => c.status === "active").length;
            const lastCampaign = campaigns[0];
            const lastImpact = lastCampaign
              ? [...lastCampaign.tiers].reverse().find((t) => t.threshold <= lastCampaign.tieredSoldCount) ?? lastCampaign.tiers[0]
              : null;
            return (
              <Reveal key={p.id} delay={(i % 2) * 100} className={i % 2 === 1 ? "lg:translate-y-6" : ""}>
                <Link to={`/suppliers/${p.id}`} className="shine group block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-lift">
                  <div className="relative h-52 overflow-hidden">
                    <SmartImage src={p.cover} alt={p.brandName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" aria-hidden="true" />
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-navy-800 backdrop-blur-sm">
                      <BadgeCheck className="h-3.5 w-3.5 text-leaf-600" aria-hidden="true" />
                      تأییدشده
                    </span>
                    {activeCount > 0 && (
                      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-sun-500 px-2.5 py-1 text-[10px] font-extrabold text-navy-950">
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-navy-950" aria-hidden="true" />
                        {faNum(activeCount)} کمپین فعال
                      </span>
                    )}
                    <div className="absolute inset-x-4 bottom-3.5 flex items-end justify-between">
                      <div>
                        <h2 className="font-display text-[26px] text-white">{p.brandName}</h2>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-navy-200">
                          <MapPin className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />
                          {p.city} • از {p.since}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-lg bg-navy-950/60 px-2 py-1 text-[11px] font-extrabold text-sun-400 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 fill-sun-400" aria-hidden="true" />
                        {faNum("4.9")}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="clamp-2 text-[12.5px] leading-7 text-slate-500">{p.storyLead}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-navy-50 px-2.5 py-1 text-[10.5px] font-bold text-navy-600">{s}</span>
                      ))}
                    </div>
                    {lastCampaign && lastImpact && (
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-paper px-4 py-3">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400">آخرین کمپین</p>
                          <p className="mt-0.5 text-[12px] font-extrabold text-navy-800">{lastCampaign.shortTitle}</p>
                        </div>
                        <span className="font-display text-[17px] text-leaf-600">
                          {formatPrice(lastImpact.unitPrice)}
                          <span className="font-sans text-[9.5px] font-bold text-slate-400"> تومان</span>
                        </span>
                      </div>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-sun-600 transition-colors group-hover:text-sun-700">
                      مشاهده‌ی صفحه‌ی تأمین‌کننده
                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 sm:px-10">
            <div className="pattern-dots absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sun-500/15 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-[28px] text-white">تولیدکننده یا تعاونی هستید؟</h2>
                <p className="mt-2 max-w-lg text-[13px] leading-7 text-navy-200">
                  قیمت کف تضمینی، تسویه‌ی ۷ روزه و دسترسی مستقیم به هزاران خریدار جمعی — بدون دلال و بدون خواب سرمایه. از صفحه‌ی هر تأمین‌کننده می‌توانید فرم همکاری را پر کنید.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/suppliers/ghaen" className="press rounded-xl bg-sun-500 px-5 py-3 text-[12.5px] font-extrabold text-navy-950 transition hover:-translate-y-0.5 hover:bg-sun-400">
                  نمونه‌ی فرم همکاری
                </Link>
                <Link to="/blog?category=tamin-konande" className="press rounded-xl border border-navy-700 px-5 py-3 text-[12.5px] font-extrabold text-white transition hover:-translate-y-0.5 hover:border-sun-500 hover:text-sun-400">
                  داستان تأمین‌کننده‌ها در بلاگ
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
