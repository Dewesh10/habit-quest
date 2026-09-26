import { useState, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import BottomNav from "./components/layout/BottomNav"
import SystemBoot from "./components/common/SystemBoot"
import AmbientBackground from "./components/common/AmbientBackground"
import PageTransition from "./components/common/PageTransition"
import { ToastProvider } from "./components/common/Toast"
import SystemOracle from "./components/common/SystemOracle"
import OnboardingFlow from "./components/onboarding/OnboardingFlow"
import SystemErrorBoundary from "./components/common/SystemErrorBoundary"
import { storageService } from "./services/storageService"
import { useHunterSystem } from "./hooks/useHunterSystem"


import SystemVoiceOverlay from "./components/common/SystemVoiceOverlay"

// Lazy loaded routes for per-route code splitting
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"))
const Habits = lazy(() => import("./pages/Habits/Habits"))
const Dungeons = lazy(() => import("./pages/Dungeons/Dungeons"))
const InventoryShop = lazy(() => import("./pages/InventoryShop/InventoryShop"))
const Skills = lazy(() => import("./pages/Skills/Skills"))
const Analytics = lazy(() => import("./pages/Analytics/Analytics"))
const Achievements = lazy(() => import("./pages/Achievements/Achievements"))
const Settings = lazy(() => import("./pages/Settings/Settings"))
const LandingPage = lazy(() => import("./pages/Landing/LandingPage"))
const TermsOfService = lazy(() => import("./pages/Legal/TermsOfService"))
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"))

function RouteFallback() {
  return (
    <div className="p-8 text-center font-mono text-cyan-300 text-xs animate-pulse">
      &gt; LOADING SYSTEM MODULE...
    </div>
  )
}

function AppContent() {
  const {
    gold,
    inventory,
    gates,
    shadows,
    skills,
    buyItem,
    toggleEquipWeapon,
    usePotion,
    clearGate,
    extractShadow,
    assignShadowCategory,
  } = useHunterSystem()

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route
          path="/dungeons"
          element={
            <Dungeons
              gates={gates}
              shadows={shadows}
              onClearGate={clearGate}
              onExtractShadow={extractShadow}
              onAssignCategory={assignShadowCategory}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <InventoryShop
              gold={gold}
              inventory={inventory}
              onBuyItem={buyItem}
              onToggleEquip={toggleEquipWeapon}
              onUsePotion={usePotion}
            />
          }
        />
        <Route path="/skills" element={<Skills skills={skills} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem("hq-booted") === "true")
  const [onboarded, setOnboarded] = useState(() => storageService.getOnboarded())

  function handleBootDone() {
    sessionStorage.setItem("hq-booted", "true")
    setBooted(true)
  }

  function handleOnboardingFinished() {
    setOnboarded(true)
  }

  if (!booted) {
    return <SystemBoot onDone={handleBootDone} />
  }

  if (!onboarded) {
    return <OnboardingFlow onFinished={handleOnboardingFinished} />
  }

  return (
    <SystemErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="*"
                element={
                  <div className="flex min-h-screen relative z-10">
                    <AmbientBackground />
                    <Sidebar />
                    <main className="flex-1 min-w-0 w-full overflow-x-hidden p-6 pb-24 md:pb-6">
                      <PageTransition>
                        <AppContent />
                      </PageTransition>
                    </main>
                    <BottomNav />
                    <SystemOracle />
                    <SystemVoiceOverlay />
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </SystemErrorBoundary>
  )
}

export default App
