<template>
  <div style="height: 100vh; background-color: #f7f8fa;">
    <!-- Content Section -->
    <div style="display: flex; flex: 1; overflow: hidden;">
      <!-- Dynamic Sidebar with Transition -->
      <transition name="sidebar-slide">
        <aside
          v-if="$parent.isSidebarOpen"
          style="
            width: 250px;
            background-color: #f7f7f7;
            padding: 10px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            transition: transform 0.3s ease-in-out;
          "
        >
          <!-- 已经移除主页、对话历史、事件详情的 router-link -->
          <ul style="list-style: none; padding: 0; margin: 0;">
            <!-- 可以在此添加或保留其他导航项，如需的话 -->
          </ul>
        </aside>
      </transition>

      <!-- Main Content -->
      <div style="display: flex; flex: 1; flex-direction: column; overflow: hidden;">
        <!-- Left Section -->
        <div style="display: flex; flex: 1;">
          <aside
            style="
              width: 300px;
              background-color: #f1f1f1;
              padding: 10px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 20px;
            "
          >
            <CallerDetails @update-emergency-type="updateEmergencyType" />
            <!-- <LogPanel class="log-panel" /> -->
          </aside>

          <!-- Center Section -->
          <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
            <!-- MapArea Section -->
            <div style="flex: 2; padding: 5px;"> <!-- 减少间隔的 padding -->
              <MapArea ref="mapArea" />
            </div>
            <!-- PhoneCall Section -->
            <div style="flex: 1; padding: 5px;"> <!-- 减少间隔的 padding -->
              <PhoneCall />
            </div>
          </div>

          <!-- Right Section -->
          <aside
            style="
              width: 350px;
              background-color: #f7f7f7;
              padding: 10px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 20px;
            "
          >
            <DispatchPanel :emergencyType="currentEmergencyType" />
            <IncidentDetails />
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CallerDetails from "../components/Main_part/CallerDetails.vue";
import MapArea from "../components/Main_part/MapArea.vue";
import IncidentDetails from "../components/Main_part/IncidentDetails.vue";
import DispatchPanel from "../components/Main_part/DispatchPanel.vue";
import LogPanel from "../components/Main_part/LogPanel.vue";
import PhoneCall from "../components/Main_part/PhoneCall.vue";

export default {
  name: "Main",
  components: {
    CallerDetails,
    MapArea,
    IncidentDetails,
    DispatchPanel,
    LogPanel,
    PhoneCall
  },
  data() {
    return {
      currentEmergencyType: ""
    };
  },
  methods: {
    updateEmergencyType(type) {
      this.currentEmergencyType = type;
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* 保持与 App 里一致的过渡动画名称 */
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

</style>
