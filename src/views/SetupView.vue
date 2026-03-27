<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { CATEGORIES, CATEGORY_LABELS } from '../types/game'
import type { Difficulty, Vibe, Category } from '../types/game'

const store = useGameStore()
const step = ref<'players' | 'teams' | 'settings'>('players')
const newPlayerName = ref('')

const canProceedFromPlayers = computed(() => store.players.length >= 2)
const needsTeams = computed(() => store.players.length > 2)
const allPlayersAssigned = computed(() => {
  if (!needsTeams.value) return true
  const assigned = new Set(store.teams.flatMap((t) => t.playerIds))
  return store.players.every((p) => assigned.has(p.id))
})
const canStart = computed(() => {
  return store.settings.selectedCategories.length > 0 && store.availableCards.length > 0
})

const newTeamName = ref('')

function addPlayer() {
  const name = newPlayerName.value.trim()
  if (!name) return
  store.addPlayer(name)
  newPlayerName.value = ''
}

function proceedFromPlayers() {
  if (needsTeams.value) {
    // Auto-create 2 teams if none exist
    if (store.teams.length === 0) {
      store.addTeam('Team 1')
      store.addTeam('Team 2')
    }
    step.value = 'teams'
  } else {
    step.value = 'settings'
  }
}

function addTeam() {
  const name = newTeamName.value.trim()
  if (!name) return
  store.addTeam(name)
  newTeamName.value = ''
}

function toggleCategory(cat: Category) {
  const idx = store.settings.selectedCategories.indexOf(cat)
  if (idx >= 0) {
    store.settings.selectedCategories.splice(idx, 1)
  } else {
    store.settings.selectedCategories.push(cat)
  }
}

const vibes: { value: Vibe; label: string; desc: string }[] = [
  { value: 'family', label: 'Family', desc: 'All ages' },
  { value: 'party', label: 'Party', desc: 'Adults' },
  { value: 'mixed', label: 'Mixed', desc: 'Everything' },
]

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const targetOptions = [10, 15, 20, 25, 30]
const timerOptions = [30, 45, 60, 90, 120]
</script>

<template>
  <div class="flex-1 flex flex-col bg-gray-950 px-4 py-6 overflow-y-auto">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-white mb-6">Game Setup</h1>

    <!-- STEP: Players -->
    <div v-if="step === 'players'" class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-activity-cream">Players</h2>

      <form @submit.prevent="addPlayer" class="flex gap-2">
        <input
          v-model="newPlayerName"
          placeholder="Player name"
          class="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-activity-teal"
          maxlength="20"
        />
        <button
          type="submit"
          class="bg-activity-teal text-white font-bold px-5 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Add
        </button>
      </form>

      <div class="flex flex-col gap-2">
        <div
          v-for="player in store.players"
          :key="player.id"
          class="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3"
        >
          <span class="text-white">{{ player.name }}</span>
          <button
            @click="store.removePlayer(player.id)"
            class="text-red-400 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>

      <p v-if="store.players.length < 2" class="text-gray-500 text-sm">
        Add at least 2 players to continue
      </p>

      <button
        :disabled="!canProceedFromPlayers"
        @click="proceedFromPlayers"
        class="mt-4 bg-activity-teal text-white font-bold py-3 rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
      >
        Next
      </button>
    </div>

    <!-- STEP: Teams -->
    <div v-if="step === 'teams'" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-activity-cream">Teams</h2>
        <button @click="step = 'players'" class="text-gray-400 text-sm">Back</button>
      </div>

      <form @submit.prevent="addTeam" class="flex gap-2">
        <input
          v-model="newTeamName"
          placeholder="New team name"
          class="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-activity-teal"
          maxlength="20"
        />
        <button
          type="submit"
          class="bg-activity-orange text-white font-bold px-5 py-3 rounded-xl active:scale-95 transition-transform"
        >
          Add
        </button>
      </form>

      <div v-for="team in store.teams" :key="team.id" class="bg-gray-800 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: team.color }"></div>
            <span class="text-white font-semibold">{{ team.name }}</span>
          </div>
          <button
            v-if="store.teams.length > 2"
            @click="store.removeTeam(team.id)"
            class="text-red-400 text-sm"
          >
            Remove
          </button>
        </div>

        <!-- Unassigned players as buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="player in store.players"
            :key="player.id"
            @click="store.assignPlayerToTeam(player.id, team.id)"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              team.playerIds.includes(player.id)
                ? 'bg-activity-teal text-white'
                : 'bg-gray-700 text-gray-300'
            ]"
          >
            {{ player.name }}
          </button>
        </div>
      </div>

      <p v-if="!allPlayersAssigned" class="text-gray-500 text-sm">
        Assign all players to a team
      </p>

      <button
        :disabled="!allPlayersAssigned"
        @click="step = 'settings'"
        class="mt-4 bg-activity-teal text-white font-bold py-3 rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
      >
        Next
      </button>
    </div>

    <!-- STEP: Settings -->
    <div v-if="step === 'settings'" class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-activity-cream">Settings</h2>
        <button @click="step = needsTeams ? 'teams' : 'players'" class="text-gray-400 text-sm">Back</button>
      </div>

      <!-- Vibe -->
      <div>
        <label class="text-sm text-gray-400 mb-2 block">Vibe</label>
        <div class="flex gap-2">
          <button
            v-for="v in vibes"
            :key="v.value"
            @click="store.settings.vibe = v.value"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold text-sm transition-all',
              store.settings.vibe === v.value
                ? 'bg-activity-teal text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
          >
            <div>{{ v.label }}</div>
            <div class="text-xs opacity-60">{{ v.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Categories -->
      <div>
        <label class="text-sm text-gray-400 mb-2 block">Categories</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="cat in CATEGORIES"
            :key="cat"
            @click="toggleCategory(cat)"
            :class="[
              'py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left',
              store.settings.selectedCategories.includes(cat)
                ? 'bg-activity-teal text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ CATEGORY_LABELS[cat] }}
          </button>
        </div>
      </div>

      <!-- Difficulty -->
      <div>
        <label class="text-sm text-gray-400 mb-2 block">Difficulty</label>
        <div class="flex gap-2">
          <button
            v-for="d in difficulties"
            :key="d.value"
            @click="store.settings.difficulty = d.value"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold transition-all',
              store.settings.difficulty === d.value
                ? 'bg-activity-orange text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ d.label }}
          </button>
        </div>
      </div>

      <!-- Target Score -->
      <div>
        <label class="text-sm text-gray-400 mb-2 block">Target Score</label>
        <div class="flex gap-2">
          <button
            v-for="n in targetOptions"
            :key="n"
            @click="store.settings.targetScore = n"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold transition-all',
              store.settings.targetScore === n
                ? 'bg-activity-orange text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Timer -->
      <div>
        <label class="text-sm text-gray-400 mb-2 block">Timer (seconds)</label>
        <div class="flex gap-2">
          <button
            v-for="t in timerOptions"
            :key="t"
            @click="store.settings.timerDuration = t"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold transition-all',
              store.settings.timerDuration === t
                ? 'bg-activity-orange text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ t }}s
          </button>
        </div>
      </div>

      <!-- Available cards info -->
      <p class="text-gray-500 text-sm">
        {{ store.availableCards.length }} cards available with current settings
      </p>

      <button
        :disabled="!canStart"
        @click="store.startGame()"
        class="bg-activity-teal text-white font-bold text-lg py-4 rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
      >
        Start Game!
      </button>
    </div>
  </div>
</template>
