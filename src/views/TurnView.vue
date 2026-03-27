<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useTimer } from '../composables/useTimer'
import { ACTION_COLORS, ACTION_LABELS } from '../types/game'

const store = useGameStore()
const phase = ref<'action' | 'card' | 'result'>('action')
const timerExpired = ref(false)

const { timeLeft, isRunning, start: startTimer, stop: stopTimer } = useTimer(() => {
  timerExpired.value = true
  phase.value = 'result'
})

const turn = computed(() => store.currentTurn)
const actionColor = computed(() => turn.value ? ACTION_COLORS[turn.value.action] : '#067F73')
const actionLabel = computed(() => turn.value ? ACTION_LABELS[turn.value.action] : '')

function revealCard() {
  phase.value = 'card'
  startTimer(store.settings.timerDuration)
}

function endTurn(correct: boolean) {
  stopTimer()
  store.completeTurn(correct)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const timerColor = computed(() => {
  if (timeLeft.value <= 10) return 'text-red-400'
  if (timeLeft.value <= 20) return 'text-activity-orange'
  return 'text-white'
})
</script>

<template>
  <div v-if="turn" class="flex-1 flex flex-col items-center justify-center px-6">
    <!-- PHASE: Action Reveal -->
    <div
      v-if="phase === 'action'"
      class="flex-1 flex flex-col items-center justify-center w-full text-center"
      :style="{ backgroundColor: actionColor }"
    >
      <div class="text-6xl font-black text-white mb-4 tracking-wider">
        {{ actionLabel }}
      </div>
      <p class="text-white/70 text-lg mb-2">
        {{ store.currentTeam?.name }}
      </p>
      <p class="text-white/50 text-sm mb-10">
        {{ turn.action === 'draw' ? 'Draw it on paper!' : turn.action === 'explain' ? 'Use words only!' : 'Act it out, no words!' }}
      </p>
      <button
        @click="revealCard"
        class="bg-white/20 text-white font-bold text-xl px-10 py-4 rounded-2xl backdrop-blur active:scale-95 transition-transform"
      >
        Show Card
      </button>
    </div>

    <!-- PHASE: Card + Timer -->
    <div
      v-if="phase === 'card'"
      class="flex-1 flex flex-col items-center justify-center w-full bg-gray-950"
    >
      <!-- Action badge -->
      <div
        class="px-4 py-1.5 rounded-full text-sm font-bold mb-6"
        :style="{ backgroundColor: actionColor, color: turn.action === 'act' ? '#1a1a1a' : 'white' }"
      >
        {{ actionLabel }}
      </div>

      <!-- Word Card -->
      <div class="bg-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl mb-8">
        <div class="text-3xl font-bold text-white text-center mb-4">
          {{ turn.card.en }}
        </div>
        <div class="h-px bg-gray-600 my-4"></div>
        <div class="text-2xl text-activity-cream text-center">
          {{ turn.card.es }}
        </div>
      </div>

      <!-- Timer -->
      <div :class="['text-6xl font-mono font-bold mb-6 transition-colors', timerColor]">
        {{ formatTime(timeLeft) }}
      </div>

      <!-- Skip button -->
      <button
        @click="store.skipCard()"
        class="text-gray-400 text-sm underline mb-4"
      >
        Skip card
      </button>

      <!-- Manual end -->
      <div class="flex gap-3 w-full max-w-sm">
        <button
          @click="endTurn(true)"
          class="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
        >
          Correct!
        </button>
        <button
          @click="endTurn(false)"
          class="flex-1 bg-red-500/80 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
        >
          Not Guessed
        </button>
      </div>
    </div>

    <!-- PHASE: Time's up -->
    <div
      v-if="phase === 'result'"
      class="flex-1 flex flex-col items-center justify-center w-full bg-gray-950"
    >
      <div class="text-5xl font-bold text-red-400 mb-4">Time's Up!</div>
      <p class="text-gray-400 text-lg mb-8">Did they guess it?</p>

      <div class="text-2xl font-bold text-white mb-2">{{ turn.card.en }}</div>
      <div class="text-xl text-activity-cream mb-10">{{ turn.card.es }}</div>

      <div class="flex gap-3 w-full max-w-sm">
        <button
          @click="endTurn(true)"
          class="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
        >
          Yes, correct!
        </button>
        <button
          @click="endTurn(false)"
          class="flex-1 bg-gray-700 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>
