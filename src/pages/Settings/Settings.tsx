import { useState } from "react"
import { useSettings } from "../../hooks/useSettings"
import { storageService } from "../../services/storageService"

export default function Settings() {
  const { settings, loaded, updateSettings } = useSettings()
  const [resetConfirm, setResetConfirm] = useState("")
  const [showResetBox, setShowResetBox] = useState(false)

  if (!loaded) {
    return <p className="text-slate-400">Loading...</p>
  }

  function handleExport() {
    const data = {
      habits: storageService.getHabits(),
      completions: storageService.getCompletions(),
      achievements: storageService.getAchievements(),
      settings: storageService.getSettings(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `habit-quest-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!parsed.habits || !parsed.completions) {
          alert("This file doesn't look like a valid Habit Quest backup.")
          return
        }
        const confirmed = window.confirm(
          "Importing will replace your current habits, completions, achievements, and settings. Continue?"
        )
        if (!confirmed) return

        storageService.saveHabits(parsed.habits ?? [])
        storageService.saveCompletions(parsed.completions ?? [])
        storageService.saveAchievements(parsed.achievements ?? [])
        if (parsed.settings) storageService.saveSettings(parsed.settings)

        alert("Import successful. Reloading...")
        window.location.reload()
      } catch {
        alert("Failed to read this file. Make sure it's a valid backup JSON.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  function handleReset() {
    if (resetConfirm !== "RESET") return
    storageService.saveHabits([])
    storageService.saveCompletions([])
    storageService.saveAchievements([])
    window.location.reload()
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <label className="block text-sm text-white mb-2">Theme</label>
        <div className="flex gap-2">
          {(["dark", "light", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                settings.theme === t
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <label className="block text-sm text-white mb-2">Week starts on</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ weekStartsOn: 0 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              settings.weekStartsOn === 0
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Sunday
          </button>
          <button
            onClick={() => updateSettings({ weekStartsOn: 1 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              settings.weekStartsOn === 1
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Monday
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <label className="block text-sm text-white mb-2">
          Default XP per habit
        </label>
        <input
          type="number"
          min={1}
          value={settings.defaultXP}
          onChange={(e) =>
            updateSettings({ defaultXP: Number(e.target.value) || 1 })
          }
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white w-24"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <label className="block text-sm text-white mb-2">Monthly goal</label>
        <input
          type="number"
          min={1}
          value={settings.monthlyGoal}
          onChange={(e) =>
            updateSettings({ monthlyGoal: Number(e.target.value) || 1 })
          }
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white w-24"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-between">
        <label className="text-sm text-white">Sound effects</label>
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            settings.soundEnabled ? "bg-emerald-500" : "bg-slate-700"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              settings.soundEnabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <p className="text-sm text-white mb-3">Data management</p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
          >
            Export data
          </button>
          <label className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer">
            Import data
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-slate-900 border border-red-900/50 rounded-xl p-4">
        <p className="text-sm text-red-400 mb-3">Danger zone</p>
        {!showResetBox ? (
          <button
            onClick={() => setShowResetBox(true)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg"
          >
            Reset all data
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">
              Type RESET to confirm. This permanently deletes all habits and
              completions.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
              />
              <button
                onClick={handleReset}
                disabled={resetConfirm !== "RESET"}
                className="bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                Confirm reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}