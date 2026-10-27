import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AwarenessCenterPage } from "./pages/AwarenessCenterPage";
import { AboutModelPage } from "./pages/AboutModelPage";

export function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [analyzerInitialText, setAnalyzerInitialText] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("scamshield_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("scamshield_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("scamshield_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const navigateToAnalyzer = (textToAnalyze?: string) => {
    if (textToAnalyze !== undefined) {
      setAnalyzerInitialText(textToAnalyze);
    }
    setCurrentPage("analyzer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? "bg-[#0a0e17] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {currentPage === "landing" && (
          <LandingPage onNavigateToAnalyzer={navigateToAnalyzer} />
        )}
        {currentPage === "analyzer" && (
          <AnalyzerPage
            initialText={analyzerInitialText}
            onAnalysisComplete={() => {}}
          />
        )}
        {currentPage === "dashboard" && (
          <DashboardPage
            onNavigateToAnalyzer={navigateToAnalyzer}
            onNavigateToHistory={() => handleNavigate("history")}
          />
        )}
        {currentPage === "history" && (
          <HistoryPage onNavigateToAnalyzer={navigateToAnalyzer} />
        )}
        {currentPage === "awareness" && <AwarenessCenterPage />}
        {currentPage === "about" && <AboutModelPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
