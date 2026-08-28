import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, Star, X, XCircle } from "lucide-react";
import { FileText } from "lucide-react";

/* ---------- لایه‌ی نویز ---------- */
export function GrainLayer() {
  return <div className="grain pointer-events-none fixed inset-0 z-[70]" aria-hidden="true" />;
}

/* ---------- نوار پیشرفت اسکرول ---------- */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="progress-rail fixed inset-x-0 top-0 z-[80] h-[3px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-l from-sun-500 via-sun-400 to-leaf-400 transition-[width] duration-150"
        style={{ width: `${pct}%`, marginLeft: "auto" }}
      />
    </div>
  );
}

/* ---------- ترنزیشن صفحه ---------- */
export function PageTransition({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  return (
    <div key={routeKey} className="page-enter">
      {children}
    </div>
  );
}

/* ---------- نمایش تدریجی ---------- */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const style: CSSProperties = { ["--reveal-delay" as string]: `${delay}ms` };
  return (
    <div ref={ref} style={style} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ---------- شمارنده‌ی افزایشی ---------- */
export function useCountUp(target: number, duration = 1400, delay = 0): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const to = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return value;
}

/* ---------- سربرگ بخش ---------- */
export function SectionHead({
  kicker,
  title,
  lead,
  align = "start",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {kicker && <span className="text-[12px] font-extrabold tracking-wide text-sun-600">{kicker}</span>}
      <h2 className="relative mt-1 inline-block font-display text-[30px] leading-tight text-navy-900 sm:text-[36px]">
        {title}
        <svg viewBox="0 0 130 8" className="absolute -bottom-1 left-0 h-2 w-full" aria-hidden="true">
          <path d="M3 6 C 35 1, 95 1, 127 5" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
        </svg>
      </h2>
      {lead && <p className={`mt-4 max-w-2xl text-[13.5px] leading-8 text-slate-500 ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  );
}

/* ---------- ستاره‌ها ---------- */
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`امتیاز ${rating}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(rating) ? "fill-sun-500 text-sun-500" : "fill-navy-100 text-navy-100"} />
      ))}
    </span>
  );
}

/* ---------- مودال ---------- */
export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="fade-in fixed inset-0 z-[90] grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="animate-pop max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- تصویر با fallback ---------- */
export function SmartImage({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-navy-100 text-navy-300 ${className}`}>
        <FileText className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[11px] font-medium text-navy-400">هم‌برد</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/* ---------- توست ---------- */
export interface ToastItem {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
}

const ToastContext = createContext<{ push: (kind: ToastItem["kind"], message: string) => void }>({ push: () => {} });
export function useToast() {
  return useContext(ToastContext);
}

let toastSeq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastItem["kind"], message: string) => {
    const id = ++toastSeq;
    setItems((prev) => [...prev.slice(-3), { id, kind, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf-500" />,
    error: <XCircle className="h-5 w-5 shrink-0 text-rose-500" />,
    info: <Info className="h-5 w-5 shrink-0 text-sun-500" />,
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-5 z-[95] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="toast-in pointer-events-auto flex items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3 shadow-lift">
            {icons[t.kind]}
            <p className="flex-1 text-[12.5px] font-bold leading-6 text-navy-800">{t.message}</p>
            <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))} className="text-slate-300 transition hover:text-slate-500" aria-label="بستن">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
