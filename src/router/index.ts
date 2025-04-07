// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CallerDetails from '../components/CallerDetails.vue';
import MapArea from '../components/MapArea.vue';
import DispatchPanel from '../components/DispatchPanel.vue';
import LogPanel from '../components/LogPanel.vue';
import ConversationHistory from '../components/ConversationHistory.vue'; // 新增导入
import IncidentDetailsRecord from '../components/IncidentDetailsRecord.vue'; // 新增导入
import Main from '@/components/main.vue';
const routes = [
  {
    path: '/',
    redirect: '/main',  // 将根路径重定向到 /main
    component: {
      template: `
        <div>
          <h2>欢迎使用 Emergency Caller System</h2>
          <p>请选择一个模块</p>
        </div>
      `,
    },
  },
  
  {
    path: '/main',
    name: 'main',
    component: Main,
  },
  {
    path: '/caller-details',
    name: 'CallerDetails',
    component: CallerDetails,
  },
  {
    path: '/map-area',
    name: 'MapArea',
    component: MapArea,
  },
  {
    path: '/dispatch-panel',
    name: 'DispatchPanel',
    component: DispatchPanel,
  },
  {
    path: '/log-panel',
    name: 'LogPanel',
    component: LogPanel,
  },
  {
    path: '/conversation-history', // 新增路由
    name: 'ConversationHistory',
    component: ConversationHistory,
  },
  {
    path: '/incident-details-record', // 新增路由
    name: 'IncidentDetailsRecord',
    component: IncidentDetailsRecord,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
