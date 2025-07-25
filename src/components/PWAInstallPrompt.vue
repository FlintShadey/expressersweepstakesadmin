<template>
  <v-snackbar
    v-model="showInstallPrompt"
    :timeout="10000"
    location="top"
    color="primary"
    variant="elevated"
  >
    <div class="d-flex align-center">
      <v-icon left>mdi-cellphone-arrow-down</v-icon>
      <span>Install this app for a better experience!</span>
    </div>

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="installApp" size="small"> Install </v-btn>
      <v-btn color="white" variant="text" @click="dismissPrompt" size="small"> Dismiss </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showInstallPrompt = ref(false);
let deferredPrompt: any = null;

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  }
  showInstallPrompt.value = false;
};

const dismissPrompt = () => {
  showInstallPrompt.value = false;
  // Remember user dismissed the prompt for this session
  sessionStorage.setItem("pwa-install-dismissed", "true");
};

onMounted(() => {
  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show our custom install prompt if user hasn't dismissed it
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (!dismissed) {
      setTimeout(() => {
        showInstallPrompt.value = true;
      }, 3000); // Show after 3 seconds
    }
  });

  // Listen for app installation
  window.addEventListener("appinstalled", (evt) => {
    console.log("PWA was installed");
    showInstallPrompt.value = false;
  });
});
</script>
