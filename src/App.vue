<script setup lang="ts">
import AdminDashboard from './components/AdminDashboard.vue'
</script>

<template>
  <AdminDashboard />
</template>

<style>
/* Global styles for Vuetify */
html {
  overflow-y: auto;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

.v-application {
  background: #121212 !important;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
