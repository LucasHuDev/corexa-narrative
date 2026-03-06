import "./styles/globals.css";
import "./styles/app.css";

import Hero from "./components/Hero.jsx";
import Philosophy from "./components/Philosophy.jsx";
import ArchitecturePinned from "./components/ArchitecturePinned.jsx";
import Metrics from "./components/Metrics.jsx";
import Builds from "./components/Builds.jsx";
import Contact from "./components/Contact.jsx";
import Cursor from "./components/Cursor.jsx";
import ProgressRail from "./components/ProgressRail.jsx";
import SideNav from "./components/SideNav.jsx";
import SystemBackground from "./components/SystemBackground.jsx";
import Analyzer from "./components/Analyzer.jsx";

export default function App() {
  const path = window.location.pathname;

  if (path === "/analyzer") {
    return (
      <div className="page">
        <SystemBackground />
        <Cursor />
        <Analyzer />
      </div>
    );
  }

  return (
    <div className="page">
      <SystemBackground />
      <SideNav />
      <ProgressRail />
      <Cursor />
      <Hero />
      <Philosophy />
      <ArchitecturePinned />
      <Metrics />
      <Builds />
      <Contact />
    </div>
  );
}
