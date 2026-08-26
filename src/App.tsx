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
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden p-6 pb-24 md:pb-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App