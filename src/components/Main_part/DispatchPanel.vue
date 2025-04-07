<template>
  <el-form label-position="top" label-width="100px">
    <!-- Existing Form Items -->

    <!-- 1. Select Institution -->
    <el-form-item label="Select Institution">
      <el-row gutter="10" align="middle">
        <el-col :span="18">
          <el-select
            v-model="selectedAgency"
            placeholder="Please select an institution"
            style="width: 200px;"
          >
            <el-option
              v-for="agency in filteredAgencies"
              :key="agency.value"
              :label="agency.label"
              :value="agency.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="dispatch"
            style="width: 100%;"
            :disabled="!selectedAgency"
          >
            Dispatch
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 2. Dispatch Status -->
    <el-form-item label="Dispatch Status">
      <el-input v-model="dispatchStatus" placeholder="Dispatch status" readonly />
    </el-form-item>

    <!-- Additional Information Display Component -->

    <!-- 3. Dynamic Script Button -->
    <el-form-item label="Call Script">
      <el-button
        type="success"
        @click="generateScript"
        style="width: 200px;"
      >
        Generate Script
      </el-button>
      <el-textarea
        v-model="generatedScript"
        placeholder="Generated script will appear here..."
        rows="4"
        style="margin-top: 10px;"
        readonly
      ></el-textarea>
    </el-form-item>

    <!-- 4. Data Source Label -->
    <el-form-item label="Supplemental Information">
      <el-card>
        <div
          v-for="info in filteredSupplementalInfo"
          :key="info.id"
          class="info-item"
        >
          <el-tag type="info">{{ info.content }}</el-tag>
          <el-tag type="success" disable-transitions>
            {{ info.source }}
          </el-tag>
        </div>
      </el-card>
    </el-form-item>

    <!-- 5. Info Priority Filter -->
    <el-form-item label="Info Priority Filter">
      <el-select
        v-model="selectedPriority"
        placeholder="Select priority"
        style="width: 200px;"
        clearable
      >
        <el-option label="High" value="high"></el-option>
        <el-option label="Medium" value="medium"></el-option>
        <el-option label="Low" value="low"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DispatchForm',
  props: {
    emergencyType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // Existing Data
      agencies: {
        fire: [
          { label: 'Fire Station A', value: 'fire_station_a' },
          { label: 'Fire Station B', value: 'fire_station_b' },
        ],
        medical: [
          { label: 'Specialist Hospital A', value: 'specialist_hospital_a' },
          { label: 'Grade A Hospital B', value: 'grade_a_hospital_b' },
        ],
        police: [
          { label: 'Police Station A', value: 'police_station_a' },
          { label: 'Police Station B', value: 'police_station_b' },
        ],
        natural_disaster: [
          { label: 'Natural Disaster Rescue Center A', value: 'disaster_rescue_center_a' },
          { label: 'Natural Disaster Rescue Center B', value: 'disaster_rescue_center_b' },
        ],
        other: [
          { label: 'General Emergency Center', value: 'general_emergency_center' },
        ],
      },
      selectedAgency: '',
      dispatchStatus: 'Pending', // Existing Dispatch Status Field

      // New Data Properties for Additional Information Display Component
      generatedScript: '',
      supplementalInfo: [
        {
          id: 1,
          content: 'Caller has a history of heart disease.',
          source: 'Historical Record',
          priority: 'high',
        },
        {
          id: 2,
          content: 'Weather conditions are clear.',
          source: 'External DB',
          priority: 'low',
        },
        {
          id: 3,
          content: 'Previous incident reported at this location.',
          source: 'User Input',
          priority: 'medium',
        },
        // Add more supplemental info as needed
      ],
      selectedPriority: '', // For Info Priority Filter
    };
  },
  computed: {
    // Filters agencies based on the provided emergency type
    filteredAgencies() {
      return this.emergencyType ? this.agencies[this.emergencyType] || [] : [];
    },
    // Filters supplemental information based on selected priority
    filteredSupplementalInfo() {
      if (!this.selectedPriority) {
        return this.supplementalInfo;
      }
      return this.supplementalInfo.filter(
        (info) => info.priority === this.selectedPriority
      );
    },
  },
  methods: {
    // Dispatches the selected agency and updates the status
    dispatch() {
      if (!this.selectedAgency) {
        this.$message.warning('Please select an institution to dispatch.');
        return;
      }
      this.dispatchStatus = 'Dispatched';
      this.$message.success(
        `Successfully dispatched to ${this.getAgencyLabel(this.selectedAgency)}.`
      );
    },
    // Generates a script based on selected agency and filtered supplemental info
    generateScript() {
      if (!this.selectedAgency) {
        this.$message.warning('Please select an institution to dispatch.');
        return;
      }

      let script = `Dispatching to ${this.getAgencyLabel(this.selectedAgency)}.\n`;

      // Incorporate supplemental info based on priority filter
      const infoToInclude = this.filteredSupplementalInfo;
      if (infoToInclude.length > 0) {
        script += 'Additional Information:\n';
        infoToInclude.forEach((info) => {
          script += `- ${info.content} (Source: ${info.source})\n`;
        });
      } else {
        script += 'No additional information available.\n';
      }

      this.generatedScript = script;
      this.$message.success('Script generated successfully.');
    },
    // Helper method to get agency label from value
    getAgencyLabel(value) {
      const allAgencies = Object.values(this.agencies).flat();
      const agency = allAgencies.find((ag) => ag.value === value);
      return agency ? agency.label : value;
    },
  },
  watch: {
    // Clears the generated script when priority filter changes
    selectedPriority() {
      this.generatedScript = '';
    },
  },
};
</script>

<style scoped>
.el-form--default.el-form--label-top .el-form-item .el-form-item__label {
  line-height: 22px !important;
  margin-top: 15px !important;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item .el-tag {
  margin-right: 5px;
}
</style>
