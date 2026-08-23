import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronLeft, SearchX } from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, useCountUp } from "../components/ui";
import { BlogSearch, BlogSidebar, CategoryChips, FeaturedCard, PostCard } from "../components/blog";
import {
  BLOG_CATEGORIES, BLOG_POSTS, getBlogStats, searchPosts,
} from "../lib/blog";
import { faNum } from "../lib/data";

function MastheadStat({ value, label }: { value: number; label: string }) {
  const v = useCountUp(value, 1300);
  return (
    <div>
      <div className="font-display text-[26px] leading-8 text-white sm:text-[30px]">{faNum(v.toLocaleString("en-US"))}</div>
      <div className="mt-1 text-[10.5px] font-bold text-navy-300">{label}</div>
    </div>
  );
}

export default function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category");
  const q = params.get("q") ?? "";
  const sort = (params.get("sort") as "newest" | "oldest" | "popular" | null) ?? "newest";
  const page = Number(params.get("page") ?? "1") || 1;

  const [input, setInput] = useState(q);
  const [perPage, setPerPage] = useState(() => (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches ? 8 : 12));

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    if (input === q) return;
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (input.trim()) next.set("q", input.trim());
      else next.delete("q");
      next.delete("page");
      setParams(next, { replace: true });
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setPerPage(mq.matches ? 8 : 12);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const result = useMemo(() => searchPosts({ category, q: q || null, sort, page, perPage }), [category, q, sort, page, perPage]);

  const counts = useMemo(() => {
    const m = new Map<number, number>();
    BLOG_POSTS.filter((p) => p.status === "published").forEach((p) => m.set(p.categoryId, (m.get(p.categoryId) ?? 0) + 1));
    return m;
  }, []);

  const featured = useMemo(
    () => BLOG_POSTS.find((p) => p.isFeatured && p.status === "published"),
    [],
  );
  const hasFilter = Boolean(category || q);
  const showFeatured = Boolean(featured) && !hasFilter && sort === "newest";
  const gridPosts = useMemo(
    () => (showFeatured && featured ? result.data.filter((p) => p.id !== featured.id) : result.data),
    [result, showFeatured, featured],
  );

  const popular = useMemo(
    () => [...BLOG_POSTS.filter((p) => p.status === "published")].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
    [],
  );

  const stats = useMemo(() => getBlogStats(), []);
  const activeCategory = BLOG_CATEGORIES.find((c) => c.slug === category) ?? null;

  const updateParam = (key: "category" | "sort" | "q", value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  const onPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heading = q
    ? `نتایج جست‌وجوی «${q}»`
    : activeCategory
      ? `مقالات «${activeCategory.name}»`
      : sort === "popular"
        ? "پربازدیدترین مقاله‌ها"
        : sort === "oldest"
          ? "بایگانی مقالات"
          : "تازه‌ترین مقاله‌ها";

  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* ---------- ماست‌هد ---------- */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="pattern-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-navy-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-sun-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <nav className="flex items-center gap-1.5 text-[11.5px] font-bold text-navy-300" aria-label="مسیر راهنما">
            <Link to="/campaigns" className="transition hover:text-white">خانه</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            <span className="text-sun-400">بلاگ</span>
          </nav>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-sun-500/40 bg-sun-500/10 px-3.5 py-1.5 text-[11.5px] font-extrabold text-sun-400">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            مرکز دانش خرید جمعی
          </span>

          <h1 className="mt-4 font-display text-[46px] leading-[1.35] text-white sm:text-[58px]">
            بلاگ{" "}
            <span className="relative inline-block text-sun-400">
              هم‌برد
              <svg viewBox="0 0 130 10" className="absolute -bottom-1 left-0 h-2.5 w-full" aria-hidden="true">
                <path d="M3 7 C 35 1, 95 1, 127 6" stroke="#F5A623" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.7" />
              </svg>
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-8 text-navy-200">
            راهنماهای خرید جمعی، آموزش قیمت‌گذاری پله‌ای، داستان تأمین‌کننده‌ها و هر چیزی که سفره‌ی ایرانی را به‌صرفه‌تر می‌کند — بدون واسطه، درست مثل خودِ هم‌برد.
          </p>

          <div className="mt-7 max-w-xl">
            <BlogSearch
              value={input}
              onChange={setInput}
              onSubmit={() => {
                const next = new URLSearchParams(params);
                if (input.trim()) next.set("q", input.trim());
                else next.delete("q");
                next.delete("page");
                setParams(next);
              }}
              onClear={() => {
                setInput("");
                updateParam("q", null);
              }}
            />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-y-5">
            <div className="pe-7"><MastheadStat value={stats.posts} label="مقاله‌ی منتشرشده" /></div>
            <div className="border-e border-navy-700 pe-7 ps-7"><MastheadStat value={stats.categories} label="دسته‌بندی فعال" /></div>
            <div className="border-e border-navy-700 pe-7 ps-7"><MastheadStat value={Math.round(stats.views / 1000)} label="هزار بازدید مقالات" /></div>
            <div className="border-e border-navy-700 ps-7"><MastheadStat value={stats.minutes} label="دقیقه محتوای آموزشی" /></div>
          </div>
        </div>
      </section>

      {/* ---------- چیپ‌های چسبان ---------- */}
      <div className="sticky top-[68px] z-30 border-b border-navy-100 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <CategoryChips categories={BLOG_CATEGORIES} counts={counts} active={category} onSelect={(slug) => updateParam("category", slug)} />
        </div>
      </div>

      <div ref={listRef} className="mx-auto grid max-w-7xl scroll-mt-32 gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8">
        <main>
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-baseline gap-2.5 font-display text-[26px] text-navy-900">
                {heading}
                <span className="font-sans text-[11.5px] font-extrabold text-slate-400">({faNum(result.total)} مقاله)</span>
              </h2>
              <div className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white p-1">
                {([["newest", "جدیدترین"], ["oldest", "قدیمی‌ترین"], ["popular", "پربازدید"]] as const).map(([key, label]) => (
                  <button key={key} onClick={() => updateParam("sort", key === "newest" ? null : key)} className={`rounded-lg px-3 py-1.5 text-[11.5px] font-extrabold transition ${sort === key ? "bg-navy-700 text-white" : "text-slate-500 hover:bg-navy-50"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {(q || activeCategory) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11.5px] font-bold">
                <span className="text-slate-400">فیلترهای فعال:</span>
                {activeCategory && (
                  <button onClick={() => updateParam("category", null)} className="flex items-center gap-1.5 rounded-full bg-navy-700 px-3 py-1.5 text-white transition hover:bg-navy-800">
                    {activeCategory.name}
                    <span aria-hidden="true">×</span>
                  </button>
                )}
                {q && (
                  <button onClick={() => { setInput(""); updateParam("q", null); }} className="flex items-center gap-1.5 rounded-full bg-sun-500 px-3 py-1.5 text-navy-950 transition hover:bg-sun-600">
                    «{q}»
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            )}
          </Reveal>

          {showFeatured && featured && (
            <div className="mt-6">
              <FeaturedCard post={featured} />
            </div>
          )}

          <div className="mt-8">
            {gridPosts.length === 0 ? (
              q ? (
                <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-white/70 px-6 py-16 text-center">
                  <SearchX className="mx-auto h-10 w-10 text-navy-300" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-[22px] text-navy-800">نتیجه‌ای برای «{q}» یافت نشد</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-7 text-slate-500">املای عبارت را بررسی کنید، عبارت کوتاه‌تری بنویسید یا فیلتر دسته‌بندی را حذف کنید.</p>
                  <button onClick={() => { setInput(""); const n = new URLSearchParams(); setParams(n); }} className="press mt-6 rounded-xl bg-navy-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700">
                    حذف جست‌وجو و فیلترها
                  </button>
                </div>
              ) : activeCategory ? (
                <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-white/70 px-6 py-16 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-navy-300" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-[22px] text-navy-800">مقاله‌ای در این دسته یافت نشد</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-7 text-slate-500">به‌زودی محتوای این دسته منتشر می‌شود؛ تا آن زمان سراغ بقیه‌ی دسته‌ها بروید.</p>
                  <button onClick={() => updateParam("category", null)} className="press mt-6 rounded-xl bg-navy-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-navy-700">
                    مشاهده‌ی همه‌ی مقالات
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-white/70 px-6 py-16 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-navy-300" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 font-display text-[22px] text-navy-800">هنوز مقاله‌ای منتشر نشده</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-7 text-slate-500">به‌زودی مقالات آموزشی و خبری خرید جمعی در اینجا منتشر می‌شود.</p>
                </div>
              )
            ) : (
              <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gridPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* صفحه‌بندی */}
          {result.last_page > 1 && (
            <nav className="mt-12 flex flex-col items-center gap-3" aria-label="صفحه‌بندی مقالات">
              <div className="flex items-center gap-1.5">
                <button onClick={() => onPage(result.current_page - 1)} disabled={result.current_page <= 1} className="grid h-10 min-w-10 place-items-center rounded-lg border border-navy-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:border-navy-400 disabled:cursor-not-allowed disabled:opacity-40">
                  قبلی
                </button>
                {Array.from({ length: result.last_page }).map((_, i) => (
                  <button key={i} onClick={() => onPage(i + 1)} aria-current={i + 1 === result.current_page ? "page" : undefined} className={`grid h-10 min-w-10 place-items-center rounded-lg border text-sm font-bold transition ${i + 1 === result.current_page ? "border-navy-700 bg-navy-700 text-white" : "border-navy-200 bg-white text-slate-600 hover:border-sun-400 hover:text-navy-700"}`}>
                    {faNum(i + 1)}
                  </button>
                ))}
                <button onClick={() => onPage(result.current_page + 1)} disabled={result.current_page >= result.last_page} className="grid h-10 min-w-10 place-items-center rounded-lg border border-navy-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:border-navy-400 disabled:cursor-not-allowed disabled:opacity-40">
                  بعدی
                </button>
              </div>
              <p className="text-[12px] font-medium text-slate-400">صفحه‌ی {faNum(result.current_page)} از {faNum(result.last_page)}</p>
            </nav>
          )}
        </main>

        <aside className="lg:sticky lg:top-[126px] lg:self-start" aria-label="سایدبار">
          <BlogSidebar popular={popular} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
