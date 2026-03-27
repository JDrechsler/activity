import { ref, onUnmounted } from 'vue'

export function useTimer(onExpired?: () => void) {
  const timeLeft = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  function start(seconds: number) {
    stop()
    timeLeft.value = seconds
    isRunning.value = true
    intervalId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
        onExpired?.()
      }
    }, 1000)
  }

  function stop() {
    isRunning.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset(seconds: number) {
    stop()
    timeLeft.value = seconds
  }

  onUnmounted(() => stop())

  return { timeLeft, isRunning, start, stop, reset }
}
