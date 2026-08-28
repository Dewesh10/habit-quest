import { useState } from "react"
import { useSettings } from "../../hooks/useSettings"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useAchievements } from "../../hooks/useAchievements"
import { storageService } from "../../services/storageService"
import CornerBrackets from "../../components/common/CornerBrackets"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { useToast } from "../../components/common/Toast"

export default function Settings() {
  const { settings, loaded, updateSettings } = useSettings()
  const { habits } = useHabits()
  const { completions } = useCompletions()
  const { achievements } = useAchievements(habits, completions)
  const toast = useToast()

  const [resetConfirm, setResetConfirm] = useState("")
  const [showResetBox, setShowResetBox] = useState(false)

  const [pendingImport, setPendingImport] = useState<Record<string, unknown> | null>(null)

  if (!loaded) {
    return <p className="text-slate-400">Loading...</p>
  }

  const unlockedTitles = achievements.filter((a) => a.unlockedAt && a.title)

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
    toast.success("Backup downloaded.")
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!parsed.habits || !parsed.completions) {
          toast.error("This file doesn't look like a valid Habit Quest backup.")
          return
        }
        setPendingImport(parsed)
      } catch {
        toast.error("Failed to read this file. Make sure it's a valid backup JSON.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  function confirmImport() {
    if (!pendingImport) return
    storageService.saveHabits((pendingImport.habits as never) ?? [])
    storageService.saveCompletions((pendingImport.completions as never) ?? [])
    storageService.saveAchievements((pendingImport.achievements as never) ?? [])
    if (pendingImport.settings) storageService.saveSettings(pendingImport.settings as never)
    setPendingImport(null)
    toast.success("Import successful. Reloading...")
    setTimeout(() => window.location.reload(), 900)
  }

  function handleReset() {
    if (resetConfirm !== "RESET") return
    storageService.saveHabits([])
    storageService.saveCompletions([])
    storageService.saveAchievements([])
    toast.success("All data reset.")
    setTimeout(() => window.location.reload(), 900)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-white mb-6 uppercase tracking-wide">Settings</h1>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <div className="system-panel-scan" style={{ top: 0 }} />
        <label className="system-panel-header block mb-2">Theme</label>
        <div className="flex gap-2">
          {(["dark", "light", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              aria-pressed={settings.theme === t}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                settings.theme === t
                  ? "bg-blue-500 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <label className="system-panel-header block mb-2">Title</label>
        {unlockedTitles.length === 0 ? (
          <p className="text-xs text-slate-500">
            Unlock achievements to earn titles you can display.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Equip a title">
            <button
              onClick={() => updateSettings({ equippedTitle: null })}
              aria-pressed={settings.equippedTitle === null}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                settings.equippedTitle === null
                  ? "bg-blue-500 text-slate-950 border-blue-400"
                  : "bg-slate-800 text-slate-300 border-blue-900/40"
              }`}
            >
              None
            </button>
            {unlockedTitles.map((a) => (
              <button
                key={a.id}
                onClick={() => updateSettings({ equippedTitle: a.id })}
                aria-pressed={settings.equippedTitle === a.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  settings.equippedTitle === a.id
                    ? "bg-blue-500 text-slate-950 border-blue-400"
                    : "bg-slate-800 text-slate-300 border-blue-900/40"
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <label className="system-panel-header block mb-2">Week starts on</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ weekStartsOn: 0 })}
            aria-pressed={settings.weekStartsOn === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
              settings.weekStartsOn === 0
                ? "bg-blue-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Sunday
          </button>
          <button
            onClick={() => updateSettings({ weekStartsOn: 1 })}
            aria-pressed={settings.weekStartsOn === 1}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
              settings.weekStartsOn === 1
                ? "bg-blue-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Monday
          </button>
        </div>
      </div>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <label htmlFor="default-xp" className="system-panel-header block mb-2">
          Default XP per habit
        </label>
        <input
          id="default-xp"
          type="number"
          min={1}
          value={settings.defaultXP}
          onChange={(e) =>
            updateSettings({ defaultXP: Number(e.target.value) || 1 })
          }
          className="bg-slate-800 border border-blue-900/50 rounded-lg px-3 py-1.5 text-sm text-white w-24 font-mono focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
        />
      </div>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <label htmlFor="monthly-goal" className="system-panel-header block mb-2">Monthly goal</label>
        <input
          id="monthly-goal"
          type="number"
          min={1}
          value={settings.monthlyGoal}
          onChange={(e) =>
            updateSettings({ monthlyGoal: Number(e.target.value) || 1 })
          }
          className="bg-slate-800 border border-blue-900/50 rounded-lg px-3 py-1.5 text-sm text-white w-24 font-mono focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
        />
      </div>

      <div className="system-panel relative p-4 mb-4 flex items-center justify-between">
        <CornerBrackets />
        <label htmlFor="sound-toggle" className="system-panel-header">Sound effects</label>
        <button
          id="sound-toggle"
          role="switch"
          aria-checked={settings.soundEnabled}
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`w-11 h-6 rounded-full relative border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
            settings.soundEnabled
              ? "bg-blue-500 border-blue-400"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              settings.soundEnabled ? "left-5.5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <div className="system-panel relative p-4 mb-4">
        <CornerBrackets />
        <p className="system-panel-header mb-3">Data management</p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            Export data
          </button>
          <label className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer border border-blue-900/40 focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
            Import data
            <input
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="system-panel relative p-4">
        <CornerBrackets />
        <p className="system-panel-header mb-3 text-red-400">Danger zone</p>
        {!showResetBox ? (
          <button
            onClick={() => setShowResetBox(true)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
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
              <label htmlFor="reset-confirm" className="sr-only">Type RESET to confirm</label>
              <input
                id="reset-confirm"
                type="text"
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                className="bg-slate-800 border border-red-900/50 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
              />
              <button
                onClick={handleReset}
                disabled={resetConfirm !== "RESET"}
                className="bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
              >
                Confirm reset
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Import Backup"
        message="Importing will replace your current habits, completions, achievements, and settings. This can't be undone."
        confirmLabel="Import & Replace"
        danger
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  )
}
