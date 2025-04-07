<template>
    <div class="dispatch-dashboard">
      <el-row gutter={20}>
        
        <!-- Left Column: Dispatch Overview -->
        <el-col :span="16">
          
          <!-- 1) Real-Time Dispatch Header -->
          <el-card shadow="never" class="dashboard-header">
            <div class="header-content">
              <h2>Real-Time Dispatch Dashboard</h2>
              <div>
                <strong>Total Active Events:</strong> 
                <el-tag :type="activeEventsCount > 10 ? 'danger' : 'success'">
                  {{ activeEventsCount }}
                </el-tag>
              </div>
            </div>
          </el-card>
          
          <!-- 2) Event List -->
          <div class="event-list">
            <el-row gutter={20}>
              <el-col :span="8" v-for="eventItem in events" :key="eventItem.id">
                <el-card
                  shadow="always"
                  :style="getEventCardStyle(eventItem)"
                  class="event-card"
                >
                  <div class="card-header">
                    <strong>Event #{{ eventItem.id }}</strong>
                    <el-tag :type="getPriorityTagType(eventItem.priority)">
                      {{ eventItem.priority }}
                    </el-tag>
                  </div>
                  <el-divider></el-divider>
                  <p><strong>Assigned:</strong> {{ eventItem.assignedResponder }}</p>
                  <p>
                    <strong>Status:</strong>
                    <el-tag :type="getStatusTagType(eventItem.currentStatus)">
                      {{ eventItem.currentStatus }}
                    </el-tag>
                  </p>
                  <p><strong>ETC:</strong> {{ eventItem.estimatedCompletion }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
          
          <!-- 3) Charts / Resource Usage -->
          <el-card shadow="never" class="charts-card">
            <h3>Resource Usage Overview</h3>
            <div ref="chartContainer" class="chart-container"></div>
          </el-card>
          
        </el-col>
        
        <!-- Right Column: Responder Interface -->
        <el-col :span="8">
          
          <!-- 4) Responder Interface -->
          <el-card shadow="never" class="responder-interface">
            <h3>Responder Interface</h3>
            
            <!-- Filters -->
            <div class="filters">
              <el-select v-model="filterRole" placeholder="Filter by Role" class="filter-select">
                <el-option value="" label="All Roles"></el-option>
                <el-option value="MEDICAL" label="Medical"></el-option>
                <el-option value="FIRE" label="Fire"></el-option>
                <el-option value="POLICE" label="Police"></el-option>
              </el-select>
      
              <el-select v-model="filterStatus" placeholder="Filter by Status" class="filter-select">
                <el-option value="" label="All Statuses"></el-option>
                <el-option value="AVAILABLE" label="Available"></el-option>
                <el-option value="BUSY" label="Busy"></el-option>
                <el-option value="OFFLINE" label="Offline"></el-option>
              </el-select>
            </div>
            
            <!-- Responder List (filtered) -->
            <div class="responder-list">
              <el-card
                v-for="responder in filteredResponders"
                :key="responder.id"
                class="responder-card"
              >
                <strong>{{ responder.name }}</strong>
                <p>Role: {{ responder.role }}</p>
                <p>Status: 
                  <el-tag :type="getResponderStatusTagType(responder.status)">
                    {{ responder.status }}
                  </el-tag>
                </p>
              </el-card>
            </div>
            
            <el-divider></el-divider>
            
            <!-- Real-Time Chat -->
            <h4>Dispatcher-Responder Chat</h4>
            <div class="chat-box">
              <div v-for="(msg, idx) in messages" :key="idx" class="chat-message">
                <strong>{{ msg.sender }}:</strong> {{ msg.text }}
              </div>
            </div>
            <div class="chat-input">
              <el-input v-model="newMessage" placeholder="Type your message..." @keyup.enter="sendMessage"></el-input>
              <el-button type="primary" @click="sendMessage">Send</el-button>
            </div>
          </el-card>
          
        </el-col>
        
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  // ---------------------
  // 1) Events Data (Dummy)
  // ---------------------
  const events = ref([]);
  for (let i = 1; i <= 20; i++) {
    const randomPriority = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
    const randomStatus = ['PENDING', 'IN_PROGRESS', 'RESOLVED'][Math.floor(Math.random() * 3)];
    events.value.push({
      id: i,
      priority: randomPriority,
      assignedResponder: `Responder_${Math.ceil(Math.random() * 5)}`,
      currentStatus: randomStatus,
      estimatedCompletion: `2024-12-${10 + (i % 20)}`
    });
  }
  
  // ----------------------
  // 2) Responder Data
  // ----------------------
  const responders = ref([
    { id: 1, name: 'Alice', role: 'MEDICAL', status: 'AVAILABLE' },
    { id: 2, name: 'Bob', role: 'FIRE', status: 'BUSY' },
    { id: 3, name: 'Charlie', role: 'POLICE', status: 'AVAILABLE' },
    { id: 4, name: 'Diana', role: 'MEDICAL', status: 'OFFLINE' },
    { id: 5, name: 'Evan', role: 'FIRE', status: 'AVAILABLE' },
    // you can add more
  ]);
  
  // ----------------------
  // 3) Filters & Chat
  // ----------------------
  const filterRole = ref('');
  const filterStatus = ref('');
  const messages = ref([
    { sender: 'Dispatcher', text: 'Hello, can you confirm your status?' },
    { sender: 'Responder_3', text: 'Yes, I’m available now.' }
  ]);
  const newMessage = ref('');
  
  // -------------------------
  // 4) Computed Properties
  // -------------------------
  const activeEventsCount = computed(() => {
    return events.value.filter(e => e.currentStatus !== 'RESOLVED').length;
  });
  
  const filteredResponders = computed(() => {
    return responders.value.filter(r => {
      const roleMatch = !filterRole.value || r.role === filterRole.value;
      const statusMatch = !filterStatus.value || r.status === filterStatus.value;
      return roleMatch && statusMatch;
    });
  });
  
  // -------------------------
  // 5) Methods
  // -------------------------
  function getStatusColor(status) {
    switch (status) {
      case 'RESOLVED':
        return 'green';
      case 'IN_PROGRESS':
        return 'orange';
      case 'PENDING':
        return 'yellow';
      default:
        return '#ccc';
    }
  }
  
  function getPriorityTagType(priority) {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'info';
    }
  }
  
  function getStatusTagType(status) {
    switch (status) {
      case 'RESOLVED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'PENDING':
        return 'info';
      default:
        return 'default';
    }
  }
  
  function getResponderStatusTagType(status) {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'BUSY':
        return 'warning';
      case 'OFFLINE':
        return 'info';
      default:
        return 'default';
    }
  }
  
  function getEventCardStyle(eventItem) {
    return {
      borderLeft: `5px solid ${getStatusColor(eventItem.currentStatus)}`
    };
  }
  
  function getStatusStyle(status) {
    return {
      color: getStatusColor(status),
      fontWeight: 'bold'
    };
  }
  
  function sendMessage() {
    if (!newMessage.value.trim()) return;
    messages.value.push({ sender: 'Dispatcher', text: newMessage.value });
    newMessage.value = '';
  }
  
  function initChart() {
    const chartDom = document.querySelector('.chart-container');
    if (!chartDom) return;
    const myChart = echarts.init(chartDom);
  
    // In a real scenario, we might have dynamic data
    const option = {
      title: { text: 'Resource Usage', left: 'center' },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Usage',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 10, name: 'Medical' },
            { value: 15, name: 'Fire' },
            { value: 25, name: 'Police' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {c} ({d}%)'
          }
        }
      ]
    };
    myChart.setOption(option);
  }
  
  // -------------------------
  // 6) Lifecycle Hooks
  // -------------------------
  onMounted(() => {
    initChart();
  });
  </script>
  
  <style scoped>
  .dispatch-dashboard {
    padding: 20px;
  }
  
  .dashboard-header .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dashboard-header h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }
  
  .event-list {
    margin-top: 20px;
  }
  
  .event-card {
    /* Additional styling if needed */
  }
  
  .charts-card {
    margin-top: 20px;
    padding: 20px;
    background-color: #f5f7fa;
  }
  
  .chart-container {
    width: 100%;
    height: 300px;
  }
  
  .responder-interface {
    padding: 20px;
    background-color: #f5f7fa;
    border-radius: 8px;
  }
  
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .responder-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .responder-card {
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    background-color: #fff;
  }
  
  .chat-box {
    width: 100%;
    height: 150px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow-y: auto;
    padding: 10px;
    background-color: #fff;
  }
  
  .chat-message {
    margin-bottom: 8px;
  }
  
  .chat-input {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  
  .chat-input .el-input {
    flex: 1;
  }
  
  @media (max-width: 768px) {
    .dispatch-dashboard el-row {
      flex-direction: column;
    }
    
    .responder-interface {
      margin-top: 20px;
    }
  }
  </style>
  