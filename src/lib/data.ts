/* ============================================================
   لایه‌ی داده و منطق محاسبات هم‌برد
   کمپین‌ها، پله‌ها، تأمین‌کننده‌ها و محاسبات قیمت پله‌ای
   ============================================================ */

/* ---------------- ابزارهای عددی فارسی ---------------- */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export function faNum(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatPrice(n: number): string {
  return faNum(Math.round(n).toLocaleString("en-US").replace(/,/g, "٬"));
}

export function pctFa(n: number): string {
  const r = Math.round(n * 10) / 10;
  return faNum(Number.isInteger(r) ? String(r) : r.toFixed(1).replace(".", "٫"));
}

/* ---------------- تاریخ شمسی ---------------- */
export function toJalali(date: Date): { jy: number; jm: number; jd: number } {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number, jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

export function formatDateJalali(iso: string): string {
  const d = toJalali(new Date(iso));
  const pad = (n: number) => String(n).padStart(2, "0");
  return faNum(`${d.jy}/${pad(d.jm)}/${pad(d.jd)}`);
}

const MONTHS_FA = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
export function formatDateJalaliLong(iso: string): string {
  const d = toJalali(new Date(iso));
  return `${faNum(d.jd)} ${MONTHS_FA[d.jm - 1]} ${faNum(d.jy)}`;
}

export function timeAgoFa(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "امروز";
  if (days === 1) return "دیروز";
  if (days < 30) return `${faNum(days)} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${faNum(months)} ماه پیش`;
  return `${faNum(Math.floor(months / 12))} سال پیش`;
}

/* ---------------- انواع ---------------- */

export interface Tier {
  tierNumber: number;
  threshold: number; // آستانه‌ی تجمعی (واحد)
  unitPrice: number;
  feeRate: number; // درصد کارمزد
}

export interface Package {
  id: number;
  name: string;
  baseQuantity: number; // واحد در هر بسته
  unitLabel: string;
}

export interface SupplierRef {
  id: string;
  brandName: string;
  ratingAvg: number;
  reviewsCount: number;
}

export interface Campaign {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  categoryId: string;
  unitLabel: string;
  status: "active" | "scheduled" | "closed";
  startDate: string;
  endDate: string;
  totalQuantity: number;
  soldCount: number;
  tieredSoldCount: number;
  priceMax: number;
  shippingAmount: number;
  dailyViewCount: number;
  totalOrdersCount: number;
  supplier: SupplierRef;
  packages: Package[];
  tiers: Tier[];
  images: string[];
  tags: string[];
  description: string[];
}

/* ---------------- تصویرها ---------------- */
const IMG = {
  espresso: "https://image.qwenlm.ai/generated-images/8f7e49bd-b359-413f-94db-68307740824d/_result.png",
  roastery: "https://image.qwenlm.ai/generated-images/38cee432-0b14-4c6f-94a5-bc3ff0adf35a/_result.png",
  saffron: "https://image.qwenlm.ai/generated-images/213734f3-400d-4aee-9413-b372638fbf25/_result.png",
  honey: "https://image.qwenlm.ai/generated-images/298e6e0d-d5ea-4caa-a5d0-9a5bb0f2cb94/_result.png",
  nuts: "https://image.qwenlm.ai/generated-images/b87e0cd0-1fb3-4af5-893e-e950538c6ab8/_result.png",
};

/* ---------------- کمپین‌ها ---------------- */

export const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    slug: "arabica-coffee-1kg",
    title: "قهوه عربیکا تک‌خاستگاه اتیوپی — یک کیلوگرم",
    shortTitle: "قهوه عربیکا",
    category: "قهوه و دمنوش",
    categoryId: "ghahve",
    unitLabel: "کیلوگرم",
    status: "active",
    startDate: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    endDate: new Date(Date.now() + 2.5 * 86_400_000).toISOString(),
    totalQuantity: 400,
    soldCount: 262,
    tieredSoldCount: 178,
    priceMax: 1_250_000,
    shippingAmount: 0,
    dailyViewCount: 1840,
    totalOrdersCount: 196,
    supplier: { id: "roastery", brandName: "برشته‌کاری دانه", ratingAvg: 4.9, reviewsCount: 312 },
    packages: [
      { id: 1, name: "بسته‌ی ۱ کیلوگرمی", baseQuantity: 1, unitLabel: "کیلوگرم" },
      { id: 2, name: "بسته‌ی ۳ کیلوگرمی (اداری)", baseQuantity: 3, unitLabel: "کیلوگرم" },
    ],
    tiers: [
      { tierNumber: 1, threshold: 60, unitPrice: 1_250_000, feeRate: 4 },
      { tierNumber: 2, threshold: 140, unitPrice: 1_120_000, feeRate: 3.5 },
      { tierNumber: 3, threshold: 220, unitPrice: 990_000, feeRate: 3 },
      { tierNumber: 4, threshold: 300, unitPrice: 900_000, feeRate: 2.5 },
      { tierNumber: 5, threshold: 400, unitPrice: 830_000, feeRate: 2 },
    ],
    images: [IMG.espresso, IMG.roastery, IMG.honey],
    tags: ["تازه‌برشت هفتگی", "برشت متوسط", "طعم غالب: مرکبات و شکلات", "اسیدیته‌ی روشن"],
    description: [
      "این قهوه از مزارع ارتفاعات یرگاچف اتیوپی آمده و هر هفته در کارگاه «دانه» برشت می‌شود. پروفایل برشت طوری تنظیم شده که اسیدیته‌ی مرکباتی دانه حفظ شود و شیرینی شکلاتی آن در پس‌زمینه بماند؛ مناسب هم برای اسپرسو و هم برای دم‌آوری‌های فیلتری.",
      "در خرید جمعی، سفارش‌های خرد شما پیش از برشت به دست ما می‌رسد؛ یعنی دقیقاً به اندازه‌ی نیاز برشت می‌کنیم و هیچ دانه‌ای بیشتر از ۱۴ روز بعد از برشت ارسال نمی‌شود. تاریخ برشت روی هر بسته چاپ می‌شود و اگر قهوه‌ای از این مهلت گذشته بود، بدون قید و شرط مرجوع می‌کنیم.",
      "با رسیدن مجموع خریدهای پله‌ای به هر آستانه، قیمت واحد برای همه پایین می‌آید و خریدهای قبلی مابه‌التفاوت را به‌صورت کش‌بک دریافت می‌کنند. پس هر خرید، فقط برای خودتان نیست؛ برای همه‌ی گروه است.",
    ],
  },
  {
    id: 2,
    slug: "saffron-negin-gram",
    title: "زعفران نگین ممتاز قائنات — بسته‌ی ۴٫۶ گرمی",
    shortTitle: "زعفران نگین",
    category: "زعفران و ادویه",
    categoryId: "zaferan",
    unitLabel: "گرم",
    status: "active",
    startDate: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86_400_000).toISOString(),
    totalQuantity: 120,
    soldCount: 112,
    tieredSoldCount: 88,
    priceMax: 380_000,
    shippingAmount: 25_000,
    dailyViewCount: 2210,
    totalOrdersCount: 104,
    supplier: { id: "ghaen", brandName: "تعاونی طلای قائن", ratingAvg: 4.8, reviewsCount: 428 },
    packages: [
      { id: 1, name: "بسته‌ی ۴٫۶ گرمی", baseQuantity: 4.6, unitLabel: "گرم" },
      { id: 2, name: "بسته‌ی ۹٫۲ گرمی (دوقلو)", baseQuantity: 9.2, unitLabel: "گرم" },
    ],
    tiers: [
      { tierNumber: 1, threshold: 30, unitPrice: 380_000, feeRate: 4 },
      { tierNumber: 2, threshold: 60, unitPrice: 340_000, feeRate: 3.5 },
      { tierNumber: 3, threshold: 90, unitPrice: 305_000, feeRate: 3 },
      { tierNumber: 4, threshold: 120, unitPrice: 275_000, feeRate: 2.5 },
    ],
    images: [IMG.saffron, IMG.honey],
    tags: ["کروسین بالای ۲۵۰", "نگین ممتاز", "برگه‌ی آزمایش همراه", "برداشت امسال"],
    description: [
      "زعفران نگین تعاونی طلای قائن، امساله و از دشت‌های قائنات است. هر محموله پیش از فروش آزمایش می‌شود: ساکارز زیر ۶، پرولین بالای ۶۰ و قدرت رنگ‌دهی (کروسین) بالای ۲۵۰. نتیجه‌ی آزمایش همراه هر سفارش ارسال می‌شود.",
      "۵۸ کشاورز عضو این تعاونی، گل‌ها را قبل از طلوع می‌چینند و همان روز کلاله‌ها را جدا می‌کنند تا آفتاب عطر را نسوزاند. خرید مستقیم یعنی حذف دو واسطه‌ی اصلی که معمولاً تا ۴۰ درصد به قیمت اضافه می‌کنند.",
    ],
  },
  {
    id: 3,
    slug: "konar-honey-jar",
    title: "عسل کُنار تک‌گل میناب — شیشه‌ی ۹۰۰ گرمی",
    shortTitle: "عسل کُنار",
    category: "عسل و صبحانه",
    categoryId: "asal",
    unitLabel: "شیشه",
    status: "scheduled",
    startDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    endDate: new Date(Date.now() + 12 * 86_400_000).toISOString(),
    totalQuantity: 250,
    soldCount: 0,
    tieredSoldCount: 0,
    priceMax: 520_000,
    shippingAmount: 30_000,
    dailyViewCount: 940,
    totalOrdersCount: 0,
    supplier: { id: "minab", brandName: "زنبورستان میناب", ratingAvg: 4.9, reviewsCount: 256 },
    packages: [{ id: 1, name: "شیشه‌ی ۹۰۰ گرمی", baseQuantity: 1, unitLabel: "شیشه" }],
    tiers: [
      { tierNumber: 1, threshold: 60, unitPrice: 520_000, feeRate: 4 },
      { tierNumber: 2, threshold: 130, unitPrice: 465_000, feeRate: 3.5 },
      { tierNumber: 3, threshold: 200, unitPrice: 415_000, feeRate: 3 },
      { tierNumber: 4, threshold: 250, unitPrice: 375_000, feeRate: 2.5 },
    ],
    images: [IMG.honey, IMG.saffron],
    tags: ["تک‌گل کُنار", "بدون حرارت", "رُس‌بسته طبیعی", "ردیابی با شماره‌ی کندو"],
    description: [
      "عسل کُنار زنبورستان میناب، تک‌گل و بدون حرارت است؛ فقط صاف می‌شود تا آنزیم‌ها و گرده‌ها حفظ شوند. به همین دلیل با گذر زمان رُس می‌بندد که نشانه‌ی طبیعی بودن است، نه تقلب. هر شیشه شماره‌ی کندوی خودش را دارد.",
      "این کمپین به‌زودی شروع می‌شود؛ می‌توانید آن را به علاقه‌مندی‌ها اضافه کنید تا لحظه‌ی شروع باخبر شوید.",
    ],
  },
  {
    id: 4,
    slug: "yalda-nuts-mix",
    title: "آجیل مخلوط شب یلدا — بسته‌ی ۲ کیلوگرمی",
    shortTitle: "آجیل یلدا",
    category: "خشکبار و آجیل",
    categoryId: "khoshkbar",
    unitLabel: "کیلوگرم",
    status: "closed",
    startDate: new Date(Date.now() - 30 * 86_400_000).toISOString(),
    endDate: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    totalQuantity: 300,
    soldCount: 300,
    tieredSoldCount: 245,
    priceMax: 980_000,
    shippingAmount: 0,
    dailyViewCount: 120,
    totalOrdersCount: 214,
    supplier: { id: "rafjan", brandName: "باغداران رفسنجان", ratingAvg: 4.7, reviewsCount: 501 },
    packages: [{ id: 1, name: "بسته‌ی ۲ کیلوگرمی", baseQuantity: 2, unitLabel: "کیلوگرم" }],
    tiers: [
      { tierNumber: 1, threshold: 80, unitPrice: 980_000, feeRate: 4 },
      { tierNumber: 2, threshold: 160, unitPrice: 880_000, feeRate: 3.5 },
      { tierNumber: 3, threshold: 240, unitPrice: 790_000, feeRate: 3 },
      { tierNumber: 4, threshold: 300, unitPrice: 720_000, feeRate: 2.5 },
    ],
    images: [IMG.nuts, IMG.honey],
    tags: ["پسته اکبری", "فرآوری زیر ۴۸ ساعت", "مغز روشن", "فله‌ی بهداشتی"],
    description: [
      "این کمپین به پایان رسیده و تمام ۳۰۰ بسته فروخته شد. خریداران پله‌ای به پله‌ی آخر رسیدند و قیمت نهایی ۷۲۰ هزار تومان شد؛ مابه‌التفاوت خریدهای قبلی به کیف پولشان برگشت.",
      "کمپین بعدی باغداران رفسنجان برای نوروز در راه است؛ از صفحه‌ی تأمین‌کننده دنبال کنید.",
    ],
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}

export function effectiveTierOf(c: Campaign, tieredSold: number): Tier {
  const hit = [...c.tiers].reverse().find((t) => t.threshold <= tieredSold);
  return hit ?? c.tiers[0];
}

export function nextTierOf(tiers: Tier[], tieredSold: number): Tier | undefined {
  return tiers.find((t) => t.threshold > tieredSold);
}

/* ---------------- موتور محاسبات زنده ---------------- */

export interface ImpactResult {
  sold: number;
  tieredSold: number;
  projectedTieredCount: number;
  effectiveTier: Tier;
  nextTier?: Tier;
  projectedTier: Tier;
  unitPrice: number;
  feeRate: number;
  feeAmount: number;
  finalPrice: number;
  discountPct: number;
  tierChangedByUser: boolean;
  isTierMaker: boolean;
  extraTotal: number;
  baseFillPct: number;
  userFillPct: number;
  completesTier: boolean;
  tierStart: number;
  tierEnd: number;
  unitsUntilNext: number;
  nextDiscountAmount: number;
  remainingInventory: number;
  units: number;
  orderType: "regular" | "tiered";
}

export function computeImpact(
  c: Campaign,
  packageUnits: number,
  orderType: "regular" | "tiered",
  liveTieredOffset = 0,
): ImpactResult {
  const tieredSold = Math.min(c.totalQuantity, c.tieredSoldCount + liveTieredOffset);
  const sold = Math.min(c.totalQuantity, c.soldCount + (orderType === "regular" ? 0 : liveTieredOffset));
  const effectiveTier = effectiveTierOf(c, tieredSold);
  const nextTier = nextTierOf(c.tiers, tieredSold);

  const units = orderType === "tiered" ? packageUnits : 0;
  const projectedTieredCount = Math.min(c.totalQuantity, tieredSold + units);
  const projectedTier = orderType === "tiered" ? effectiveTierOf(c, projectedTieredCount) : effectiveTier;
  const tierChangedByUser = orderType === "tiered" && projectedTier.tierNumber !== effectiveTier.tierNumber;
  const isTierMaker = orderType === "tiered" && !!nextTier && projectedTieredCount >= nextTier.threshold;

  const unitPrice = projectedTier.unitPrice;
  const feeRate = projectedTier.feeRate;
  const feeAmount = Math.round((unitPrice * feeRate) / 100);
  const finalPrice = unitPrice + feeAmount;
  const discountPct = ((c.priceMax - unitPrice) / c.priceMax) * 100;
  const extraTotal = tierChangedByUser ? (effectiveTier.unitPrice - unitPrice) * units : 0;

  const tierStart = (() => {
    const idx = c.tiers.findIndex((t) => t.tierNumber === effectiveTier.tierNumber);
    return idx > 0 ? c.tiers[idx - 1].threshold : 0;
  })();
  const tierEnd = effectiveTier.threshold;
  const tierRange = Math.max(1, tierEnd - tierStart);
  const soldInTier = Math.max(0, tieredSold - tierStart);
  const baseFillPct = Math.min(100, (soldInTier / tierRange) * 100);
  const projectedInTier = Math.max(0, projectedTieredCount - tierStart);
  const totalFillPct = Math.min(100, (projectedInTier / tierRange) * 100);
  const userFillPct = Math.max(0, totalFillPct - baseFillPct);
  const completesTier = isTierMaker;

  const unitsUntilNext = nextTier ? nextTier.threshold - tieredSold : 0;
  const nextDiscountAmount = nextTier ? Math.max(0, effectiveTier.unitPrice - nextTier.unitPrice) : 0;
  const remainingInventory = Math.max(0, c.totalQuantity - sold);

  return {
    sold,
    tieredSold,
    projectedTieredCount,
    effectiveTier,
    nextTier,
    projectedTier,
    unitPrice,
    feeRate,
    feeAmount,
    finalPrice,
    discountPct,
    tierChangedByUser,
    isTierMaker,
    extraTotal,
    baseFillPct,
    userFillPct,
    completesTier,
    tierStart,
    tierEnd,
    unitsUntilNext,
    nextDiscountAmount,
    remainingInventory,
    units,
    orderType,
  };
}

export type OrderType = "regular" | "tiered";

/* ---------------- کش‌بک خریدار قبلی ---------------- */
export function cashbackFor(c: Campaign, userPreviousUnitPrice: number, userUnits: number, liveTieredOffset = 0) {
  const tieredSold = Math.min(c.totalQuantity, c.tieredSoldCount + liveTieredOffset);
  const current = effectiveTierOf(c, tieredSold);
  if (userPreviousUnitPrice <= current.unitPrice) return 0;
  return (userPreviousUnitPrice - current.unitPrice) * userUnits;
}
