import { faNum } from "./data";

export interface BlogAuthor {
  id: string;
  fullName: string;
  role: string;
  initials: string;
  color: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ContentBlock {
  h?: string;
  p: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  cover: string;
  categoryId: number;
  authorId: string;
  daysAgo: number;
  viewCount: number;
  isFeatured?: boolean;
  status: "published" | "draft";
  content: ContentBlock[];
}

const IMG = {
  rice: "https://image.qwenlm.ai/generated-images/f69380fd-0bf5-4242-90d3-f58869b302a3/_result.png",
  coffee: "https://image.qwenlm.ai/generated-images/f06ca06e-8444-4b08-96cc-651adeca818a/_result.png",
  saffron: "https://image.qwenlm.ai/generated-images/213734f3-400d-4aee-9413-b372638fbf25/_result.png",
  tiered: "https://image.qwenlm.ai/generated-images/08010ab9-2900-41ec-979a-3aef38e58545/_result.png",
  community: "https://image.qwenlm.ai/generated-images/d5a7a4b4-3aad-44cf-be7c-e24061c1a345/_result.png",
  honey: "https://image.qwenlm.ai/generated-images/298e6e0d-d5ea-4caa-a5d0-9a5bb0f2cb94/_result.png",
  polo: "https://image.qwenlm.ai/generated-images/21ec5dd1-a17f-430a-b0a0-ab3121e9f940/_result.png",
  nuts: "https://image.qwenlm.ai/generated-images/b87e0cd0-1fb3-4af5-893e-e950538c6ab8/_result.png",
};

export const BLOG_AUTHORS: BlogAuthor[] = [
  { id: "a1", fullName: "نیما رستگار", role: "سردبیر هم‌برد", initials: "نر", color: "#1a4b8c" },
  { id: "a2", fullName: "سارا محمدی", role: "کارشناس محتوا", initials: "سم", color: "#b87208" },
  { id: "a3", fullName: "امیر کاویانی", role: "تحلیلگر بازار", initials: "اک", color: "#187542" },
  { id: "a4", fullName: "گلاره عبدالهی", role: "نویسنده‌ی آشپزی", initials: "گع", color: "#a8432f" },
  { id: "a5", fullName: "حامد توکلی", role: "مدیر رشد", initials: "حت", color: "#0e7490" },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 1, name: "برنج ایرانی", slug: "berenj", isActive: true },
  { id: 2, name: "قهوه و دمنوش", slug: "ghahve", isActive: true },
  { id: 3, name: "زعفران و ادویه", slug: "zaferan", isActive: true },
  { id: 4, name: "روغن و زیتون", slug: "roghan", isActive: true },
  { id: 5, name: "خشکبار و آجیل", slug: "khoshkbar", isActive: true },
  { id: 6, name: "عسل و صبحانه", slug: "asal", isActive: true },
  { id: 7, name: "آموزش خرید پله‌ای", slug: "kharid-pollei", isActive: true },
  { id: 8, name: "اشتراک و عضویت", slug: "eshterak", isActive: true },
  { id: 9, name: "اخبار هم‌برد", slug: "akhbar", isActive: true },
  { id: 10, name: "داستان تأمین‌کننده", slug: "tamin-konande", isActive: true },
  { id: 11, name: "آشپزی و رسپی", slug: "ashpazi", isActive: true },
  { id: 12, name: "صرفه‌جویی خانوار", slug: "sarfe-jooyi", isActive: true },
  { id: 13, name: "لبنیات محلی", slug: "labaniat", isActive: true },
];

const C = {
  berenj: [
    "برنج ایرانی فقط یک ماده‌ی غذایی نیست؛ بخشی از هویت سفره‌ی ماست. از شالیزارهای گیلان و مازندران تا انبار تعاونی‌ها، هر کیلو برنج مسیری طولانی را طی می‌کند تا به خانه‌ی شما برسد؛ مسیری که اگر کوتاه‌تر شود، هم قیمت پایین می‌آید و هم تازگی محصول بیشتر حفظ می‌شود.",
    "در خرید جمعی، سفارش‌های خرد خانوارها به یک سفارش بزرگ تبدیل می‌شود؛ درست همان حجمی که برای خرید مستقیم از شالیکوبی لازم است. حذف واسطه‌ها یعنی حذف دو تا سه لایه‌ی سود که معمولاً ۲۰ تا ۳۰ درصد قیمت نهایی را می‌سازند.",
    "مهم‌ترین معیار کیفیت برنج، عطر آن بعد از پخت است؛ نه فقط ظاهر دانه. برنج امساله با رطوبت استاندارد ۱۲ تا ۱۴ درصد، موقع پخت قد می‌کشد و عطرش کل خانه را برمی‌دارد. برای تست ساده، چند دانه را کف دست گرم کنید و بو بکشید.",
    "نگهداری درست برنج ساده است: ظرف دربسته، جای خشک و خنک و دور از نور مستقیم. اگر برنج را در حجم خرید جمعی خریده‌اید، آن را به بسته‌های مصرف یک‌ماهه تقسیم کنید تا هر بار که بسته‌ی تازه باز می‌کنید، عطر روز اول را داشته باشید.",
  ],
  kharid: [
    "خرید پله‌ای ساده است: هرچه تعداد شرکت‌کننده‌ی یک کمپین بیشتر شود، قیمت هر واحد پایین می‌آید. مثل پله‌های یک نردبان؛ پله‌ی اول قیمت تک‌فروشی است و پله‌ی آخر، قیمت عمده‌ی تولیدکننده.",
    "یک مثال واقعی: در کمپین برنج هاشمی، پله‌ی اول با ۱۰ شرکت‌کننده قیمت را ۸٪ پایین آورد و پله‌ی پنجم با ۱۲۰ شرکت‌کننده به ۲۳٪ رسید. هر عضو جدید، عملاً برای بقیه هم تخفیف می‌خرد.",
    "راه‌اندازی کمپین برای اعضا آزاد است: محصول از فهرست تأمین‌کننده‌های تأییدشده انتخاب می‌شود، حداقلِ پله‌ی اول تعیین می‌شود و لینک کمپین برای همسایه‌ها و گروه‌های خانوادگی ارسال می‌شود. کل فرایند کمتر از پنج دقیقه طول می‌کشد.",
    "رایج‌ترین اشتباه، رها کردن کمپین بعد از شروع است؛ کمپین‌هایی که مدیرشان در گروه محله اطلاع‌رسانی می‌کند، به‌طور میانگین سه برابر سریع‌تر به پله‌ی آخر می‌رسند.",
  ],
  eshterak: [
    "اشتراک هم‌برد مثل کارت عضویت یک تعاونی مدرن است: ورود زودهنگام به کمپین‌ها، پله‌های تخفیف اختصاصی و ارسال رایگان سفارش‌های ماهانه. هزینه‌ی اشتراک معمولاً با اولین سفارش برمی‌گردد.",
    "طرح خانوار برای خرید ماهانه‌ی خانه طراحی شده، طرح کسب‌وکار فاکتور رسمی و قیمت پلکانیِ حجم بالا دارد و طرح سازمانی برای خریدهای گروهی شرکت‌ها با مدیریت چند کاربره است.",
    "بهترین زمان تمدید، دو هفته پیش از پایان دوره است؛ چون هم تخفیف تمدید زودهنگام فعال است و هم کمپین‌های ویژه‌ی مشترکان را از دست نمی‌دهید.",
    "یک محاسبه‌ی ساده: مشترک خانوار به‌طور میانگین ماهی ۳۴۰ هزار تومان بیش از خرید عادی صرفه‌جویی می‌کند؛ در برابر هزینه‌ی اشتراک، بازده بیش از سه برابر است.",
  ],
  zaferan: [
    "زعفران گران‌ترین ادویه‌ی جهان است و البته یکی از تقلبی‌ترین‌ها. تفاوت نگین و پوشال، عیار رنگ‌دهی و نسبت کلاله به خامه، همه چیزهایی است که قیمت واقعی را تعیین می‌کنند و چشم غیرحرفه‌ای به‌سختی تشخیص می‌دهد.",
    "خرید مستقیم از کشاورزان قائنات و گناباد در قالب کمپین جمعی، دو واسطه‌ی اصلی بازار را حذف می‌کند؛ همان جایی که معمولاً تا ۴۰ درصد به قیمت نهایی اضافه می‌شود بدون این‌که ارزشی برای خریدار بسازد.",
    "تست خانگی ساده: چند رشته زعفران را در آب ولرم بیندازید. زعفران اصل رنگ را آرام و زردِ طلایی آزاد می‌کند؛ نمونه‌ی تقلبی در چند ثانیه قرمز تند می‌شود و رشته‌ها رنگ می‌بازند.",
    "زعفران را در ظرف شیشه‌ای دربسته، دور از نور و رطوبت نگه دارید. نوع آسیاب‌شده را در بسته‌های کوچکِ مصرف یک‌ماهه تقسیم کنید تا عطرش نپرد.",
  ],
  akhbar: [
    "کمپین زعفران هفته‌ی گذشته رکورد تازه‌ای زد: ۲ تن زعفران نگین در ۷۲ ساعت، با مشارکت ۱٬۸۵۰ خانوار از ۱۴ استان. میانگین صرفه‌جویی خریداران نسبت به بازار آزاد، ۳۱٪ بود.",
    "در شش ماه گذشته، خانواده‌ی هم‌برد دو برابر شد و مجموع صرفه‌جویی اعضا از مرز ۱۲ میلیارد تومان گذشت. بیشترین رشد در گروه‌های خرید محله‌ای بود؛ جایی که همسایه‌ها کمپین‌هایشان را خودشان اداره می‌کنند.",
    "جشنواره‌ی فصلی هم‌برد از این هفته شروع می‌شود: کمپین‌های ویژه‌ی شب یلدا با آجیل، انار و برنج هاشمی، و پله‌های تخفیف دوبرابر برای مشترکان فعال.",
    "تیم تأمین هم‌برد در این دوره ۹ تعاونی جدید را به شبکه اضافه کرد؛ از برنج فومن تا زیتون رودبار و عسل زاگرس. همه‌ی تأمین‌کننده‌ها پیش از ورود، بازدید میدانی و آزمایش محصول می‌شوند.",
  ],
};

const HS: Record<string, string[]> = {
  berenj: ["از شالیزار تا انبار؛ مسیر قیمت", "چطور برنج تازه را بشناسیم؟", "نگهداری؛ راز عطر ماندگار"],
  kharid: ["پله‌ها چطور کار می‌کنند؟", "یک مثال واقعی با عدد و رقم", "راه‌اندازی کمپین در ۵ دقیقه"],
  eshterak: ["اشتراک دقیقاً چه چیزی می‌دهد؟", "کدام طرح برای شماست؟", "محاسبه‌ی بازده؛ عدد حرف می‌زند"],
  zaferan: ["نگین یا پوشال؛ مسئله این است", "سه تست خانگی تشخیص اصالت", "نگهداری زعفران مثل طلا"],
  akhbar: ["یک رکورد تازه", "هم‌برد در یک نگاه", "جشنواره‌ی پیش رو"],
};

const OPENERS = [
  "{t} — موضوعی که این هفته بیشترین پیام را از اعضای هم‌برد داشت. در این مطلب سراغ اصل ماجرا می‌رویم؛ بدون حاشیه، با مثال‌های واقعی از کمپین‌های اخیر و عدد و رقم.",
  "اگر شما هم پرسیده‌اید «{t}»، جای درستی آمده‌اید. این راهنما را بر اساس تجربه‌ی ده‌ها کمپین خرید جمعی و گفت‌وگو با خود تأمین‌کننده‌ها نوشته‌ایم.",
  "«{t}» یکی از پرتکرارترین جست‌وجوهای اعضای هم‌برد در ماه گذشته بود؛ برای همین تصمیم گرفتیم یک‌بار، کامل و ساده درباره‌اش بنویسیم تا دیگر نیازی به گشتن نباشد.",
];

const CLOSERS = [
  "در نهایت، قدرت خرید جمعی وقتی واقعی می‌شود که شما هم بخشی از آن باشید. تجربه‌ی خودتان را برایمان بنویسید؛ تجربه‌های واقعی اعضا، بهترین راهنما برای بقیه است.",
  "اگر این مطلب برایتان مفید بود، لینکش را برای دوستان و همسایه‌هایتان بفرستید؛ هر عضو جدید یعنی یک پله نزدیک‌تر شدن به قیمت بهتر برای همه.",
  "کمپین‌های مرتبط را از صفحه‌ی اصلی هم‌برد دنبال کنید و برای باخبر شدن از پله‌ی تخفیف بعدی، اعلان‌ها را روشن نگه دارید.",
];

function mkContent(title: string, cat: keyof typeof C, oi: number, picks: [number, number, number], ci: number): ContentBlock[] {
  const pool = C[cat];
  const hs = HS[cat];
  return [
    { p: OPENERS[oi].replace("{t}", title) },
    { h: hs[0], p: pool[picks[0]] },
    { p: pool[picks[1]] },
    { h: hs[1], p: pool[picks[2]] },
    { p: CLOSERS[ci] },
  ];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "group-buy-hashemi-rice",
    title: "راهنمای کامل خرید جمعی برنج هاشمی؛ از شالیزار تا سفره",
    excerpt: "چطور با پیوستن به کمپین‌های خرید جمعی، برنج هاشمی امساله را مستقیم از شالیکوبی و تا ۲۳٪ زیر قیمت بازار بخریم؟ این راهنما مسیر کامل را با عدد و رقم توضیح می‌دهد.",
    cover: IMG.rice,
    categoryId: 1,
    authorId: "a1",
    daysAgo: 2,
    viewCount: 12480,
    isFeatured: true,
    status: "published",
    content: [
      { p: "برنج هاشمی برای خیلی از خانواده‌های ایرانی، خط قرمز کیفیت سفره است؛ اما قیمتش در بازار آزاد، هر سال بخش بزرگ‌تری از سبد خرید را می‌بلعد. خبر خوب این است که فاصله‌ی قیمت شالیکوبی تا قفسه‌ی فروشگاه، اغلب به خودِ برنج برنمی‌گردد؛ به واسطه‌هایی برمی‌گردد که می‌شود حذفشان کرد." },
      { h: "مسیر برنج؛ از شالیزار تا انبار شما", p: "در مسیر سنتی، برنج از کشاورز به دلال محلی، بعد به عمده‌فروش شهر، بنکدار و در نهایت فروشگاه می‌رسد؛ چهار دست که هر کدام ۷ تا ۱۰ درصد روی قیمت می‌کشند. در کمپین جمعی هم‌برد، سفارش تجمیع‌شده‌ی خانوارها مستقیم از شالیکوبیِ تعاونی بارگیری می‌شود و فقط یک هزینه‌ی لجستیک به قیمت تولید اضافه می‌شود." },
      { p: "اعداد کمپین آبان را ببینید: قیمت پایه‌ی هر کیلو هاشمی درجه‌یک در شالیکوبی فومن، ۲۸٪ زیر میانگین خرده‌فروشی تهران بود. با احتساب هزینه‌ی ارسال تجمیعی، صرفه‌جویی نهایی اعضا روی ۲۳٪ نشست — برای یک کیسه‌ی ۱۰ کیلویی یعنی بیش از ۴۰۰ هزار تومان." },
      { h: "چطور مطمئن شویم برنج امساله است؟", p: "سه نشانه را چک کنید: رطوبت دانه (۱۲ تا ۱۴٪ استاندارد)، عطر بعد از گرم کردن چند دانه کف دست، و تاریخ شلتوک‌کشی روی بسته‌بندی. در کمپین‌های هم‌برد، برگه‌ی آزمایش رطوبت و تاریخ دقیق فرآوری همراه هر محموله منتشر می‌شود؛ چیزی که در خرید از بنکدار معمولاً پنهان می‌ماند." },
      { p: "نگهداری هم نیمی از ماجراست: برنج را به بسته‌های مصرف یک‌ماهه تقسیم کنید، در ظرف دربسته و جای خنک نگه دارید و از نور مستقیم دور کنید. برنجی که درست نگهداری شود، تا فصل بعد هم عطر روز اول را دارد." },
      { h: "قدم بعدی شما", p: "اگر اولین بار است خرید جمعی را امتحان می‌کنید، از کمپین‌های فعالِ صفحه‌ی اصلی شروع کنید؛ پله‌ی اول همیشه باز است و حتی با چند نفر هم تخفیف می‌گیرید. و اگر مدیر گروه محله یا ساختمان هستید، راه‌اندازی کمپین اختصاصی کمتر از پنج دقیقه وقت می‌گیرد — راهنمای کاملش در همین بلاگ هست." },
    ],
  },
  { id: 2, slug: "tiered-rice-price", title: "چرا قیمت برنج در خرید پله‌ای تا ۲۳٪ پایین می‌آید؟", cover: IMG.tiered, categoryId: 7, authorId: "a3", daysAgo: 5, viewCount: 8930, status: "published", content: mkContent("چرا قیمت برنج در خرید پله‌ای تا ۲۳٪ پایین می‌آید؟", "kharid", 1, [1, 0, 3], 1) },
  { id: 3, slug: "hashemi-vs-tarom", title: "تفاوت برنج هاشمی و طارم؛ کدام برای پلوی مجلسی بهتر است؟", cover: IMG.rice, categoryId: 1, authorId: "a2", daysAgo: 9, viewCount: 6210, status: "published", content: mkContent("تفاوت برنج هاشمی و طارم", "berenj", 0, [0, 2, 1], 0) },
  { id: 4, slug: "fresh-coffee-signs", title: "قهوه‌ی تازه‌برشت یا مانده؟ تشخیص با ۳ نشانه‌ی ساده", cover: IMG.coffee, categoryId: 2, authorId: "a2", daysAgo: 7, viewCount: 7350, status: "published", content: mkContent("قهوه‌ی تازه‌برشت یا مانده؟", "kharid", 2, [0, 2, 3], 2) },
  { id: 5, slug: "what-is-tiered-buying", title: "خرید پله‌ای چیست؟ آموزش کامل از صفر تا ثبت سفارش", excerpt: "اگر تازه با هم‌برد آشنا شده‌اید، این مقاله نقطه‌ی شروع شماست: مفهوم پله‌های قیمت، نقش هر عضو در کمپین و مسیر کامل از انتخاب محصول تا تحویل درب خانه.", cover: IMG.tiered, categoryId: 7, authorId: "a1", daysAgo: 12, viewCount: 9870, status: "published", content: mkContent("خرید پله‌ای چیست؟", "kharid", 0, [0, 1, 2], 0) },
  { id: 6, slug: "saffron-campaign-report", title: "گزارش کمپین زعفران؛ ۲ تن در ۷۲ ساعت، رکورد تازه", cover: IMG.saffron, categoryId: 9, authorId: "a1", daysAgo: 4, viewCount: 10240, status: "published", content: mkContent("گزارش کمپین زعفران", "akhbar", 0, [0, 1, 3], 2) },
  { id: 7, slug: "hambord-subscription-benefits", title: "اشتراک هم‌برد چه مزایایی دارد؟ یک بررسی کامل", cover: IMG.community, categoryId: 8, authorId: "a5", daysAgo: 10, viewCount: 8120, status: "published", content: mkContent("اشتراک هم‌برد چه مزایایی دارد؟", "eshterak", 1, [0, 1, 3], 0) },
  { id: 8, slug: "real-saffron-tests", title: "زعفران اصل را بشناسید؛ ۵ تست خانگی که جواب می‌دهد", excerpt: "رنگ‌دهی آرام در آب ولرم، زرد شدن نه قرمز شدن، و سه نشانه‌ی دیگر که زعفران تقلبی از پس‌شان برنمی‌آید. به‌علاوه راهنمای خرید مستقیم از قائنات.", cover: IMG.saffron, categoryId: 3, authorId: "a3", daysAgo: 14, viewCount: 9150, status: "published", content: mkContent("زعفران اصل را بشناسید", "zaferan", 2, [0, 2, 3], 0) },
  { id: 9, slug: "yalda-nuts-group-buy", title: "آجیل شب یلدا؛ با خرید جمعی تا ۳۰٪ ارزان‌تر", cover: IMG.nuts, categoryId: 5, authorId: "a2", daysAgo: 6, viewCount: 6870, status: "published", content: mkContent("آجیل شب یلدا", "kharid", 1, [2, 0, 1], 1) },
  { id: 10, slug: "saffron-polo-recipe", title: "پلوی زعفرانی مجلسی با برنج هاشمی؛ رسپی کامل", excerpt: "از نسبت آب و برنج تا راز ته‌دیگی که ترک برنمی‌دارد؛ دستور قدم‌به‌قدم پلوی زعفرانی با فوت‌های آخری که آشپزی‌تان را مجلسی می‌کند.", cover: IMG.polo, categoryId: 11, authorId: "a4", daysAgo: 8, viewCount: 11320, status: "published", content: mkContent("پلوی زعفرانی مجلسی", "berenj", 2, [0, 1, 2], 2) },
  { id: 11, slug: "monthly-savings-calc", title: "با خرید جمعی ماهی چقدر صرفه‌جویی می‌کنیم؟ یک محاسبه‌ی واقعی", cover: IMG.tiered, categoryId: 12, authorId: "a3", daysAgo: 3, viewCount: 7240, status: "published", content: mkContent("با خرید جمعی ماهی چقدر صرفه‌جویی می‌کنیم؟", "kharid", 0, [1, 3, 0], 1) },
  { id: 12, slug: "fomen-cooperative-story", title: "داستان تأمین‌کننده؛ تعاونی برنج فومن از زبان مدیرش", cover: IMG.rice, categoryId: 10, authorId: "a1", daysAgo: 44, viewCount: 4980, status: "published", content: mkContent("داستان تعاونی برنج فومن", "akhbar", 1, [1, 3, 0], 1) },
  { id: 13, slug: "konar-honey-south", title: "عسل طبیعی کُنار؛ از کندوهای دشت‌های جنوب تا خانه", cover: IMG.honey, categoryId: 6, authorId: "a4", daysAgo: 30, viewCount: 3540, status: "published", content: mkContent("عسل طبیعی کُنار", "zaferan", 2, [0, 1, 2], 0) },
];

/* ---------------- ابزارها ---------------- */
export function publishedAtOf(post: BlogPost): string {
  return new Date(Date.now() - post.daysAgo * 86_400_000).toISOString();
}
export function postText(post: BlogPost): string {
  return post.content.map((b) => `${b.h ?? ""} ${b.p}`).join(" ");
}
export function readingTimeOf(post: BlogPost): number {
  return Math.max(2, Math.ceil(postText(post).length / 180));
}
export function getBlogCategory(id: number): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.id === id);
}
export function getBlogAuthor(id: string): BlogAuthor {
  return BLOG_AUTHORS.find((a) => a.id === id) ?? BLOG_AUTHORS[0];
}
export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogStats() {
  const published = BLOG_POSTS.filter((p) => p.status === "published");
  const views = published.reduce((s, p) => s + p.viewCount, 0);
  const minutes = published.reduce((s, p) => s + readingTimeOf(p), 0);
  const cats = new Set(published.map((p) => p.categoryId)).size;
  return { posts: published.length, views, minutes, categories: cats };
}

export function formatViews(n: number): string {
  if (n >= 1000) return `${faNum((n / 1000).toFixed(1).replace(".", "٫"))} هزار`;
  return faNum(n);
}

/* ---------------- جست‌وجو و صفحه‌بندی ---------------- */
export interface BlogQuery {
  category?: string | null;
  q?: string | null;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  perPage?: number;
}

function normalize(s: string): string {
  return s
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "")
    .toLowerCase();
}

export function searchPosts(opts: BlogQuery) {
  const perPage = opts.perPage ?? 12;
  let list = BLOG_POSTS.filter((p) => p.status === "published");

  if (opts.category) {
    const cat = BLOG_CATEGORIES.find((c) => c.slug === opts.category);
    if (cat) list = list.filter((p) => p.categoryId === cat.id);
    else list = [];
  }

  if (opts.q && opts.q.trim()) {
    const nq = normalize(opts.q.trim());
    list = list.filter((p) =>
      normalize(p.title + " " + (p.excerpt ?? "") + " " + postText(p)).includes(nq),
    );
  }

  const sort = opts.sort ?? "newest";
  list = [...list].sort((a, b) => {
    if (sort === "popular") return b.viewCount - a.viewCount;
    if (sort === "oldest") return b.daysAgo - a.daysAgo;
    return a.daysAgo - b.daysAgo;
  });

  const total = list.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  let page = opts.page ?? 1;
  if (page > lastPage) page = lastPage;
  if (page < 1) page = 1;
  const data = list.slice((page - 1) * perPage, page * perPage);

  return { data, current_page: page, last_page: lastPage, total, per_page: perPage };
}
