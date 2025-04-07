<template>
  <div>
    <!-- Existing Caller Info Form -->
    <el-form label-position="top" label-width="200px" class="caller-info-form">
      <!-- Name Field -->
      <el-form-item label="Name">
        <div class="field-container">
          <el-input v-model="callerInfo.name" placeholder="Please enter your name" />
          <span class="data-source" :class="getDataSourceClass('name')">
            <i :class="getDataSourceIcon('name')"></i>
            {{ callerInfo.dataSource.name }}
          </span>
        </div>
      </el-form-item>

      <!-- Contact Number Field -->
      <el-form-item label="Contact Number">
        <div class="field-container">
          <el-input v-model="callerInfo.contactNumber" placeholder="Please enter your contact number" />
          <span class="data-source" :class="getDataSourceClass('contactNumber')">
            <i :class="getDataSourceIcon('contactNumber')"></i>
            {{ callerInfo.dataSource.contactNumber }}
          </span>
        </div>
      </el-form-item>

      <!-- Address Field with Validation Status and Correct Address Button -->
      <el-form-item label="Address">
        <div class="field-container">
          <el-input
            v-model="callerInfo.address"
            placeholder="Please enter your address"
            @blur="validateAddress"
          />
          <span class="data-source" :class="getDataSourceClass('address')">
            <i :class="getDataSourceIcon('address')"></i>
            {{ callerInfo.dataSource.address }}
          </span>
          <el-tag :type="addressCheckStatusTag.type" v-if="callerInfo.addressCheckStatus">
            <i :class="addressCheckStatusTag.icon"></i>
            {{ callerInfo.addressCheckStatus }}
          </el-tag>
          <el-button
            type="text"
            class="correct-address-btn"
            @click="correctAddress"
            v-if="callerInfo.addressCheckStatus === 'Invalid'"
          >
            Correct Address
          </el-button>
        </div>
      </el-form-item>

      <!-- Call History Summary Button -->
      <el-form-item label="Call History">
        <el-button type="primary" class="history-button" @click="showCallHistory">
          <i class="fas fa-history"></i> View Call History
        </el-button>
      </el-form-item>

      <!-- Emergency Type Field -->
      <el-form-item label="Emergency Type">
        <el-select
          v-model="callerInfo.emergencyType"
          placeholder="Please select type"
          @change="updateEmergencyType"
          class="emergency-select"
        >
          <el-option
            v-for="type in emergencyTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
            <template #default>
              <div class="emergency-option">
                <div class="type-dot" :class="`type-${type.value}`"></div>
                <span class="type-label">{{ type.label }}</span>
                <i :class="type.icon" class="type-icon"></i>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- Preferred Language Field -->
      <el-form-item label="Preferred Language">
        <el-select v-model="callerInfo.language" placeholder="Select preferred language">
          <el-option label="Malay" value="malay"></el-option>
          <el-option label="English" value="english"></el-option>
          <el-option label="Chinese" value="chinese"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- Call History Modal -->
    <el-dialog
      title="Call History Summary"
      v-model="callHistoryVisible"
      width="70%"
      class="call-history-dialog"
      :before-close="handleClose"
    >
      <div class="modal-content">
        <!-- Caller Information Details -->
        <div class="caller-details">
          <h3>Caller Information</h3>
          <p><strong>Name:</strong> {{ callerInfo.name }}</p>
          <p><strong>Contact Number:</strong> {{ callerInfo.contactNumber }}</p>
          <p><strong>Address:</strong> {{ callerInfo.address }}</p>
          <p><strong>Preferred Language:</strong> {{ callerInfo.language }}</p>
        </div>

        <!-- Emergency Type and Dispatch Status -->
        <div class="emergency-details">
          <h3>Emergency Details</h3>
          <p><strong>Type:</strong> {{ getEmergencyTypeLabel(callerInfo.emergencyType) }}</p>
          <p><strong>Dispatch Status:</strong> {{ dispatchStatus }}</p>
        </div>

        <!-- BEGIN: New Dispatch Info Panel -->
        <div class="dispatch-info" style="margin-bottom: 20px;">
          <h3>Dispatch Information</h3>
          <el-form inline>
            <el-form-item label="Team">
              <el-input
                v-model="dispatchInfo.team"
                placeholder="e.g. Fire Dept, Medical Rescue"
                size="small"
              />
            </el-form-item>
            <el-form-item label="ETA">
              <el-input
                v-model="dispatchInfo.eta"
                placeholder="e.g. 15 mins"
                size="small"
              />
            </el-form-item>
            <el-form-item label="Location">
              <el-input
                v-model="dispatchInfo.currentLocation"
                placeholder="Real-time location tracking"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="updateDispatchInfo">
                Update Dispatch
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- END: New Dispatch Info Panel -->

        <!-- Call Logs Section -->
        <div class="call-logs-section">
          <div class="call-logs-header">
            <h3>Call Logs</h3>
            <el-button type="primary" @click="refreshLogs" size="small">
              <i class="fas fa-sync-alt"></i> Refresh
            </el-button>
          </div>
          <el-table :data="callLogs" style="width: 100%" stripe>
            <el-table-column prop="callerName" label="Caller" width="150"></el-table-column>
            <el-table-column prop="time" label="Time" width="180"></el-table-column>
            <el-table-column prop="status" label="Status" width="120"></el-table-column>

            <!-- BEGIN: New ACS Call Status Column -->
            <el-table-column prop="acsStatus" label="ACS Call Status" width="150">
            </el-table-column>
            <!-- END: New ACS Call Status Column -->

            <!-- Existing Actions Column -->
            <el-table-column label="Actions" width="350">
              <template #default="scope">
                <el-button type="text" size="small" @click="viewDetails(scope.row.id)">
                  <i class="fas fa-eye"></i> View
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  @click="answerCall(scope.row.id)"
                  :disabled="scope.row.status !== 'Incoming'"
                >
                  <i class="fas fa-phone"></i> Answer
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="rejectCall(scope.row.id)"
                  :disabled="scope.row.status !== 'Incoming'"
                >
                  <i class="fas fa-times"></i> Reject
                </el-button>

                <!-- BEGIN: New Forward to Operator Button -->
                <el-button
                  type="warning"
                  size="small"
                  @click="forwardCall(scope.row.id)"
                  :disabled="scope.row.status !== 'Incoming'"
                >
                  <i class="fas fa-share"></i> Forward
                </el-button>
                <!-- END: New Forward to Operator Button -->

              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="closeCallHistory">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CallerDetails',
  data() {
    return {
      callerInfo: {
        name: '',
        contactNumber: '',
        address: '',
        emergencyType: '',
        language: '',
        dataSource: {
          name: 'User Input',
          contactNumber: 'Verified via GIS',
          address: 'GPS',
        },
        addressCheckStatus: '', // 'Valid' or 'Invalid'
      },
      emergencyTypes: [
        { label: 'Fire', value: 'fire', icon: 'fas fa-fire' },
        { label: 'Medical', value: 'medical', icon: 'fas fa-ambulance' },
        { label: 'Police', value: 'police', icon: 'fas fa-shield-alt' },
        { label: 'Natural Disaster', value: 'natural_disaster', icon: 'fas fa-cloud-showers-heavy' },
        { label: 'Other', value: 'other', icon: 'fas fa-exclamation-circle' },
      ],
      callHistoryVisible: false,
      callHistory: [
        // Example data
        { date: '2024-11-20', type: 'Medical', description: 'Heart attack' },
      ],
      dispatchStatus: 'Waiting', // 'Dispatched' or 'Waiting'
      callLogs: [],

      // BEGIN: New Dispatch Info Data
      dispatchInfo: {
        team: '',
        eta: '',
        currentLocation: '',
      },
      // END: New Dispatch Info Data
    };
  },
  methods: {
    updateEmergencyType() {
      this.$emit('update-emergency-type', this.callerInfo.emergencyType);
    },
    validateAddress() {
      // Mock address validation
      const isValid = this.callerInfo.address.length > 5; // simplified example
      this.callerInfo.addressCheckStatus = isValid ? 'Valid' : 'Invalid';
      this.callerInfo.dataSource.address = isValid ? 'Verified via GIS' : 'User Input';
    },
    correctAddress() {
      // Mock address correction
      this.callerInfo.address = 'Corrected Address Example';
      this.callerInfo.addressCheckStatus = 'Valid';
      this.callerInfo.dataSource.address = 'Verified via GIS';
    },
    showCallHistory() {
      this.refreshLogs();
      this.callHistoryVisible = true;
    },
    closeCallHistory() {
      this.callHistoryVisible = false;
    },
    handleClose(done) {
      done();
    },
    getDataSourceClass(field) {
      // return style class based on data source
      switch (this.callerInfo.dataSource[field]) {
        case 'GPS':
          return 'source-gps';
        case 'User Input':
          return 'source-user';
        case 'Verified via GIS':
          return 'source-gis';
        default:
          return 'source-unknown';
      }
    },
    getDataSourceIcon(field) {
      // return corresponding icon
      switch (this.callerInfo.dataSource[field]) {
        case 'GPS':
          return 'fas fa-satellite';
        case 'User Input':
          return 'fas fa-user-edit';
        case 'Verified via GIS':
          return 'fas fa-map-marked-alt';
        default:
          return 'fas fa-question-circle';
      }
    },
    getEmergencyTypeLabel(value) {
      const type = this.emergencyTypes.find(type => type.value === value);
      return type ? type.label : 'Unknown';
    },
    refreshLogs() {
      // Example static data; in real app, fetch from backend
      this.callLogs = [
        { id: 1, callerName: 'John Doe', time: '2025-01-08 14:35', status: 'Incoming', acsStatus: 'Ringing' },
        { id: 2, callerName: 'Jane Smith', time: '2025-01-08 14:20', status: 'Answered', acsStatus: 'Connected' },
        { id: 3, callerName: 'Unknown', time: '2025-01-08 14:10', status: 'Missed', acsStatus: 'No Answer' },
      ];
    },
    viewDetails(callId) {
      this.$message.info(`Viewing details for call ID: ${callId}`);
    },
    answerCall(callId) {
      this.$message.success(`Answering call ID: ${callId}`);
      this.updateCallStatus(callId, 'Answered');
    },
    rejectCall(callId) {
      this.$message.warning(`Rejecting call ID: ${callId}`);
      this.updateCallStatus(callId, 'Rejected');
    },
    // BEGIN: New Forward Call Method
    forwardCall(callId) {
      this.$message.info(`Forwarding call ID: ${callId} to operator`);
      this.updateCallStatus(callId, 'Forwarded');
    },
    // END: New Forward Call Method
    updateCallStatus(callId, status) {
      const log = this.callLogs.find(log => log.id === callId);
      if (log) {
        log.status = status;
      }
    },
    // BEGIN: New Dispatch Info Method
    updateDispatchInfo() {
      this.$message.success('Dispatch info updated');
      // In a real app, you would submit this.dispatchInfo to an API
      this.dispatchStatus = 'Dispatched';
    },
    // END: New Dispatch Info Method
  },
  computed: {
    addressCheckStatusTag() {
      if (this.callerInfo.addressCheckStatus === 'Valid') {
        return { type: 'success', icon: 'fas fa-check-circle' };
      } else if (this.callerInfo.addressCheckStatus === 'Invalid') {
        return { type: 'danger', icon: 'fas fa-times-circle' };
      }
      return { type: 'info', icon: 'fas fa-info-circle' };
    },
  },
  mounted() {
    // Optionally load logs on mount
    // this.refreshLogs();
  },
};
</script>

<style scoped>
/* All original styles preserved */
.caller-info-form {
  max-width: 600px;
  height: 755px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.field-container {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.data-source {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.data-source i {
  margin-right: 4px;
}

.source-gps {
  color: #409eff;
}

.source-user {
  color: #67c23a;
}

.source-gis {
  color: #e6a23c;
}

.source-unknown {
  color: #909399;
}

.emergency-select {
  width: 100%;
}

.emergency-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.type-label {
  flex: 1;
  font-size: 14px;
  color: #606266;
}

.type-icon {
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.emergency-option:hover .type-dot {
  transform: scale(1.4);
}

.emergency-option:hover .type-icon {
  opacity: 1;
  transform: scale(1.2);
}

/* Same color-coded classes */
.type-fire {
  background: #f56c6c;
  box-shadow: 0 0 6px rgba(245, 108, 108, 0.4);
}
.type-medical {
  background: #409eff;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.4);
}
.type-police {
  background: #67c23a;
  box-shadow: 0 0 6px rgba(103, 194, 58, 0.4);
}
.type-natural_disaster {
  background: #e6a23c;
  box-shadow: 0 0 6px rgba(230, 162, 60, 0.4);
}
.type-other {
  background: #909399;
  box-shadow: 0 0 6px rgba(144, 147, 153, 0.4);
}

/* Keeping the selection styles */
:deep(.el-select__tags) {
  background-color: transparent !important;
}
:deep(.el-select-dropdown__item.selected) {
  font-weight: bold;
  background-color: #f0f9eb !important;
}
:deep(.el-select__tags .el-tag) {
  background-color: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
:deep(.el-select__tags .el-tag .el-tag__close) {
  display: none;
}
:deep(.el-tag.type-fire::before),
:deep(.el-tag.type-medical::before),
:deep(.el-tag.type-police::before),
:deep(.el-tag.type-natural_disaster::before),
:deep(.el-tag.type-other::before) {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
:deep(.el-tag.type-fire::before) {
  background: #f56c6c;
}
:deep(.el-tag.type-medical::before) {
  background: #409eff;
}
:deep(.el-tag.type-police::before) {
  background: #67c23a;
}
:deep(.el-tag.type-natural_disaster::before) {
  background: #e6a23c;
}
:deep(.el-tag.type-other::before) {
  background: #909399;
}

/* Address Check Tag */
.el-tag {
  margin-left: 10px;
  border-radius: 4px;
}
.el-button.correct-address-btn {
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
}
.el-button.history-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Dialog */
.call-history-dialog .el-dialog__header {
  background-color: #f5f7fa;
  border-bottom: none;
  font-size: 18px;
  font-weight: bold;
}
.call-history-dialog .el-dialog__body {
  padding: 20px;
}
.call-history-dialog .el-dialog__footer {
  text-align: right;
}
.call-history-dialog .el-table {
  border-radius: 8px;
  overflow: hidden;
}
.modal-content {
  max-height: 60vh;
  overflow-y: auto;
}
.caller-details,
.emergency-details {
  margin-bottom: 20px;
}
.caller-details h3,
.emergency-details h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.caller-details p,
.emergency-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

/* Call Logs */
.call-logs-section {
  margin-top: 20px;
}
.call-logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.call-logs-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.el-table .el-button {
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .caller-info-form {
    padding: 10px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .field-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .data-source {
    margin-top: 5px;
  }
  .call-history-dialog {
    width: 90% !important;
  }
}
</style>
