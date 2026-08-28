import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "guest" | "family" | "business" | "supplier" | "admin";

export interface SessionUser {
  role: Role;
  name: string;
  color: string;
  initials: string;
  planName?: string;
  hasActivePlan: boolean;
}

export const PERSONAS: Record<Exclude<Role, "guest">, SessionUser> = {
  family: { role: "family", name: "سارا محمدی", color: "#1a4b8c", initials: "سم", planName: "خانوار طلایی", hasActivePlan: true },
  business: { role: "business", name: "بابک کریمی", color: "#b87208", initials: "بک", hasActivePlan: false },
  supplier: { role: "supplier", name: "تعاونی برنج فومن", color: "#187542", initials: "تف", hasActivePlan: false },
  admin: { role: "admin", name: "نگار موسوی", color: "#a8432f", initials: "نم", hasActivePlan: true },
};

export const ROLE_LABELS: Record<Role, string> = {
  guest: "مهمان",
  family: "خانوار",
  business: "کسب‌وکار",
  supplier: "تأمین‌کننده",
  admin: "مدیر",
};

/** سهمیه‌ی خرید هر نقش (تومان) */
export const ROLE_QUOTA: Record<Role, number> = {
  guest: 0,
  family: 20_000_000,
  business: 200_000_000,
  supplier: 0,
  admin: 500_000_000,
};

interface SessionValue {
  user: SessionUser | null;
  login: (role: Exclude<Role, "guest">) => void;
  logout: () => void;
  favorites: number[];
  toggleFavorite: (campaignId: number) => boolean;
  isFavorite: (campaignId: number) => boolean;
}

const SessionContext = createContext<SessionValue>({
  user: null,
  login: () => {},
  logout: () => {},
  favorites: [],
  toggleFavorite: () => false,
  isFavorite: () => false,
});

const ROLE_KEY = "hambord-role";
const FAV_KEY = "hambord-favs";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Exclude<Role, "guest"> | null>(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY);
      if (saved && saved in PERSONAS) return saved as Exclude<Role, "guest">;
    } catch {}
    return null;
  });
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAV_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      if (role) localStorage.setItem(ROLE_KEY, role);
      else localStorage.removeItem(ROLE_KEY);
    } catch {}
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const login = useCallback((r: Exclude<Role, "guest">) => setRole(r), []);
  const logout = useCallback(() => setRole(null), []);

  const toggleFavorite = useCallback((id: number) => {
    let added = false;
    setFavorites((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id);
      added = true;
      return [...prev, id];
    });
    return added;
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const value = useMemo<SessionValue>(
    () => ({ user: role ? PERSONAS[role] : null, login, logout, favorites, toggleFavorite, isFavorite }),
    [role, login, logout, favorites, toggleFavorite, isFavorite],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
