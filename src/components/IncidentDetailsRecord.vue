<template>
  <div>
    <h3>Incident Details</h3>

    <!-- Main Container: Left-Right layout + Responsive -->
    <div
      style="
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        gap: 20px;
        margin-top: 20px;
      "
    >
      <!-- Left: Table + Pagination, scrollable -->
      <div
        style="
          flex: 2;
          min-width: 0;
          overflow: auto;
          display: flex;
          flex-direction: column;
        "
      >
        <el-table
          :data="pagedData"
          style="width: 100%;"
          border
          size="small"
        >
          <el-table-column prop="title" label="Incident Title" width="160" />
          <el-table-column prop="incidentStatus" label="Status" width="120" />
          <el-table-column prop="timeReported" label="Time Reported" width="180" />
          <el-table-column prop="timeDispatched" label="Time Dispatched" width="180" />
          <el-table-column prop="priority" label="Priority Level" width="120">
            <template #default="{ row }">
              <span :class="['priority-tag', getPriorityClass(row.priority)]">
                {{ row.priority }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="Description" min-width="200" />
        </el-table>

        <el-pagination
          style="margin-top: 20px;"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="filteredIncidents.length"
          @current-change="handlePageChange"
        />
      </div>

      <!-- Right: Date Range Picker + Pie Chart, also scrollable -->
      <div
        style="
          flex: 1;
          min-width: 0;
          overflow: auto;
          display: flex;
          flex-direction: column;
        "
      >
        <div style="margin-bottom: 10px;">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="onDateRangeChange"
            style="width: 100%;"
          />
        </div>

        <!-- ECharts Pie Chart -->
        <div
          ref="echartPie"
          style="width: 100%; height: 400px; border: 1px solid #ddd;"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";

export default {
  data() {
    const statusOptions = ["Reported", "In Progress", "Resolved"];
    const priorityOptions = ["High", "Medium", "Low"];

    // 生成 50 条示例数据
    const incidentsArray = Array.from({ length: 50 }, (_, i) => {
      const randomStatus =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const randomPriority =
        priorityOptions[Math.floor(Math.random() * priorityOptions.length)];

      const offsetMillis = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
      const baseTime = Date.now() - offsetMillis;
      const reportedTime = new Date(baseTime);

      const dispatchOffset = Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000);
      const dispatchedTime = new Date(baseTime + dispatchOffset);

      return {
        reportedMillis: baseTime,
        title: `Incident #${i + 1}`,
        incidentStatus: randomStatus,
        timeReported: reportedTime.toLocaleString(),
        timeDispatched: dispatchedTime.toLocaleString(),
        priority: randomPriority,
        description: `Detailed description of incident #${i + 1}. This incident is currently "${randomStatus}" with a "${randomPriority}" priority.`,
      };
    });

    return {
      incidents: incidentsArray,
      chart: null,

      currentPage: 1,
      pageSize: 10,
      dateRange: null,

      incident: {
        incidentID: '',
        incidentType: '',
        priority: '',
        location: {
          address: '',
          coordinates: {
            latitude: '',
            longitude: ''
          }
        }
      }
    };
  },
  computed: {
    filteredIncidents() {
      if (!this.dateRange || this.dateRange.length < 2) {
        return this.incidents;
      }
      const startMillis = this.dateRange[0].getTime();
      const endMillis = this.dateRange[1].getTime();
      return this.incidents.filter((item) => {
        return item.reportedMillis >= startMillis && item.reportedMillis <= endMillis;
      });
    },
    pagedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredIncidents.slice(startIndex, endIndex);
    },
  },
  mounted() {
    this.initPieChart();
  },
  methods: {
    getPriorityClass(priority) {
      switch (priority) {
        case "High":
          return "high-priority";
        case "Medium":
          return "medium-priority";
        case "Low":
          return "low-priority";
        default:
          return "";
      }
    },
    getPriorityDistribution() {
      // 计算不同优先级出现次数
      const distribution = { High: 0, Medium: 0, Low: 0 };
      this.filteredIncidents.forEach((item) => {
        if (distribution[item.priority] !== undefined) {
          distribution[item.priority]++;
        }
      });
      return [
        {
          name: "High",
          value: distribution["High"],
          // 与表格中 high-priority 一致
          itemStyle: { color: "#f56c6c" },
        },
        {
          name: "Medium",
          value: distribution["Medium"],
          // 与表格中 medium-priority 一致
          itemStyle: { color: "#e6a23c" },
        },
        {
          name: "Low",
          value: distribution["Low"],
          // 与表格中 low-priority 一致
          itemStyle: { color: "#67c23a" },
        },
      ];
    },
    initPieChart() {
      const chartDom = this.$refs.echartPie;
      this.chart = echarts.init(chartDom);
      this.updatePieChart();
    },
    updatePieChart() {
      const option = {
        title: { text: "Incident Priority Distribution", left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
          {
            name: "Priority",
            type: "pie",
            radius: "50%",
            data: this.getPriorityDistribution(),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    onDateRangeChange() {
      this.currentPage = 1;
      if (this.chart) {
        this.updatePieChart();
      }
    },
  },
};
</script>

<style scoped>
.priority-tag {
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  vertical-align: middle;
}

/* 与饼状图颜色保持一致 */
.high-priority {
  background-color: #f56c6c; /* 红色 */
}
.medium-priority {
  background-color: #e6a23c; /* 橙色 */
}
.low-priority {
  background-color: #67c23a; /* 绿色 */
}
</style>
