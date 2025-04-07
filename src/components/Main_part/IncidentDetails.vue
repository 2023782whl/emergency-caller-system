<template>
  <el-form label-position="top" label-width="120px">
    <!-- Priority Score -->
    <el-form-item label="Priority Score">
      <el-input
        v-model="priorityScore"
        placeholder="Priority score"
        readonly
      />
    </el-form-item>

    <!-- Risk Level -->
    <el-form-item label="Risk Level">
      <el-tag :type="riskLevelTag.type" disable-transitions>
        {{ riskLevelTag.text }}
      </el-tag>
    </el-form-item>

    <!-- Real-time Location Updates -->
    <el-form-item label="Location Update">
      <el-button
        type="primary"
        icon="el-icon-location"
        @click="toggleRealTimeTracking"
        :loading="isTracking"
        class="location-update-button"
      >
        {{ isTracking ? 'Stop Update' : 'Real-time Location Update' }}
      </el-button>
    </el-form-item>

    <!-- Sync Status Indicator -->
    <el-form-item label="Sync Status">
      <el-tag :type="syncStatusTag.type" disable-transitions>
        {{ syncStatusTag.text }}
      </el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "EmergencyEventInfo",
  data() {
    return {
      priorityScore: 0, // System-calculated priority score
      isTracking: false, // Real-time tracking status
      syncStatus: "pending", // Sync status: 'synced', 'pending', 'failed'
      trackingInterval: null, // Tracking timer
      // Assume these data come from other parts; adjust as needed
      eventType: "fire", // Event type
      severity: "high", // Severity
      location: {
        latitude: null,
        longitude: null,
      }, // Event location
      resourceAvailability: "good", // Resource availability
      riskLevel: "low", // Risk level
    };
  },
  computed: {
    syncStatusTag() {
      switch (this.syncStatus) {
        case "synced":
          return { type: "success", text: "Synced" };
        case "pending":
          return { type: "warning", text: "Syncing" };
        case "failed":
          return { type: "danger", text: "Sync Failed" };
        default:
          return { type: "info", text: "Unknown Status" };
      }
    },
    riskLevelTag() {
      switch (this.riskLevel) {
        case "high":
          return { type: "danger", text: "High Risk" };
        case "medium":
          return { type: "warning", text: "Medium Risk" };
        case "low":
          return { type: "success", text: "Low Risk" };
        default:
          return { type: "info", text: "Unknown Risk" };
      }
    },
  },
  watch: {
    // Watch relevant fields to calculate priority score
    eventType: "calculatePriorityScore",
    severity: "calculatePriorityScore",
    location: {
      handler() {
        if (this.isTracking) {
          this.syncWithEIDD();
        }
      },
      deep: true,
    },
    resourceAvailability: "calculatePriorityScore",
  },
  methods: {
    // Method to calculate priority score
    calculatePriorityScore() {
      // Example calculation logic; adjust as needed
      let score = 0;
      const severityScores = {
        low: 1,
        medium: 2,
        high: 3,
      };
      const resourceScores = {
        poor: 1,
        fair: 2,
        good: 3,
      };

      score += severityScores[this.severity] || 0;
      score += resourceScores[this.resourceAvailability] || 0;

      // Event type also affects priority
      const eventTypeScores = {
        fire: 3,
        medical: 2,
        police: 1,
      };
      score += eventTypeScores[this.eventType] || 0;

      this.priorityScore = score;

      // Calculate risk level based on priority score
      if (score >= 6) {
        this.riskLevel = "high";
      } else if (score >= 4) {
        this.riskLevel = "medium";
      } else {
        this.riskLevel = "low";
      }

      // Sync priority score and risk level to EIDD
      this.syncWithEIDD();
    },
    // Method to toggle real-time tracking status
    toggleRealTimeTracking() {
      this.isTracking = !this.isTracking;
      if (this.isTracking) {
        this.startTracking();
      } else {
        this.stopTracking();
      }
    },
    // Method to start real-time tracking
    startTracking() {
      this.$message({
        message: "Started real-time location tracking",
        type: "success",
      });
      // Simulate location update every 5 seconds; integrate real location service as needed
      this.trackingInterval = setInterval(() => {
        this.updateLocation();
      }, 5000);
    },
    // Method to stop real-time tracking
    stopTracking() {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      this.$message({
        message: "Stopped real-time tracking",
        type: "info",
      });
    },
    // Method to update location; should call location service API in reality
    updateLocation() {
      // Simulate getting current location
      const simulatedLocation = {
        latitude: (Math.random() * 180 - 90).toFixed(6),
        longitude: (Math.random() * 360 - 180).toFixed(6),
      };
      this.location = simulatedLocation;
      this.syncWithEIDD();
    },
    // Method to sync data with EIDD
    syncWithEIDD() {
      this.syncStatus = "pending";
      // Simulate sync request
      setTimeout(() => {
        // Assume sync is always successful; adjust based on API response
        this.syncStatus = "synced";
        this.$message({
          message: "Event data synced to EIDD",
          type: "success",
        });
      }, 1000);
    },
  },
  mounted() {
    // Initialize priority score calculation
    this.calculatePriorityScore();
  },
  beforeDestroy() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
  },
};
</script>

<style scoped>
.location-update-button {
  width: 185px;
}

/* Preserve original priority styles for future extension */
.priority-select {
  width: 100%;
}

.priority-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.priority-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.priority-label {
  font-size: 13px;
  color: #606266;
}

.priority-option:hover .priority-dot {
  transform: scale(1.3);
}

.priority-high {
  background: #f56c6c;
  box-shadow: 0 0 4px rgba(245, 108, 108, 0.4);
}

.priority-medium {
  background: #e6a23c;
  box-shadow: 0 0 4px rgba(230, 162, 60, 0.4);
}

.priority-low {
  background: #67c23a;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.4);
}

/* Selected styles */
::v-deep(.el-select__tags) {
  background-color: transparent !important;
}

::v-deep(.el-select-dropdown__item.selected) {
  font-weight: normal;
}

::v-deep(.el-select__tags .el-tag) {
  background-color: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

::v-deep(.el-select__tags .el-tag .el-tag__close) {
  display: none;
}

/* Selected item small dot style */
::v-deep(.el-select__tags .el-tag::before) {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

::v-deep(.el-select__tags .el-tag.priority-high::before) {
  background: #f56c6c;
  box-shadow: 0 0 4px rgba(245, 108, 108, 0.4);
}

::v-deep(.el-select__tags .el-tag.priority-medium::before) {
  background: #e6a23c;
  box-shadow: 0 0 4px rgba(230, 162, 60, 0.4);
}

::v-deep(.el-select__tags .el-tag.priority-low::before) {
  background: #67c23a;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.4);
}

/* Risk Level Styles */
.el-tag--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

.el-tag--warning {
  background-color: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}

.el-tag--success {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
</style>
