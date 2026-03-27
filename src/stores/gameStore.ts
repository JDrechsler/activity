import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { words } from '../data/words'
import { router } from '../router'
import type {
  Player,
  Team,
  GameSettings,
  TurnState,
  ActionType,
  GameMode,
  Category,
  WordCard,
} from '../types/game'
import { CATEGORIES, TEAM_COLORS } from '../types/game'

const ACTIONS: ActionType[] = ['draw', 'explain', 'act']

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export const useGameStore = defineStore('game', () => {
  // --- State ---
  const mode = ref<GameMode>('teams')
  const players = ref<Player[]>([])
  const teams = ref<Team[]>([])
  const settings = ref<GameSettings>({
    difficulty: 'medium',
    targetScore: 15,
    timerDuration: 60,
    vibe: 'mixed',
    selectedCategories: [...CATEGORIES],
  })
  const currentTeamIndex = ref(0)
  const currentTurn = ref<TurnState | null>(null)
  const usedCardIndices = ref<Set<number>>(new Set())

  // --- Getters ---
  const currentTeam = computed(() => teams.value[currentTeamIndex.value])

  const availableCards = computed(() => {
    return words.filter((w) => {
      if (!settings.value.selectedCategories.includes(w.category)) return false
      if (w.difficulty !== settings.value.difficulty) return false
      if (settings.value.vibe === 'family' && w.vibe === 'party') return false
      // 'party' and 'mixed' show everything
      return true
    })
  })

  const winner = computed(() => teams.value.find((t) => t.score >= settings.value.targetScore))

  // --- Actions ---
  function addPlayer(name: string) {
    players.value.push({ id: uid(), name })
  }

  function removePlayer(id: string) {
    players.value = players.value.filter((p) => p.id !== id)
    // Also remove from any team
    for (const team of teams.value) {
      team.playerIds = team.playerIds.filter((pid) => pid !== id)
    }
  }

  function addTeam(name: string) {
    const colorIndex = teams.value.length % TEAM_COLORS.length
    teams.value.push({
      id: uid(),
      name,
      color: TEAM_COLORS[colorIndex],
      playerIds: [],
      score: 0,
    })
  }

  function removeTeam(id: string) {
    teams.value = teams.value.filter((t) => t.id !== id)
  }

  function assignPlayerToTeam(playerId: string, teamId: string) {
    // Remove from any existing team
    for (const team of teams.value) {
      team.playerIds = team.playerIds.filter((id) => id !== playerId)
    }
    // Add to new team
    const team = teams.value.find((t) => t.id === teamId)
    if (team) {
      team.playerIds.push(playerId)
    }
  }

  function startGame() {
    if (players.value.length === 2) {
      mode.value = '1v1'
      // Create a team per player
      teams.value = players.value.map((p, i) => ({
        id: uid(),
        name: p.name,
        color: TEAM_COLORS[i % TEAM_COLORS.length],
        playerIds: [p.id],
        score: 0,
      }))
    } else {
      mode.value = 'teams'
      // Reset scores but keep team assignments
      for (const team of teams.value) {
        team.score = 0
      }
    }
    currentTeamIndex.value = 0
    usedCardIndices.value = new Set()
    currentTurn.value = null
    router.push('/game')
  }

  function pickCard(): WordCard | null {
    const cards = availableCards.value
    const unused = cards.filter((_, i) => {
      const globalIndex = words.indexOf(cards[i])
      return !usedCardIndices.value.has(globalIndex)
    })

    const pool = unused.length > 0 ? unused : cards // Reset if all used
    if (pool.length === 0) return null
    if (unused.length === 0) usedCardIndices.value = new Set()

    const card = pool[Math.floor(Math.random() * pool.length)]
    usedCardIndices.value.add(words.indexOf(card))
    return card
  }

  function startTurn() {
    const team = currentTeam.value
    if (!team) return

    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    const card = pickCard()
    if (!card) return

    // Pick active player: rotate within team
    const activePlayerId = team.playerIds[0] || players.value[0]?.id || ''

    currentTurn.value = {
      teamId: team.id,
      activePlayerId,
      action,
      card,
    }
    router.push('/turn')
  }

  function completeTurn(correct: boolean) {
    if (!currentTurn.value) return

    if (correct) {
      const team = teams.value.find((t) => t.id === currentTurn.value!.teamId)
      if (team) team.score++
    }

    currentTurn.value = null

    if (winner.value) {
      router.push('/winner')
      return
    }

    // Advance to next team
    currentTeamIndex.value = (currentTeamIndex.value + 1) % teams.value.length
    router.push('/game')
  }

  function skipCard() {
    if (!currentTurn.value) return
    const card = pickCard()
    if (card) {
      currentTurn.value.card = card
    }
  }

  function resetGame() {
    players.value = []
    teams.value = []
    currentTeamIndex.value = 0
    currentTurn.value = null
    usedCardIndices.value = new Set()
    settings.value = {
      difficulty: 'medium',
      targetScore: 15,
      timerDuration: 60,
      vibe: 'mixed',
      selectedCategories: [...CATEGORIES],
    }
    router.push('/')
  }

  function playAgain() {
    for (const team of teams.value) {
      team.score = 0
    }
    currentTeamIndex.value = 0
    currentTurn.value = null
    usedCardIndices.value = new Set()
    router.push('/game')
  }

  return {
    mode,
    players,
    teams,
    settings,
    currentTeamIndex,
    currentTurn,
    currentTeam,
    availableCards,
    winner,
    addPlayer,
    removePlayer,
    addTeam,
    removeTeam,
    assignPlayerToTeam,
    startGame,
    startTurn,
    completeTurn,
    skipCard,
    resetGame,
    playAgain,
  }
})
