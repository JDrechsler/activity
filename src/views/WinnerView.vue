<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center bg-gray-950 px-6 text-center">
    <!-- Confetti-ish -->
    <div class="confetti-container">
      <div v-for="i in 30" :key="i" class="confetti-piece" :style="{ '--i': i }"></div>
    </div>

    <div class="text-6xl mb-4">🏆</div>

    <h1 class="text-4xl font-black text-white mb-2">
      {{ store.winner?.name }}
    </h1>
    <p class="text-xl text-activity-cream mb-8">wins the game!</p>

    <!-- Final scores -->
    <div class="w-full max-w-sm flex flex-col gap-2 mb-10">
      <div
        v-for="team in [...store.teams].sort((a, b) => b.score - a.score)"
        :key="team.id"
        class="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3"
      >
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: team.color }"></div>
          <span class="text-white font-medium">{{ team.name }}</span>
        </div>
        <span class="text-white font-bold text-lg">{{ team.score }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-3 w-full max-w-sm">
      <button
        @click="store.playAgain()"
        class="bg-activity-teal text-white font-bold text-lg py-4 rounded-xl active:scale-95 transition-transform"
      >
        Play Again
      </button>
      <button
        @click="store.resetGame()"
        class="text-gray-400 underline text-sm"
      >
        New Game
      </button>
    </div>
  </div>
</template>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: calc(var(--i) * 3.3%);
  background: hsl(calc(var(--i) * 42), 80%, 60%);
  border-radius: 2px;
  animation: fall 3s ease-in-out calc(var(--i) * 0.1s) infinite;
}
@keyframes fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
