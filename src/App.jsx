import "./styles/globals.css";
import "./styles/app.css";
import "./styles/pages.css";

import { BrowserRouter, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import SystemBackground from "./components/SystemBackground.jsx";
import Cursor from "./components/Cursor.jsx";
import AnimatedRoutes from "./components/AnimatedRoutes.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

function Shell() {
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith("/demos/");

  return (
    <div className="page">
      {!isDemo && <SystemBackground />}
      {!isDemo && <Cursor />}
      {!isDemo && <Navbar />}
      <ScrollToTop />
      <AnimatedRoutes />
      {!isDemo && <SiteFooter />}
      {!isDemo && <CookieBanner />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
