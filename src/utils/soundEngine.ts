class SoundEngine {
  private ctx: AudioContext | null = null

  private initCtx() {
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

  // System notification ping / popup
  playSystemAlert() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now) // A5
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1) // A6

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
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
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
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51] // A4, C#5, E5, A5, C#6, E6
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
    if (!this.ctx) return
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

  // ARISE Shadow Extraction sound (Deep bass swell + ethereal resonance)
  playAriseSound() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // Sub-bass sweep
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

    // High shimmer notes
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
}

export const soundEngine = new SoundEngine()
