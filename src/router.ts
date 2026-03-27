import { createRouter, createWebHashHistory } from 'vue-router'
import WelcomeView from './views/WelcomeView.vue'
import SetupView from './views/SetupView.vue'
import GameBoardView from './views/GameBoardView.vue'
import TurnView from './views/TurnView.vue'
import WinnerView from './views/WinnerView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: WelcomeView },
    { path: '/setup', component: SetupView },
    { path: '/game', component: GameBoardView },
    { path: '/turn', component: TurnView },
    { path: '/winner', component: WinnerView },
  ],
})
