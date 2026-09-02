import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import BottomNav from "./components/layout/BottomNav"
import Dashboard from "./pages/Dashboard/Dashboard"
import Habits from "./pages/Habits/Habits"
import Analytics from "./pages/Analytics/Analytics"
import Achievements from "./pages/Achievements/Achievements"
import Settings from "./pages/Settings/Settings"
import SystemBoot from "./components/common/SystemBoot"
import AmbientBackground from "./components/common/AmbientBackground"
import PageTransition from "./components/common/PageTransition"
import { ToastProvider } from "./components/common/Toast"
import SystemOracle from "./components/common/SystemOracle"

function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem("hq-booted") === "true")

  function handleBootDone() {
    sessionStorage.setItem("hq-booted", "true")
    setBooted(true)
  }

  if (!booted) {
    return <SystemBoot onDone={handleBootDone} />
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <AmbientBackground />
        <div className="flex min-h-screen relative z-10">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-x-hidden p-6 pb-24 md:pb-6">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </PageTransition>
          </main>
          <BottomNav />
          <SystemOracle />
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

