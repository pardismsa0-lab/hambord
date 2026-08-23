import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Clock, Crown, Eye, Flame, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { Reveal, SmartImage } from "./ui";
import {
  formatViews, getBlogAuthor, getBlogCategory, publishedAtOf, readingTimeOf, type BlogPost, type BlogCategory,
} from "../lib/blog";
import { faNum, formatDateJalaliLong, timeAgoFa } from "../lib/data";
import { ROLE_LABELS, useSession } from "../lib/session";

/* ---------- جست‌وجو ---------- */
export function BlogSearch({
  value,
  onChange,
  onSubmit,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2 rounded-2xl border border-navy-700 bg-navy-900/70 p-1.5 backdrop-blur-sm focus-within:border-sun-500"
    >
      <Search className="ms-3 h-4.5 w-4.5 shrink-0 text-navy-300" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        placeholder="جست‌وجو در مقاله‌ها؛ مثلاً «برنج هاشمی» یا «خرید پله‌ای»"
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-white placeholder:text-navy-400 focus:outline-none"
      />
      {value && (
        <button type="button" onClick={onClear} className="text-navy-400 transition hover:text-white" aria-label="پاک کردن">
          <X className="h-4 w-4" />
        </button>
      )}
      <button type="submit" className="press rounded-xl bg-sun-500 px-4 py-2.5 text-[12px] font-extrabold text-navy-950 transition hover:bg-sun-400">
        جست‌وجو
      </button>
    </form>
  );
}

/* ---------- چیپ دسته‌بندی ---------- */
export function CategoryChips({
  categories,
  counts,
  active,
  onSelect,
}: {
  categories: BlogCategory[];
  counts: Map<number, number>;
  active: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 10;
  const hasMore = categories.length > LIMIT;
  const visible = expanded ? categories : categories.slice(0, LIMIT);

  const chip = (isActive: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-extrabold transition-all duration-200 ${
      isActive
        ? "border-transparent bg-navy-700 text-white shadow-[0_8px_18px_-8px_rgb(21_64_118/0.9)]"
        : "border-navy-200/80 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-navy-400 hover:text-navy-700"
    }`;

  return (
    <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      <button onClick={() => onSelect(null)} className={chip(active === null)}>
        همه‌ی مقاله‌ها
      </button>
      {visible.map((cat) => {
        const isActive = active === cat.slug;
        const count = counts.get(cat.id) ?? 0;
        return (
          <button key={cat.slug} onClick={() => onSelect(isActive ? null : cat.slug)} className={chip(isActive)}>
            {cat.name}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${isActive ? "bg-white/20 text-white" : count === 0 ? "bg-navy-50 text-navy-300" : "bg-navy-50 text-navy-400"}`}>
              {faNum(count)}
            </span>
          </button>
        );
      })}
      {hasMore && (
        <button onClick={() => setExpanded((v) => !v)} className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-navy-300 px-3.5 py-2 text-[11.5px] font-extrabold text-navy-500 transition hover:border-navy-500 hover:text-navy-700" aria-expanded={expanded}>
          {expanded ? "نمایش کمتر" : `${faNum(categories.length - LIMIT)} دسته‌ی دیگر`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ---------- کارت مقاله ---------- */
export function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const category = getBlogCategory(post.categoryId);
  const author = getBlogAuthor(post.authorId);
  const excerpt = post.excerpt ?? (post.content[0]?.p ?? "").slice(0, 160) + "…";
  return (
    <Reveal delay={(index % 3) * 80}>
      <Link to={`/blog/${post.slug}`} className="shine group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-lift">
        <div className="relative aspect-video overflow-hidden bg-navy-50">
          <SmartImage src={post.cover} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
          {category && <span className="absolute right-3 top-3 rounded-full bg-navy-900/75 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur-sm">{category.name}</span>}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10.5px] font-bold text-navy-700 backdrop-blur-sm">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatViews(post.viewCount)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="clamp-2 text-[16px] font-extrabold leading-7 text-navy-900 transition-colors group-hover:text-navy-600">{post.title}</h3>
          <p className="clamp-3 mt-2 text-[12.5px] leading-6 text-slate-500">{excerpt}</p>
          <div className="mt-auto flex items-center justify-between border-t border-dashed border-navy-100 pt-4 [margin-top:auto]">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: author.color }} aria-hidden="true">
                {author.initials}
              </span>
              <span className="leading-tight">
                <span className="block text-[11.5px] font-bold text-slate-600">{author.fullName}</span>
                <span className="mt-0.5 block text-[10.5px] text-slate-400">{timeAgoFa(publishedAtOf(post))}</span>
              </span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[10.5px] font-bold text-navy-600">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {faNum(readingTimeOf(post))} دقیقه
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ---------- مقاله ویژه ---------- */
export function FeaturedCard({ post }: { post: BlogPost }) {
  const category = getBlogCategory(post.categoryId);
  const author = getBlogAuthor(post.authorId);
  const excerpt = post.excerpt ?? (post.content[0]?.p ?? "").slice(0, 220) + "…";
  return (
    <Reveal>
      <Link to={`/blog/${post.slug}`} className="shine group grid overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:border-navy-200 hover:shadow-lift lg:grid-cols-5">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-100 lg:col-span-3 lg:aspect-auto lg:min-h-[320px]">
          <SmartImage src={post.cover} alt={post.title} eager className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" aria-hidden="true" />
          <span className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-sun-500 px-3.5 py-1.5 text-[11.5px] font-extrabold text-navy-950 shadow-lg">
            <span className="pulse-dot h-2 w-2 rounded-full bg-navy-950" aria-hidden="true" />
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            مقاله‌ی ویژه
          </span>
          {category && <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-navy-800 backdrop-blur-sm">{category.name}</span>}
        </div>
        <div className="flex flex-col p-6 lg:col-span-2 lg:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-semibold text-slate-400">
            <span>{formatDateJalaliLong(publishedAtOf(post))}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{faNum(readingTimeOf(post))} دقیقه</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden="true" />{formatViews(post.viewCount)}</span>
          </div>
          <h2 className="mt-3 font-display text-[26px] leading-[1.5] text-navy-900 transition-colors group-hover:text-navy-600 lg:text-[30px]">{post.title}</h2>
          <p className="clamp-3 mt-3 text-[13px] leading-7 text-slate-500">{excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-navy-100" style={{ backgroundColor: author.color }} aria-hidden="true">
                {author.initials}
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-extrabold text-navy-800">{author.fullName}</span>
                <span className="mt-0.5 block text-[11px] text-slate-400">{author.role}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-[13px] font-extrabold text-sun-600 transition-colors group-hover:text-sun-700">
              مطالعه‌ی کامل
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ---------- سایدبار ---------- */
export function BlogSidebar({ popular }: { popular: BlogPost[] }) {
  const { user } = useSession();

  let cta;
  if (!user) {
    cta = {
      badge: "ویژه‌ی مشترکان",
      title: "پله‌ها را یکی‌یکی نرو!",
      text: "با اشتراک هم‌برد از همان پله‌ی آخر قیمت شروع کن؛ ورود زودهنگام به کمپین‌ها و ارسال رایگان هم هدیه‌ی ماست.",
      perks: ["ورود زودهنگام به کمپین‌های ویژه", "پله‌های تخفیف اختصاصی مشترکان", "ارسال رایگان سفارش‌های ماهانه"],
      price: "از ماهی ۹۹ هزار تومان",
      button: "مشاهده‌ی طرح‌های اشتراک",
      to: "/subscriptions/plans",
    };
  } else if (user.hasActivePlan) {
    cta = {
      badge: "اشتراک فعال",
      title: user.planName ?? "طرح شما",
      text: "همه‌ی مزایای شما برقرار است؛ تمدید زودهنگام تا دو هفته قبل از پایان دوره، ۱۵٪ تخفیف دارد.",
      perks: [],
      price: "",
      button: "تمدید یا ارتقای اشتراک",
      to: "/subscriptions/plans",
    };
  } else if (user.role === "supplier") {
    cta = {
      badge: "تأمین‌کننده",
      title: "محصولت را مستقیم بفروش",
      text: "با پیوستن به شبکه‌ی تأمین، بدون دلال و با تسویه‌ی ۷ روزه به هزاران خریدار جمعی دسترسی پیدا کن.",
      perks: [],
      price: "",
      button: "ثبت درخواست همکاری",
      to: "/suppliers",
    };
  } else {
    cta = {
      badge: ROLE_LABELS[user.role],
      title: "سهمیه‌ات را بیشتر کن",
      text: "با ارتقای اشتراک، سهمیه‌ی خرید و سقف کارمزد بهتری می‌گیری و زودتر به کمپین‌ها می‌رسی.",
      perks: [],
      price: "",
      button: "مشاهده‌ی طرح‌ها",
      to: "/subscriptions/plans",
    };
  }

  return (
    <div className="space-y-6">
      {/* پربازدیدها */}
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-display text-[20px] text-navy-900">
          <Flame className="h-5 w-5 text-sun-500" aria-hidden="true" />
          پربازدیدترین‌ها
        </h2>
        <div className="mt-4 space-y-4">
          {popular.map((p, i) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group flex gap-3">
              <span className={`grid h-8 w-7 shrink-0 place-items-center rounded-md font-display text-[16px] ${i < 3 ? "bg-sun-500 text-navy-950" : "bg-navy-50 text-navy-400"}`}>
                {faNum(i + 1)}
              </span>
              <span className="min-w-0">
                <span className="clamp-2 block text-[12px] font-extrabold leading-6 text-navy-800 transition group-hover:text-navy-600">{p.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Eye className="h-3 w-3" aria-hidden="true" />
                  {formatViews(p.viewCount)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA اشتراک */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-950 p-6 text-white shadow-lift">
        <div className="pattern-dots absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-sun-500/15 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-sun-500/40 bg-sun-500/10 px-2.5 py-1 text-[10px] font-extrabold text-sun-400">
            <Crown className="h-3 w-3" aria-hidden="true" />
            {cta.badge}
          </span>
          <h2 className="mt-3 font-display text-[24px] leading-snug">{cta.title}</h2>
          <p className="mt-2 text-[11.5px] leading-6 text-navy-200">{cta.text}</p>
          {cta.perks.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {cta.perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[11px] font-bold text-navy-100">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0 text-leaf-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {cta.price && <p className="mt-3 font-display text-[18px] text-sun-400">{cta.price}</p>}
          <Link to={cta.to} className="press mt-4 block rounded-xl bg-sun-500 px-4 py-3 text-center text-[12.5px] font-extrabold text-navy-950 transition hover:bg-sun-400">
            {cta.button}
          </Link>
        </div>
      </div>

      {/* لینک‌های مفید */}
      <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
        <h2 className="font-display text-[20px] text-navy-900">لینک‌های مفید</h2>
        <ul className="mt-3 space-y-2">
          {[
            { label: "آموزش خرید پله‌ای از صفر", to: "/blog?category=kharid-pollei" },
            { label: "تازه‌ترین اخبار و جشنواره‌ها", to: "/blog?category=akhbar" },
            { label: "تعرفه‌ی طرح‌های اشتراک", to: "/subscriptions/plans" },
            { label: "کمپین‌های فعال", to: "/campaigns" },
          ].map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="group flex items-center justify-between rounded-lg px-2 py-2 text-[12px] font-bold text-slate-600 transition hover:bg-navy-50 hover:text-navy-700">
                {l.label}
                <ArrowLeft className="h-3.5 w-3.5 text-navy-300 transition group-hover:-translate-x-1 group-hover:text-sun-600" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
