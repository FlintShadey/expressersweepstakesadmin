import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const customDarkTheme = {
  dark: true,
  colors: {
    background: "#121212",
    surface: "#1e1e1e",
    "surface-bright": "#cccccc",
    "surface-light": "#424242",
    "surface-variant": "#424242",
    "on-surface-variant": "#cccccc",
    primary: "#1976d2",
    "primary-darken-1": "#1565c0",
    secondary: "#03dac6",
    "secondary-darken-1": "#018786",
    error: "#cf6679",
    info: "#2196f3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
  variables: {
    "border-color": "#ffffff1f",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.12,
    "dragged-opacity": 0.08,
  },
};

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "customDarkTheme",
    themes: {
      customDarkTheme,
    },
  },
  defaults: {
    VBtn: {
      color: "primary",
      variant: "flat",
    },
    VCard: {
      elevation: 4,
    },
  },
});
