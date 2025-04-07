<template>
  <div id="app" style="height: 100vh; display: flex; flex-direction: column; margin: 0;">
    <!-- Header Section -->
    <div
      style="
        background-color: #2c3e50;
        color: white;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="display: flex; align-items: center; gap: 10px;">
        <!-- Sidebar Toggle Button (Hamburger Icon) -->
        <button
          @click="toggleSidebar"
          style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
          "
        >
          <!-- 当侧边栏打开时，显示向左箭头；否则显示汉堡图标 -->
          <i :class="[isSidebarOpen ? 'fas fa-chevron-left' : 'fas fa-bars']"></i>
        </button>
        <h1 style="margin: 0;">Emergency Caller System</h1>
      </div>

      <!-- 顶部右侧：包含多语言下拉 + 按钮 + 倒计时 + 时间显示 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <!-- 使�� Element Plus 的 el-select 替代原生 select -->
        <el-select
          v-model="selectedLanguage"
          style="width: 120px;"
          @change="changeLanguage"
        >
          <el-option
            v-for="lang in languageOptions"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          ></el-option>
        </el-select>

        <!-- 仅当当前路由是 /main 时，才显示该按钮 -->
        <button
          v-if="isMainRoute"
          @click="manualRefresh"
          style="
            padding: 5px 10px;
            background-color: #ff4747;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          Refresh map components
        </button>

        <span style="color: white;">Next refresh in: {{ countdown }}s</span>
        <div style="display: flex; align-items: center; gap: 10px; color: white;">
          <span>{{ currentTime }}</span>
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 主体部分：左侧侧边栏 + 中心内容 -->
    <div
      style="
        display: flex;
        flex: 1;
        overflow: hidden;
      "
    >
      <!-- 左侧侧边栏：可通过宽度进���切换，或使用v-if判断完全隐藏 -->
      <transition name="sidebar-slide">
        <aside
          v-if="isSidebarOpen"
          style="
            width: 250px;
            background-color: #f7f7f7;
            padding: 10px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
            transition: width 0.3s ease;
          "
        >
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;">
              <!-- Main -->
              <router-link
                to="/main"
                exact-active-class="active-link"
                style="display: flex; align-items: center; gap: 8px; color: #333; text-decoration: none;"
              >
                <i class="fas fa-map"></i>
                Main
              </router-link>
            </li>
            <li style="margin-bottom: 10px;">
              <!-- Dialogue History -->
              <router-link
                to="/conversation-history"
                exact-active-class="active-link"
                style="display: flex; align-items: center; gap: 8px; color: #333; text-decoration: none;"
              >
                <i class="fas fa-comments"></i>
                Dialogue History
              </router-link>
            </li>
            <li style="margin-bottom: 10px;">
              <!-- Event Details -->
              <router-link
                to="/incident-details-record"
                exact-active-class="active-link"
                style="display: flex; align-items: center; gap: 8px; color: #333; text-decoration: none;"
              >
                <i class="fas fa-list-alt"></i>
                Event Details
              </router-link>
            </li>
            <li style="margin-bottom: 10px;">
           <!-- Dispatch Dashboard -->
           <router-link
             to="/Dispatch-Dashboard"
             exact-active-class="active-link"
             style="display: flex; align-items: center; gap: 8px; color: #333; text-decoration: none;"
           >
             <i class="fas fa-tachometer-alt"></i>
             Dispatch Dashboard
           </router-link> 
            </li>
            <!-- <li style="margin-bottom: 10px;">
              <router-link
       to="/Gantt-Charts"
       exact-active-class="active-link"
       style="display: flex; align-items: center; gap: 8px; color: #333; text-decoration: none;"
     >
       <i class="fas fa-tachometer-alt"></i>
       Gantt Charts
     </router-link>

            </li> -->
          </ul>
        </aside>
      </transition>

      <!-- 中心内容区域：自适应剩余空间 -->
      <div style="flex: 1; overflow: auto; padding: 10px;">
        <!-- 路由容器：在这里根据当前路由渲染不同组件 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// 注意：记得在 main.js 或入口文件中引入 Element Plus
// 例如：import ElementPlus from 'element-plus'; import 'element-plus/dist/index.css'; ...
// 并 app.use(ElementPlus)

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "App",
  data() {
    return {
      isSidebarOpen: true,
      countdown: 30, // 倒计时初始值
      timer: null,   // 用于清除定时器
      currentTime: "",
      currentDate: "",
      // 多语言下拉菜单（默认 'en' 英语）
      selectedLanguage: "en",
      // Element Plus 下拉可选项
      languageOptions: [
        { label: "English", value: "en" },
        { label: "Malay", value: "ms" },
        { label: "Chinese", value: "zh" }
      ]
    };
  },
  computed: {
    // 当前路由是否为 "/main"
    isMainRoute() {
      return this.$route.path === "/main";
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // 每秒更新时间
    this.startCountdown();             // 启动倒计时
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown <= 0) {
          this.refreshMap();
          this.countdown = 30;
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    updateTime() {
      const malaysiaTime = dayjs().tz("Asia/Kuala_Lumpur");
      this.currentTime = malaysiaTime.format("hh:mm:ss A");
      this.currentDate = malaysiaTime.format("DD/MM/YYYY");
    },
    refreshMap() {
      console.log("Refreshing MapArea...");
      // 你可以在此调用子组件的刷新逻辑（如有需要）
    },
    manualRefresh() {
      this.refreshMap();
      this.countdown = 30;
    },
    // 当用户切换语言时触发
    changeLanguage() {
      console.log("Language changed to:", this.selectedLanguage);
      // 在此可结合 vue-i18n 或其他国际化插件来真正切换语言
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

h1 {
  font-size: 20px;
  font-weight: bold;
}

/* 侧边栏动画过渡类 */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-slide-enter {
  transform: translateX(-100%);
}
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}

/* 高亮选中时的样式 */
.active-link {
  font-weight: bold;
  color: #007bff;
  text-decoration: underline;
}
</style>
