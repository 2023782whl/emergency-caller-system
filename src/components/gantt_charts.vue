<!-- src/components/ProjectPlan.vue -->
<template>
  <div class="project-plan-container">
    <el-card class="table-card">
      <h2>Project Plan</h2>
      <el-table :data="projectPhases" style="width: 100%">
        <el-table-column prop="phase" label="Phase" width="250"></el-table-column>
        <el-table-column prop="startDate" label="Start Date" width="150"></el-table-column>
        <el-table-column prop="endDate" label="End Date" width="150"></el-table-column>
        <el-table-column prop="description" label="Description"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="chart-card">
      <h2>The proportion of time spent on project distribution</h2>
      <div ref="pieChart" class="chart"></div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'ProjectPlan',
  setup() {
    const pieChart = ref(null)

    const projectPhases = [
      {
        phase: 'Proposal and Requirements Analysis',
        startDate: '20 Oct 2024',
        endDate: '15 Nov 2024',
        description:
          'Finalize project objectives, scope, methodologies, and documentation requirements.',
      },
      {
        phase: 'Literature Review and Data Collection',
        startDate: '16 Nov 2024',
        endDate: '31 Dec 2024',
        description:
          'Collect relevant datasets, analyze existing emergency systems, and engage stakeholders for initial feedback.',
      },
      {
        phase: 'System Design and Prototyping',
        startDate: '1 Jan 2025',
        endDate: '28 Jan 2025',
        description:
          'Develop architecture, implement initial modules, and incorporate buffer time for iterative design adjustments.',
      },
      {
        phase: 'Implementation and Extended Testing',
        startDate: '29 Jan 2025',
        endDate: '31 Jan 2025',
        description:
          'Build the prototype and initiate testing using simulated disaster scenarios, extending the testing phase beyond the initially planned 15 days to ensure robustness.',
      },
      {
        phase: 'Evaluation and Reporting',
        startDate: '1 Feb 2025',
        endDate: '20 Feb 2025',
        description:
          'Measure system performance, document findings, address any technical challenges, and prepare the final report.',
      },
      {
        phase: 'Buffer and Contingency Period',
        startDate: '21 Feb 2025',
        endDate: '25 Feb 2025',
        description:
          'Allocate additional time for unforeseen technical challenges and final adjustments.',
      },
    ]

    // Calculate the duration of each phase in days
    const calculateDuration = (start, end) => {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = Math.abs(endDate - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }

    const phaseDurations = projectPhases.map((phase) => ({
      name: phase.phase,
      value: calculateDuration(phase.startDate, phase.endDate),
    }))

    const initPieChart = () => {
      const chart = echarts.init(pieChart.value)

      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        color: [
          '#5470C6',
          '#91CC75',
          '#EE6666',
          '#FAC858',
          '#73C0DE',
          '#3BA272',
        ],
        series: [
          {
            name: 'Phase Duration (days)',
            type: 'pie',
            radius: '50%',
            data: phaseDurations,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: '{b}: {d}%',
            },
          },
        ],
      }

      chart.setOption(option)

      // Handle responsiveness
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    onMounted(() => {
      initPieChart()
    })

    return {
      projectPhases,
      pieChart,
    }
  },
}
</script>

<style scoped>
.project-plan-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.table-card,
.chart-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 400px;
}
</style>
