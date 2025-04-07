import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import ConversationHistory from '../components/ConversationHistory.vue'
import IncidentDetailsRecord from '../components/IncidentDetailsRecord.vue'
import DispatchDashboard from '../components/DispatchDashboard.vue'
import GanttCharts from '../components/gantt_charts.vue';
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/conversation-history',
    name: 'ConversationHistory',
    component: ConversationHistory
  },
  {
    path: '/incident-details-record',
    name: 'IncidentDetailsRecord',
    component: IncidentDetailsRecord
  },
  {
    path: '/Dispatch-Dashboard',
    name: 'DispatchDashboard',
    component: DispatchDashboard
  },
  {
    path: '/Gantt-Charts',
    name: 'GanttCharts',
    component: GanttCharts,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 