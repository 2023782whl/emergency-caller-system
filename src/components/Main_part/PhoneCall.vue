<template>
  <div
    style="border: 1px solid #ccc; border-radius: 8px; padding: 16px; background: #fff; flex: 1; display: flex; flex-direction: column; position: relative;"
  >
    <h3 style="font-weight: bold; margin-bottom: 16px;">Call Management</h3>

    <!-- Smart Notification Alerts -->
    <el-alert
      v-if="showHighPriorityAlert"
      title="High Priority: Call is waiting too long!"
      type="error"
      show-icon
      closable
      style="margin-bottom: 16px;"
    ></el-alert>

    <!-- Multimedia Controls in Top-Right -->
    <div
      style="
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        gap: 10px;
      "
    >
      <el-button @click="toggleAudio">
        <i :class="isAudioMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
      </el-button>
      <el-button @click="toggleVideo">
        <i :class="isVideoEnabled ? 'fas fa-video' : 'fas fa-video-slash'"></i>
      </el-button>
      <el-button @click="captureScreenshot">
        <i class="fas fa-camera"></i>
      </el-button>
      <el-button @click="archiveMedia" :disabled="!selectedMedia">
        <i class="fas fa-archive"></i>
      </el-button>
      <el-button @click="openMultimediaModal">
        <i class="fas fa-photo-video"></i>
      </el-button>
    </div>

    <!-- Call Status and Information Display Area -->
    <div style="margin-bottom: 16px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="margin: 0; font-size: 14px;">
            Call Status:
            <span :style="{ color: getStatusColor }">{{ callStatus }}</span>
          </p>
          <p style="margin: 5px 0; font-size: 14px;">Duration: {{ duration }}</p>
        </div>
        <div>
          <el-tag :type="getStatusType">{{ callStatus }}</el-tag>
        </div>
      </div>
    </div>

    <!-- Call Control Buttons -->
    <div style="display: flex; gap: 10px; margin-bottom: 16px;">
      <el-button type="success" @click="answerCall" v-if="callStatus === 'Incoming Call'">
        <i class="fas fa-phone" style="margin-right: 5px;"></i> Answer Call
      </el-button>
      <el-button type="danger" @click="endCall" v-if="callStatus !== 'Call Ended'">
        <i class="fas fa-phone-slash" style="margin-right: 5px;"></i> End Call
      </el-button>
      <el-button type="primary" @click="toggleRecording">
        <i :class="isRecording ? 'fas fa-stop' : 'fas fa-microphone'" style="margin-right: 5px;"></i>
        {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
      </el-button>
      <el-button type="warning" @click="toggleSpeedDial">
        <i class="fas fa-dial-pad" style="margin-right: 5px;"></i> Speed Dial
      </el-button>
    </div>

    <!-- Phone Numbers Section -->
    <div
      v-if="showPhoneNumbers"
      style="position: absolute; bottom: 16px; right: 16px; background: #fff; padding: 10px; border-radius: 4px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);"
    >
      <h4 style="margin: 0; margin-bottom: 8px;">Phone Numbers</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li v-for="(target, index) in getSpeedDialTargets" :key="index" style="margin-bottom: 8px;">
          <el-tag type="info" style="margin-right: 8px;">{{ target.name }}</el-tag>
          <span>{{ target.number }}</span>
        </li>
      </ul>
    </div>

    <!-- Call Records Section -->
    <div style="display: flex; gap: 16px; flex: 1; overflow: hidden;">
      <!-- Call Records -->
      <div style="flex: 1; display: flex; flex-direction: column;">
        <h4 style="margin-bottom: 10px;">Call Records</h4>
        <div style="flex: 1; overflow-y: auto;">
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in callRecords"
              :key="index"
              :timestamp="record.time"
              :type="record.type"
            >
              {{ record.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Call Management
      callStatus: 'Incoming Call',
      duration: '00:00',
      isRecording: false,
      isAudioMuted: false,
      isVideoEnabled: false,
      callRecords: [
        {
          time: '2024-03-21 14:30',
          content: 'Call Connected',
          type: 'primary',
        },
      ],
      // High Priority Alert
      showHighPriorityAlert: false,
      highPriorityThreshold: 30, // seconds
      callWaitTime: 0,
      callTimer: null,
      // Speed Dial Options
      selectedIncidentType: 1, // Default to Fire Department
      speedDialOptions: {
        1: [{ name: 'Fire Department', number: '911' }],
        2: [{ name: 'Ambulance', number: '912' }],
        3: [{ name: 'Police', number: '913' }],
      },
      showPhoneNumbers: false,
    };
  },
  computed: {
    getStatusColor() {
      const colors = {
        'Incoming Call': '#E6A23C',
        'In Call': '#67C23A',
        'Call Ended': '#F56C6C',
      };
      return colors[this.callStatus] || '#909399';
    },
    getStatusType() {
      const types = {
        'Incoming Call': 'warning',
        'In Call': 'success',
        'Call Ended': 'danger',
      };
      return types[this.callStatus] || 'info';
    },
    getSpeedDialTargets() {
      return this.speedDialOptions[this.selectedIncidentType] || [];
    },
  },
  methods: {
    toggleSpeedDial() {
      this.showPhoneNumbers = !this.showPhoneNumbers;
    },
    answerCall() {
      this.callStatus = 'In Call';
      this.addCallRecord('Call Started');
    },
    endCall() {
      this.callStatus = 'Call Ended';
      this.addCallRecord('Call Ended');
    },
    toggleRecording() {
      this.isRecording = !this.isRecording;
      this.addCallRecord(this.isRecording ? 'Recording Started' : 'Recording Stopped');
    },
    toggleAudio() {
      this.isAudioMuted = !this.isAudioMuted;
      this.addCallRecord(this.isAudioMuted ? 'Muted' : 'Unmuted');
    },
    toggleVideo() {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.addCallRecord(this.isVideoEnabled ? 'Video Enabled' : 'Video Disabled');
    },
    captureScreenshot() {
      this.addCallRecord('Screenshot Captured');
    },
    addCallRecord(content) {
      const now = new Date();
      const time = now.toLocaleString();
      this.callRecords.unshift({ time, content, type: 'primary' });
    },
  },
};
</script>

<style scoped>
.el-timeline {
  max-height: 100px;
  overflow-y: auto;
}
</style>
