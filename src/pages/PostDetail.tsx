import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, Clock, Eye, Share2, TrendingUp } from "lucide-react";
import { Footer, Header } from "../components/Layout";
import { Reveal, SmartImage, useToast } from "../components/ui";
import {
  BLOG_POSTS, formatViews, getBlogAuthor, getBlogCategory, getBlogPost, publishedAtOf, readingTimeOf,
} from "../lib/blog";
import { faNum, formatDateJalaliLong } from "../lib/data";

function RelatedCard({ slug }: { slug: string }) {
  const p = BLOG_POSTS.find((x) => x.slug === slug)!;
  const cat = getBlogCategory(p.categoryId);
  return (
    <Link to={`/blog/${p.slug}`} className="shine group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift">
      <div className="relative aspect-video overflow-hidden">
        <SmartImage src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {cat && <span className="absolute right-3 top-3 rounded-full bg-navy-900/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">{cat.name}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="clamp-2 text-[13.5px] font-extrabold leading-6 text-navy-900 group-hover:text-navy-600">{p.title}</h3>
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-[10.5px] font-bold text-slate-400">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {faNum(readingTimeOf(p))} دقیقه
        </span>
      </div>
    </Link>
  );
}

export default function PostDetail() {
  const { slug } = useParams();
  const toast = useToast();
  const post = getBlogPost(slug ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-navy-50 text-navy-300">
            <BookOpen className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-[30px] text-navy-900">مقاله پیدا نشد!</h1>
          <p className="mt-2 text-[13.5px] leading-8 text-slate-500">این مقاله وجود ندارد یا منتشر نشده است.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-600 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-navy-700">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            بازگشت به بلاگ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const author = getBlogAuthor(post.authorId);
  const category = getBlogCategory(post.categoryId);
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.categoryId === post.categoryId)
    .concat(BLOG_POSTS.filter((p) => p.slug !== post.slug && p.categoryId !== post.categoryId))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-paper">
      {/* نوار پیشرفت مطالعه */}
      <div className="progress-rail fixed inset-x-0 top-0 z-[80] h-1 bg-transparent" aria-hidden="true">
        <div className="h-full bg-gradient-to-l from-sun-500 to-leaf-400" style={{ width: `${progress}%`, marginLeft: "auto" }} />
      </div>

      <Header />

      {/* ---------- سربرگ تیره ---------- */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pattern-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-navy-600/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-10 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11.5px] font-bold text-navy-300" aria-label="مسیر راهنما">
            <Link to="/blog" className="transition hover:text-white">بلاگ</Link>
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            {category && (
              <>
                <Link to={`/blog?category=${category.slug}`} className="transition hover:text-white">{category.name}</Link>
                <ChevronLeft className="h-3 w-3" aria-hidden="true" />
              </>
            )}
            <span className="text-sun-400">{post.title.slice(0, 30)}…</span>
          </nav>

          <h1 className="mt-5 font-display text-[34px] leading-[1.4] text-white sm:text-[42px]">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] font-bold text-navy-200">
            <span className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-navy-700" style={{ backgroundColor: author.color }} aria-hidden="true">
                {author.initials}
              </span>
              <span>
                <span className="block text-[12.5px] font-extrabold text-white">{author.fullName}</span>
                <span className="block text-[10.5px] text-navy-300">{author.role}</span>
              </span>
            </span>
            <span className="hidden h-6 w-px bg-navy-700 sm:block" aria-hidden="true" />
            <span>{formatDateJalaliLong(publishedAtOf(post))}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />{faNum(readingTimeOf(post))} دقیقه مطالعه</span>
            <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />{formatViews(post.viewCount)} بازدید</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* تصویر کاور */}
        <Reveal>
          <div className="relative -mt-2 overflow-hidden rounded-2xl border border-navy-100 shadow-lift">
            <div className="relative aspect-[16/9]">
              <SmartImage src={post.cover} alt={post.title} eager className="kenburns absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>

        {/* متن مقاله */}
        <article className="py-10">
          {post.content.map((block, i) => (
            <Reveal key={i} delay={60}>
              {block.h && <h2 className="mb-3 mt-9 font-display text-[26px] leading-snug text-navy-900">{block.h}</h2>}
              <p className={`text-[14.5px] leading-9 text-slate-600 ${!block.h && i === 0 ? "dropcap" : ""}`}>{block.p}</p>
            </Reveal>
          ))}

          {/* کال‌اوت خرید پله‌ای */}
          <Reveal>
            <div className="relative mt-10 overflow-hidden rounded-2xl bg-navy-950 p-6 text-white sm:p-7">
              <div className="pattern-dots absolute inset-0 opacity-50" aria-hidden="true" />
              <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-extrabold text-sun-400">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    خرید پله‌ای را امتحان کنید
                  </p>
                  <h3 className="mt-1.5 font-display text-[22px] leading-snug">با هر خرید، قیمت برای همه پایین می‌آید</h3>
                </div>
                <Link to="/campaigns" className="press shrink-0 rounded-xl bg-sun-500 px-5 py-3 text-[12.5px] font-extrabold text-navy-950 transition hover:bg-sun-400">
                  مشاهده‌ی کمپین‌ها
                </Link>
              </div>
            </div>
          </Reveal>

          {/* کارت نویسنده */}
          <Reveal>
            <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:flex-row sm:items-center">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-[22px] text-white" style={{ backgroundColor: author.color }} aria-hidden="true">
                {author.initials}
              </span>
              <div className="flex-1">
                <p className="text-[10.5px] font-extrabold text-sun-600">نویسنده</p>
                <h3 className="mt-0.5 font-display text-[20px] text-navy-900">{author.fullName}</h3>
                <p className="mt-1 text-[12px] leading-6 text-slate-500">{author.role} در هم‌برد؛ می‌نویسد تا خرید جمعی برای همه ساده و شفاف شود.</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.push("success", "لینک مقاله کپی شد."); }}
                className="press flex items-center gap-2 rounded-xl border border-navy-200 px-4 py-2.5 text-[12px] font-extrabold text-navy-700 transition hover:border-navy-400 hover:bg-navy-50"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                اشتراک‌گذاری
              </button>
            </div>
          </Reveal>
        </article>

        {/* مقالات مرتبط */}
        <section className="pb-4">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="font-display text-[26px] text-navy-900">مقالات مرتبط</h2>
              <Link to="/blog" className="flex items-center gap-1.5 text-[12px] font-extrabold text-navy-500 transition hover:text-navy-800">
                همه‌ی مقالات
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <RelatedCard slug={p.slug} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
