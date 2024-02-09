<template>
  <q-page class="full-height">
    <div class="row justify-content-center align-items-center full-height">
      <div class="col-md-12">
        <q-card class="q-pa-md">
          <q-card-section>
            <h2 class="text-h6">Contact Information</h2>
          </q-card-section>

          <q-card-section>
            <!-- Display Google Map with marker -->
            <GMapMap :center="center" :zoom="15" class="map-container">
              <GMapMarker
                :key="0"
                :position="center"
                :clickable="false"
                icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              />
            </GMapMap>

            <!-- Button to get current location -->
            <q-btn
              @click="getCurrentPositionAsync"
              label="Get Current Location"
              class="q-mb-md"
              color="primary"
            />

            <!-- Image uploader input -->
            <q-uploader
              accept="image/*"
              @added="onImageAdded"
              class="q-mt-md"
              label="Upload Image"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    const center = ref({ lat: 51.093048, lng: 6.84212 });
    return {
      center,
    };
  },
  methods: {
    onImageAdded(file) {
      // Method to handle when an image is added
      console.log('Image added:', file);
      // You can perform further processing with the uploaded image here
    },
    async getCurrentPositionAsync() {
      try {
        const position = await this.getCurrentPosition();

        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        await this.sendLocation(
          position.coords.latitude,
          position.coords.longitude
        );
      } catch (error) {
        console.error("Error getting current position:", error);
      }
    },
    async sendLocation(latitude, longitude) {
      try {
        const response = await this.$api.get("?format=json");
        const ip = response.data.ip;
        const locationResponse = await this.$api.get(`/${ip}/json`);
        console.log("Current position:", locationResponse);
      } catch (error) {
        console.error("Error sending location:", error);
      }
    },
    async getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
.map-container {
  height: 600px !important;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
