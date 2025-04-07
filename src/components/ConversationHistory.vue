<template>
  <div>
    <h3>Conversation History</h3>
    <div class="conversation-container">
      <!-- Left: Table Section -->
      <div class="table-section">
        <el-table :data="pagedData" style="width: 100%" border size="small">
          <el-table-column prop="callId" label="Call ID" width="120" />
          <el-table-column prop="callerName" label="Caller Name" width="150" />
          <el-table-column prop="phoneNumber" label="Phone Number" width="150" />
          <el-table-column prop="startTime" label="Start Time" width="180" />
          <el-table-column prop="duration" label="Duration" width="120" />
          <el-table-column prop="status" label="Status" width="120">
            <template #default="{ row }">
              <span :class="['status-tag', getStatusClass(row.status)]">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="notes" label="Notes" min-width="200" />
        </el-table>

        <el-pagination
          style="margin-top: 20px"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="conversations.length"
          @current-change="handlePageChange"
        />
      </div>

      <!-- Right: Stats Section -->
      <div class="stats-section">
        <div class="stats-card">
          <h4>Today's Statistics</h4>
          <!-- 总通话次数 -->
          <div class="total-calls">
            <div class="stat-number">{{ todayStats.total }}</div>
            <div class="stat-label">Total Calls</div>
          </div>
          <!-- 其他统计数字 -->
          <div class="other-stats">
            <div class="stat-item">
              <div class="stat-number">{{ todayStats.completed }}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ todayStats.ongoing }}</div>
              <div class="stat-label">In Progress</div>
            </div>
          </div>
          <!-- ECharts图表容器 -->
          <div ref="chartContainer" style="height: 300px; margin-top: 20px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    const conversations = Array.from({ length: 50 }, (_, i) => {
      const statusOptions = ['Completed', 'In Progress', 'Pending'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const duration = Math.floor(Math.random() * 30) + 1;
      const baseTime = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);

      return {
        callId: `CALL-${String(i + 1).padStart(4, '0')}`,
        callerName: `Caller ${i + 1}`,
        phoneNumber: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        startTime: new Date(baseTime).toLocaleString(),
        duration: `${duration} min`,
        status: status,
        notes: `Emergency call handled with ${status.toLowerCase()} status. Duration: ${duration} minutes.`
      };
    });

    return {
      conversations,
      currentPage: 1,
      pageSize: 10,
      todayStats: {
        total: 44,
        completed: 21,
        ongoing: 9
      },
      chart: null
    };
  },
  computed: {
    pagedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.conversations.slice(startIndex, endIndex);
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case 'Completed':
          return 'status-completed';
        case 'In Progress':
          return 'status-progress';
        case 'Pending':
          return 'status-pending';
        default:
          return '';
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartContainer);
      const option = {
        color: ['#67c23a', '#409EFF', '#e6a23c'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '2%',
          left: 'center'
        },
        series: [
          {
            name: 'Call Status',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.todayStats.completed, name: 'Completed' },
              { value: this.todayStats.ongoing, name: 'In Progress' },
              { value: this.todayStats.total - this.todayStats.completed - this.todayStats.ongoing, name: 'Pending' }
            ]
          }
        ]
      };
      this.chart.setOption(option);
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
.conversation-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.table-section {
  flex: 3;
  min-width: 0;
}

.stats-section {
  flex: 1;
  min-width: 300px;
}

.stats-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stats-card h4 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.total-calls {
  text-align: center;
  margin-bottom: 20px;
}

.total-calls .stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
}

.other-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 5px;
  color: #666;
  font-size: 14px;
}

.status-tag {
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
}

.status-completed {
  background-color: #67c23a;
}

.status-progress {
  background-color: #409EFF;
}

.status-pending {
  background-color: #e6a23c;
}
</style>
