<template>
  <div>
    <!-- Map Layer Controls -->
    <div style="margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">
      <!-- Existing controls remain the same -->
      <el-input v-model="geoInput" placeholder="Enter address to locate" style="flex: 1;">
      </el-input>
      <el-button @click="geocodeAddress" style="width: 100px;">
        <span style="color: #000;">Search</span>
      </el-button>
      <el-button-group>
        <el-button type="primary" @click="locateCaller" title="Locate caller's position">
          <i class="fas fa-map-marker-alt"></i>
        </el-button>
        <el-button type="success" @click="showNearbyResources" title="Show nearby resources">
          <i class="fas fa-hospital"></i>
        </el-button>
      </el-button-group>

      <!-- New layer selector -->
      <el-radio-group v-model="currentMapLayer" @change="handleLayerChange">
        <el-radio-button label="default">Default</el-radio-button>
        <el-radio-button label="traffic">Traffic</el-radio-button>
        <el-radio-button label="weather">Weather</el-radio-button>
        <el-radio-button label="historical">Historical</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Map Container -->
    <div
      ref="resizableContainer"
      :style="{
        width: '100%',
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }"
    >
      <div ref="mapContainer" :style="mapContainerStyle">
        <!-- Base Map (can be replaced with actual map component if needed) -->
        <img
          src="@/assets/KL.png"
          alt="KL Map"
          style="width: 100%; height: 100%; object-fit: cover;"
        />

        <!-- Traffic Layer -->
        <img
          v-if="currentMapLayer === 'traffic'"
          src="@/assets/road_Conditions.png"
          alt="Traffic Layer"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"
        />

        <!-- Weather Layer -->
        <img
          v-if="currentMapLayer === 'weather'"
          src="@/assets/weather.png"
          alt="Weather Layer"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"
        />

        <!-- Existing Markers (FIRE, MEDICAL, etc.) -->
        <div v-for="marker in markers" :key="marker.id" :style="getMarkerStyle(marker)">
          <el-popover
            placement="top"
            :title="marker.type"
            trigger="hover"
            :width="200"
          >
            <template #default>
              <div>
                <p><strong>Location Name:</strong> {{ marker.locationName }}</p>
                <p><strong>Type:</strong> {{ marker.type }}</p>
                <p><strong>Status:</strong> {{ marker.status }}</p>
              </div>
            </template>
            <template #reference>
              <div class="marker-icon" :class="marker.type.toLowerCase()">
                <i :class="getMarkerIcon(marker.type)"></i>
              </div>
            </template>
          </el-popover>
        </div>

        <!-- Historical Markers (only show if currentMapLayer === 'historical') -->
        <div
          v-if="currentMapLayer === 'historical'"
          v-for="marker in historicalMarkers"
          :key="marker.id"
          :style="getMarkerStyle(marker)"
        >
          <el-popover
            placement="top"
            title="Historical Event"
            trigger="hover"
            :width="220"
          >
            <template #default>
              <div>
                <p><strong>Event:</strong> {{ marker.eventName }}</p>
                <p><strong>Date:</strong> {{ marker.date }}</p>
                <p>{{ marker.description }}</p>
              </div>
            </template>
            <template #reference>
              <div class="marker-icon historical">
                <i class="fas fa-flag"></i>
              </div>
            </template>
          </el-popover>
        </div>
      </div>

      <!-- Map Controls -->
      <div class="map-controls">
        <el-button-group vertical>
          <el-button @click="zoomIn">
            <i class="fas fa-plus"></i>
          </el-button>
          <el-button @click="zoomOut">
            <i class="fas fa-minus"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  data() {
    return {
      // Existing data
      markers: [
        {
          id: 1,
          top: 100,
          left: 200,
          locationName: 'Fire Station',
          type: 'FIRE',
          status: 'On Standby'
        },
        {
          id: 2,
          left: 300,
          top: 150,
          locationName: 'Hospital',
          type: 'MEDICAL',
          status: 'Available'
        }
      ],
      geoInput: '',
      mapContainerStyle: {
        transform: 'translate(0px, 0px) scale(1)',
        transformOrigin: '0 0',
        position: 'absolute',
        cursor: 'grab'
      },

      // New data for multi-layer support
      currentMapLayer: 'default',  // possible values: 'default', 'traffic', 'weather', 'historical'
      historicalMarkers: [
        {
          id: 101,
          top: 220,
          left: 180,
          eventName: 'Flood Event',
          date: '2020-08-15',
          description: 'Severe flooding in the area',
          type: 'HISTORICAL'
        },
        {
          id: 102,
          top: 280,
          left: 320,
          eventName: 'Road Closure',
          date: '2021-02-10',
          description: 'Major accident leading to closure',
          type: 'HISTORICAL'
        }
      ]
    };
  },
  methods: {
    async geocodeAddress() {
      const apiKey = 'YOUR_API_KEY';
      const address = this.geoInput;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const location = response.data.results[0].geometry.location;
        alert(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
      } catch (error) {
        alert('Error with geocoding request.');
      }
    },
    async reverseGeocode() {
      const apiKey = 'YOUR_API_KEY';
      const lat = 3.139;
      const lng = 101.6869;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const address = response.data.results[0].formatted_address;
        alert(`Address: ${address}`);
      } catch (error) {
        alert('Error with reverse geocoding request.');
      }
    },
    getMarkerIcon(type) {
      const icons = {
        FIRE: 'fas fa-fire',
        MEDICAL: 'fas fa-hospital',
        POLICE: 'fas fa-shield-alt',
        CALLER: 'fas fa-phone',
        HISTORICAL: 'fas fa-flag'
      };
      return icons[type] || 'fas fa-map-marker-alt';
    },
    getMarkerStyle(marker) {
      return {
        position: 'absolute',
        top: `${marker.top}px`,
        left: `${marker.left}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
      };
    },
    locateCaller() {
      this.markers.push({
        id: Date.now(),
        top: 120,
        left: 250,
        locationName: 'Caller Location',
        type: 'CALLER',
        status: 'Active'
      });
    },
    showNearbyResources() {
      alert('Showing resources within 5km range');
    },
    zoomIn() {
      const currentScale = parseFloat(this.mapContainerStyle.transform.match(/scale\((.*?)\)/)[1]);
      this.mapContainerStyle.transform = this.mapContainerStyle.transform.replace(
        /scale\(.*?\)/,
        `scale(${currentScale * 1.2})`
      );
    },
    zoomOut() {
      const currentScale = parseFloat(this.mapContainerStyle.transform.match(/scale\((.*?)\)/)[1]);
      this.mapContainerStyle.transform = this.mapContainerStyle.transform.replace(
        /scale\(.*?\)/,
        `scale(${currentScale / 1.2})`
      );
    },
    handleLayerChange(newLayer) {
      if (newLayer === 'historical') {
        this.navigateToDispatchDashboard();
      }
      // No additional handling needed for 'traffic' and 'weather' as the template handles their display
    },
    navigateToDispatchDashboard() {
      this.$router.push({ name: 'DispatchDashboard' });
    }
  },
  setup() {
    const router = useRouter(); // Initialize router
    return { router };
  }
};
</script>

<style scoped>
.marker-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.marker-icon:hover {
  transform: scale(1.2);
}

.marker-icon.fire {
  background-color: #f56c6c;
}
.marker-icon.medical {
  background-color: #409eff;
}
.marker-icon.police {
  background-color: #67c23a;
}
.marker-icon.caller {
  background-color: #e6a23c;
}
/* New style for historical markers */
.marker-icon.historical {
  background-color: #909399;
}

.map-controls {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1000;
}

/* Optional: Add styles for traffic and weather layers if needed */
</style>
