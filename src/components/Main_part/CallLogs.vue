<template>
    <div class="call-logs">
      <div class="call-logs-header">
        <h3>Call Logs</h3>
        <button @click="refreshLogs">Refresh</button>
      </div>
      <ul class="call-log-list">
        <li v-for="log in callLogs" :key="log.id" class="call-log-item">
          <div class="log-details">
            <p><strong>Caller:</strong> {{ log.callerName || 'Unknown' }}</p>
            <p><strong>Time:</strong> {{ log.time }}</p>
            <p><strong>Status:</strong> {{ log.status }}</p>
          </div>
          <div class="log-actions">
            <button @click="viewDetails(log.id)">View</button>
            <button @click="answerCall(log.id)" :disabled="log.status !== 'Incoming'">Answer</button>
            <button @click="rejectCall(log.id)" :disabled="log.status !== 'Incoming'">Reject</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CallLogs',
    data() {
      return {
        callLogs: []
      };
    },
    methods: {
      refreshLogs() {
        // Fetch call logs from API or backend
        this.callLogs = [
          { id: 1, callerName: 'John Doe', time: '2025-01-08 14:35', status: 'Incoming' },
          { id: 2, callerName: 'Jane Smith', time: '2025-01-08 14:20', status: 'Answered' },
          { id: 3, callerName: 'Unknown', time: '2025-01-08 14:10', status: 'Missed' }
        ];
      },
      viewDetails(callId) {
        // Handle view details action
        alert(`Viewing details for call ID: ${callId}`);
      },
      answerCall(callId) {
        // Handle answering a call
        alert(`Answering call ID: ${callId}`);
        this.updateCallStatus(callId, 'Answered');
      },
      rejectCall(callId) {
        // Handle rejecting a call
        alert(`Rejecting call ID: ${callId}`);
        this.updateCallStatus(callId, 'Rejected');
      },
      updateCallStatus(callId, status) {
        // Update call status in the logs
        const log = this.callLogs.find(log => log.id === callId);
        if (log) {
          log.status = status;
        }
      }
    },
    mounted() {
      this.refreshLogs();
    }
  };
  </script>
  
  <style scoped>
  .call-logs {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    background-color: #f9f9f9;
    max-height: 400px;
    overflow-y: auto;
  }
  .call-logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .call-log-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .call-log-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .log-details {
    flex-grow: 1;
  }
  .log-actions button {
    margin-left: 5px;
  }
  </style>
  