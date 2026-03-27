<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

function progressPercent(score: number): number {
  return Math.min(100, (score / store.settings.targetScore) * 100)
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-gray-950 px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-white">Scoreboard</h1>
      <span class="text-gray-400 text-sm">First to {{ store.settings.targetScore }}</span>
    </div>

    <!-- Teams/Scores -->
    <div class="flex flex-col gap-3 flex-1">
      <div
        v-for="(team, index) in store.teams"
        :key="team.id"
        :class="[
          'rounded-2xl p-4 transition-all',
          index === store.currentTeamIndex
            ? 'bg-gray-800 ring-2 ring-activity-teal scale-[1.02]'
            : 'bg-gray-800/50'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: team.color }"></div>
            <span class="text-white font-semibold">{{ team.name }}</span>
            <span
              v-if="index === store.currentTeamIndex"
              class="text-xs bg-activity-teal text-white px-2 py-0.5 rounded-full"
            >
              Playing
            </span>
          </div>
          <span class="text-2xl font-bold text-white">{{ team.score }}</span>
        </div>

        <!-- Progress bar -->
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: progressPercent(team.score) + '%',
              backgroundColor: team.color,
            }"
          ></div>
        </div>

        <!-- Players in team -->
        <div v-if="store.mode === 'teams'" class="mt-2 flex gap-1.5 flex-wrap">
          <span
            v-for="pid in team.playerIds"
            :key="pid"
            class="text-xs text-gray-400"
          >
            {{ store.players.find((p) => p.id === pid)?.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Start Turn -->
    <div class="mt-6 flex flex-col items-center gap-3">
      <p class="text-activity-cream text-lg font-semibold">
        {{ store.currentTeam?.name }}'s turn
      </p>
      <button
        @click="store.startTurn()"
        class="w-full bg-activity-teal text-white font-bold text-xl py-5 rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        Start Turn
      </button>
      <button
        @click="store.resetGame()"
        class="text-gray-500 text-sm underline"
      >
        End Game
      </button>
    </div>
  </div>
</template>
