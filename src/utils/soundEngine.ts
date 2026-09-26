class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hq-voice-muted")
      this.muted = saved === "true"
    }
  }

  isMuted() {
    return this.muted
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (typeof window !== "undefined") {
      localStorage.setItem("hq-voice-muted", String(muted))
      if (muted && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }

  toggleMute() {
    this.setMuted(!this.muted)
    return this.muted
  }

  private initCtx() {
    if (this.muted) return
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
  }

  // Futuristic mechanical click sound for UI buttons
  playClick() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)
  }

  // Stat point allocation chime
  playStatAllocated() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  // Boss hit / slash impact sound
  playBossHit() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    // Low rumble
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Pomodoro focus completion chime
  playPomodoroTick() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(987.77, now) // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.1) // E6

    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }

  // System notification ping / popup
  playSystemAlert() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Quest complete chime
  playQuestChime() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const noteTime = now + idx * 0.07

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.12, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.2)
    })
  }

  // Level Up fanfare
  playLevelUpFanfare() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51]
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = now + idx * 0.08

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.1, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + 0.4)
    })
  }

  // Penalty Zone emergency siren
  playPenaltySiren() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.linearRampToValueAtTime(900, now + 0.3)
    osc.frequency.linearRampToValueAtTime(300, now + 0.6)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.7)
  }

  // ARISE Shadow Extraction sound
  playAriseSound() {
    this.initCtx()
    if (!this.ctx || this.muted) return
    const now = this.ctx.currentTime

    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(60, now)
    subOsc.frequency.exponentialRampToValueAtTime(220, now + 0.6)
    subGain.gain.setValueAtTime(0.3, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    subOsc.connect(subGain)
    subGain.connect(this.ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 1.2)

    const shimmerNotes = [880, 1046.5, 1318.5, 1760]
    shimmerNotes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const t = now + 0.2 + idx * 0.1

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  }

  // Web Speech API Text-to-Speech Mechanical System Voice Directives
  speakSystemDirective(text: string) {
    if (this.muted || typeof window === "undefined" || !("speechSynthesis" in window)) return
    try {
      window.speechSynthesis.cancel() // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 0.85
      utterance.volume = 0.9

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (v) => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("English")
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      // Speech synthesis unsupported or blocked
    }
  }
}

export const soundEngine = new SoundEngine()

