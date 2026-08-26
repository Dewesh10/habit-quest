let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(frequency: number, duration: number, delay = 0) {
  const ctx = getContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = "sine"
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const startTime = ctx.currentTime + delay
  gain.gain.setValueAtTime(0.001, startTime)
  gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playQuestCompleteSound() {
  playTone(880, 0.15)
  playTone(1108.73, 0.2, 0.08)
}

export function playLevelUpSound() {
  playTone(523.25, 0.15)
  playTone(659.25, 0.15, 0.1)
  playTone(783.99, 0.3, 0.2)
}