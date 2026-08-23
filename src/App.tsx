import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SessionProvider } from "./lib/session";
import { GrainLayer, PageTransition, ScrollProgress, ToastProvider } from "./components/ui";
import CampaignsIndex from "./pages/CampaignsIndex";
import CampaignDetail from "./pages/CampaignDetail";
import SuppliersIndex from "./pages/SuppliersIndex";
import SupplierDetail from "./pages/SupplierDetail";
import BlogIndex from "./pages/BlogIndex";
import PostDetail from "./pages/PostDetail";
import PlansPage from "./pages/PlansPage";
import LoginPage from "./pages/LoginPage";

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <PageTransition routeKey={pathname}>
      <Routes>
        <Route path="/" element={<Navigate to="/campaigns" replace />} />
        <Route path="/campaigns" element={<CampaignsIndex />} />
        <Route path="/campaigns/:slug" element={<CampaignDetail />} />
        <Route path="/suppliers" element={<SuppliersIndex />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/subscriptions/plans" element={<PlansPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/campaigns" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <HashRouter>
          <GrainLayer />
          <ScrollProgress />
          <Shell />
        </HashRouter>
      </ToastProvider>
    </SessionProvider>
  );
}
