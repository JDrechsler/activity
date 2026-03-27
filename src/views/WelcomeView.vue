<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFullscreen } from '../composables/useFullscreen'

const router = useRouter()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center bg-activity-teal px-6 text-center">
    <div class="mb-8 animate-bounce-slow">
      <div class="text-8xl font-black tracking-tight text-white drop-shadow-lg">
        A!
      </div>
    </div>

    <h1 class="text-4xl font-bold text-white mb-2">Activity</h1>
    <p class="text-activity-cream/80 text-lg mb-4">Draw. Explain. Act. Learn!</p>

    <p class="text-activity-cream/60 text-sm max-w-xs mb-10 leading-relaxed">
      Take turns drawing, explaining or acting out words while others guess.
      Every card is in English and Spanish — have fun and learn a new language at the same time!
    </p>

    <button
      @click="router.push('/setup')"
      class="bg-white text-activity-teal font-bold text-xl px-10 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
    >
      Start Game
    </button>

    <button
      @click="toggleFullscreen"
      class="mt-6 text-activity-cream/60 text-sm underline"
    >
      {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
    </button>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
