<template>
  <el-card>
    <div style="margin-top: -20px!important"> <h4>Log</h4></div>
    <!-- 将 input 类型更改为 textarea -->
    <el-input
      v-model="newLog"
      placeholder="Add a note"
      type="textarea"
      rows="9"
    />
    <el-button type="primary" @click="addLog" style="margin-top: 10px;width: 100%;">Add</el-button>
    <ul>
      <li v-for="log in logs" :key="log">{{ log }}</li>
    </ul>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      logs: [],
      newLog: '',
    };
  },
  methods: {
    addLog() {
      if (this.newLog) {
        this.logs.push(this.newLog);
        this.newLog = '';
      }
    },
  },
};
</script>
