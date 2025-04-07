import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
// import { Vue3GoogleMaps } from '@fawmi/vue-google-maps';
import router from './router';
import './assets/all.css';

const app = createApp(App);

// 配置 Pinia
app.use(createPinia());

// 配置 Element Plus
app.use(ElementPlus);

// 配置 Google Maps
// app.use(Vue3GoogleMaps, {
//   load: {
//     key: 'YOUR_GOOGLE_MAPS_API_KEY',
//     libraries: 'places',
//   },
// });

// 挂载路由
app.use(router);

// 挂载应用
app.mount('#app');
