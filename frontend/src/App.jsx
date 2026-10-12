import PrivacyNotice from "./components/PrivacyNotice.jsx";
import AboutUs from "./components/AboutUs.jsx";
import LandingPage from "./components/LandingPage.jsx";

export default function App() {
  if (window.location.pathname === "/privacy") return <PrivacyNotice />;
  if (window.location.pathname === "/about-us") return <AboutUs />;
  return <LandingPage />;
}

