<template>
  <q-page class="full-height">
    <q-card>
      <q-form @submit="onSubmit">
        <q-card-section>
          <h2 class="text-h6">Map Location</h2>
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
            round
            icon="map"
            @click="getCurrentPositionAsync"
            class="mb-3 float-right"
            color="primary"
          />

          <!-- Image uploader input -->
          <q-uploader
            accept="image/*"
            @added="onImageAdded"
            flat
            bordered
            :style="
              $q.screen.xs || $q.screen.sm ? 'max-width: 300px' : 'width: 100%'
            "
            label="Upload Image"
          />
        </q-card-section>

        <q-card-section>
          <q-select
            behavior="menu"
            class="q-mx-sm"
            filled
            v-model="user"
            label="Users"
            use-input
            fill-input
            hide-selected
            :options="users"
            option-value="id"
            option-label="name"
            reactive-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Please select a user',
            ]"
          >
            <template v-slot:append>
              <q-icon
                v-if="user"
                class="cursor-pointer"
                color="grey-7"
                name="icon-mat-close-circle"
                @click.stop.prevent="user = null"
              />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Users </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-section>
          <q-btn label="Submit" type="submit" color="primary" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const center = ref({ lat: 51.093048, lng: 6.84212 });
    const image = ref(null);
    const users = ref([]);
    const user = ref(null);
    return {
      center,
      image,
      users,
      user,
    };
  },
  async mounted() {
    await this.getAllUsers();
  },
  methods: {
    async getCurrentPositionAsync() {
      try {
        const position = await this.getCurrentPosition();
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (error) {
        console.error("Error getting current position:", error);
        throw error;
      }
    },
    async getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    onImageAdded(files) {
      if (files.length > 0) {
        this.image = files[0];
        // You can perform further processing with the uploaded image here
      }
    },
    async sendLocation(args) {
      try {
        if (!this.image) {
          this.$q.notify({
            type: "negative",
            message: "No image uploaded",
          });
        }
        ////

        const formData = new FormData();
        formData.append("latitude", args.lat);
        formData.append("longitude", args.lng);
        formData.append("userId", this.user.id);
        formData.append("file", this.image);

        const response = await this.$api.post("/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response;
      } catch (error) {
        console.error("Error sending location:", error);
        throw error;
      }
    },
    async getAllUsers() {
      try {
        const response = await this.$api.get("/users");
        this.users = response.data;
      } catch (error) {
        console.error("Error sending location:", error);
        throw error;
      }
    },
    async onSubmit() {
      try {
        const response = await this.sendLocation(this.center);
        this.$q.notify({
          type: "positive",
          message: response.data.message,
        });
        this.onReset();
      } catch (error) {
        this.$q.notify({
          type: "danger",
          message: response.data.message,
        });
        this.onReset();
        console.error("Error submitting form:", error);
        // Handle error gracefully, e.g., display an error message to the user
      }
    },
    onReset() {
      this.image = null;
      this.user = null;
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
.map-container {
  height: 350px !important;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
