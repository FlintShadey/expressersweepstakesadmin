<template>
  <v-app>
    <v-app-bar app dark color="primary" elevation="4" density="compact">
      <v-app-bar-title class="text-h6">
        <v-icon left size="small">mdi-trophy</v-icon>
        <span class="d-none d-sm-inline">Sweepstakes </span>Admin
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-2 pa-sm-4">
        <!-- Stats Cards -->
        <v-row class="mb-4">
          <v-col cols="6" sm="4" md="4">
            <v-card color="primary" dark>
              <v-card-text class="pa-3">
                <div class="d-flex align-center">
                  <v-icon size="32" class="mr-2">mdi-account-multiple</v-icon>
                  <div>
                    <div class="text-h5">{{ totalEntries }}</div>
                    <div class="text-caption">Total Entries</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="6" sm="4" md="4">
            <v-card color="success" dark>
              <v-card-text class="pa-3">
                <div class="d-flex align-center">
                  <v-icon size="32" class="mr-2">mdi-trophy-award</v-icon>
                  <div>
                    <div class="text-h5">{{ winners }}</div>
                    <div class="text-caption">Winners</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="4" md="4">
            <v-card color="info" dark>
              <v-card-text class="pa-3">
                <div class="d-flex align-center">
                  <v-icon size="32" class="mr-2">mdi-calendar-today</v-icon>
                  <div>
                    <div class="text-h5">{{ todayEntries }}</div>
                    <div class="text-caption">Today's Entries</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card>
              <v-card-text class="pa-3">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      block
                      size="large"
                      color="deep-purple"
                      :loading="isDrawing"
                      @click="drawWinner"
                      :disabled="totalEntries === 0"
                      class="mb-2"
                    >
                      <v-icon left>mdi-dice-6</v-icon>
                      Draw Winner
                    </v-btn>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-btn
                      block
                      size="large"
                      color="orange"
                      :loading="isExporting"
                      @click="exportToCSV"
                      :disabled="totalEntries === 0"
                      class="mb-2"
                    >
                      <v-icon left>mdi-download</v-icon>
                      Export CSV
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Latest Winner Card (Mobile Optimized) -->
        <v-row v-if="lastWinner" class="mb-4">
          <v-col cols="12">
            <v-card color="success" dark>
              <v-card-title class="pa-3">
                <v-icon left>mdi-trophy</v-icon>
                Latest Winner
              </v-card-title>
              <v-card-text class="pa-3">
                <div class="text-h6">{{ lastWinner.first_name }} {{ lastWinner.last_name }}</div>
                <div class="text-subtitle-2">{{ lastWinner.phone_number }}</div>
                <div class="text-caption">{{ formatDate(lastWinner.entry_date) }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Entries Table -->
        <v-card>
          <v-card-title class="pa-3">
            <v-icon left>mdi-table</v-icon>
            <span class="d-none d-sm-inline">Sweepstakes </span>Entries
            <v-spacer></v-spacer>
            <v-btn color="cyan" @click="refreshEntries" :loading="isLoading" size="small" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="entries"
            :loading="isLoading"
            loading-text="Loading entries..."
            no-data-text="No entries found"
            class="elevation-1"
            item-value="id"
            :items-per-page="10"
            :items-per-page-options="[10, 25, 50]"
            :mobile-breakpoint="0"
          >
            <template v-slot:item.entry_date="{ item }">
              <span class="text-caption">{{ formatDate(item.entry_date) }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>

    <!-- Confirm Clear Database Dialog -->
    <v-dialog v-model="showClearDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirm Clear Database
        </v-card-title>
        <v-card-text>
          Are you sure you want to clear all entries from the database? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey" @click="showClearDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-2" @click="clearDatabase" :loading="isClearing">
            Clear Database
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Winner Announcement Dialog -->
    <v-dialog
      v-model="showWinnerDialog"
      max-width="500px"
      fullscreen-mobile
      transition="dialog-bottom-transition"
    >
      <v-card v-if="selectedWinner">
        <v-card-title class="text-h4 text-center pa-4">
          <v-icon size="50" color="success" class="mb-2">mdi-trophy</v-icon>
          <div>Congratulations!</div>
        </v-card-title>
        <v-card-text class="text-center pa-4">
          <div class="text-h5 mb-2">
            {{ selectedWinner.first_name }} {{ selectedWinner.last_name }}
          </div>
          <div class="text-h6 mb-4">{{ selectedWinner.phone_number }}</div>
          <div class="text-body-1">You are our lucky winner!</div>
        </v-card-text>
        <v-card-actions class="justify-center pa-4 flex-column flex-sm-row">
          <v-btn
            color="teal"
            size="large"
            @click="closeWinnerDialog"
            class="mb-2 mb-sm-0 mr-sm-4"
            block-sm
          >
            Close
          </v-btn>
          <v-btn
            color="pink"
            size="large"
            variant="outlined"
            @click="confirmDeleteWinner"
            :loading="isDeletingWinner"
            block-sm
          >
            <v-icon left>mdi-delete</v-icon>
            Remove from Database
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Winner Dialog -->
    <v-dialog v-model="showDeleteWinnerDialog" max-width="400px" fullscreen-mobile>
      <v-card>
        <v-card-title class="text-h5 pa-4">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirm Delete Winner
        </v-card-title>
        <v-card-text class="pa-4">
          Are you sure you want to delete
          <strong>{{ selectedWinner?.first_name }} {{ selectedWinner?.last_name }}</strong> from the
          database? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4 flex-column flex-sm-row">
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-btn
            text
            color="grey"
            @click="showDeleteWinnerDialog = false"
            class="mb-2 mb-sm-0"
            block-sm
          >
            Cancel
          </v-btn>
          <v-btn
            color="red-darken-2"
            @click="deleteWinnerFromDatabase"
            :loading="isDeletingWinner"
            block-sm
          >
            Delete Winner
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" location="bottom">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn text color="white" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { supabase, type SweepstakesEntry } from "@/lib/supabase";

// Reactive state
const entries = ref<SweepstakesEntry[]>([]);
const isLoading = ref(false);
const isDrawing = ref(false);
const isExporting = ref(false);
const isClearing = ref(false);
const isDeletingWinner = ref(false);
const showClearDialog = ref(false);
const showWinnerDialog = ref(false);
const showDeleteWinnerDialog = ref(false);
const selectedWinner = ref<SweepstakesEntry | null>(null);
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Table headers
const headers = [
  {
    title: "Name",
    key: "first_name",
    value: (item: SweepstakesEntry) => `${item.first_name} ${item.last_name}`,
  },
  { title: "Phone", key: "phone_number" },
  { title: "Entry Date", key: "entry_date" },
];

// Computed properties
const totalEntries = computed(() => entries.value.length);
const winners = computed(() => entries.value.filter((entry) => entry.is_winner).length);
const todayEntries = computed(() => {
  const today = new Date().toDateString();
  return entries.value.filter((entry) => new Date(entry.entry_date).toDateString() === today)
    .length;
});
const lastWinner = computed(() => {
  const winnerEntries = entries.value.filter((entry) => entry.is_winner);
  return winnerEntries.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0];
});

// Methods
const showSnackbar = (message: string, color: string = "success") => {
  snackbar.value = { show: true, message, color };
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const fetchEntries = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("sweepstakes_entries")
      .select("*")
      .order("entry_date", { ascending: false });

    if (error) throw error;
    entries.value = data || [];
  } catch (error) {
    console.error("Error fetching entries:", error);
    showSnackbar("Error fetching entries", "error");
  } finally {
    isLoading.value = false;
  }
};

const refreshEntries = () => {
  fetchEntries();
};

const drawWinner = async () => {
  isDrawing.value = true;
  try {
    const availableEntries = entries.value.filter((entry) => !entry.is_winner);
    if (availableEntries.length === 0) {
      showSnackbar("No available entries to draw from", "warning");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableEntries.length);
    const winner = availableEntries[randomIndex];

    await markAsWinner(winner);
    selectedWinner.value = winner;
    showWinnerDialog.value = true;
  } catch (error) {
    console.error("Error drawing winner:", error);
    showSnackbar("Error drawing winner", "error");
  } finally {
    isDrawing.value = false;
  }
};

const markAsWinner = async (entry: SweepstakesEntry) => {
  try {
    const { error } = await supabase
      .from("sweepstakes_entries")
      .update({
        is_winner: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entry.id);

    if (error) throw error;

    // Update local state
    const index = entries.value.findIndex((e) => e.id === entry.id);
    if (index !== -1) {
      entries.value[index].is_winner = true;
      entries.value[index].updated_at = new Date().toISOString();
    }

    showSnackbar(`${entry.first_name} ${entry.last_name} marked as winner!`);
  } catch (error) {
    console.error("Error marking as winner:", error);
    showSnackbar("Error marking as winner", "error");
  }
};

const deleteEntry = async (entry: SweepstakesEntry) => {
  if (!confirm(`Are you sure you want to delete ${entry.first_name} ${entry.last_name}?`)) {
    return;
  }

  try {
    const { error } = await supabase.from("sweepstakes_entries").delete().eq("id", entry.id);

    if (error) throw error;

    // Remove from local state
    const index = entries.value.findIndex((e) => e.id === entry.id);
    if (index !== -1) {
      entries.value.splice(index, 1);
    }

    showSnackbar(`${entry.first_name} ${entry.last_name} deleted`);
  } catch (error) {
    console.error("Error deleting entry:", error);
    showSnackbar("Error deleting entry", "error");
  }
};

const exportToCSV = async () => {
  isExporting.value = true;
  try {
    const csvContent = [
      [
        "First Name",
        "Last Name",
        "Phone Number",
        "Entry Date",
        "Source",
        "Is Winner",
        "Notes",
      ].join(","),
      ...entries.value.map((entry) =>
        [
          entry.first_name,
          entry.last_name,
          entry.phone_number,
          entry.entry_date,
          entry.entry_source,
          entry.is_winner ? "Yes" : "No",
          entry.notes || "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sweepstakes_entries_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSnackbar("CSV exported successfully!");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    showSnackbar("Error exporting CSV", "error");
  } finally {
    isExporting.value = false;
  }
};

const confirmClearDatabase = () => {
  showClearDialog.value = true;
};

const clearDatabase = async () => {
  isClearing.value = true;
  try {
    const { error } = await supabase
      .from("sweepstakes_entries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all records

    if (error) throw error;

    entries.value = [];
    showClearDialog.value = false;
    showSnackbar("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
    showSnackbar("Error clearing database", "error");
  } finally {
    isClearing.value = false;
  }
};

const closeWinnerDialog = () => {
  showWinnerDialog.value = false;
  selectedWinner.value = null;
};

const confirmDeleteWinner = () => {
  showDeleteWinnerDialog.value = true;
};

const deleteWinnerFromDatabase = async () => {
  if (!selectedWinner.value) return;

  isDeletingWinner.value = true;
  try {
    const { error } = await supabase
      .from("sweepstakes_entries")
      .delete()
      .eq("id", selectedWinner.value.id);

    if (error) throw error;

    // Remove from local state
    const index = entries.value.findIndex((e) => e.id === selectedWinner.value!.id);
    if (index !== -1) {
      entries.value.splice(index, 1);
    }

    showSnackbar(
      `${selectedWinner.value.first_name} ${selectedWinner.value.last_name} deleted from database`
    );

    // Close both dialogs
    showDeleteWinnerDialog.value = false;
    closeWinnerDialog();
  } catch (error) {
    console.error("Error deleting winner:", error);
    showSnackbar("Error deleting winner from database", "error");
  } finally {
    isDeletingWinner.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchEntries();
});
</script>

<style scoped>
.v-main {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  min-height: 100vh;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-btn {
  transition: all 0.3s ease;
}

.v-data-table {
  background: transparent !important;
}

/* Mobile-specific optimizations */
@media (max-width: 599px) {
  .v-card-title {
    font-size: 1rem !important;
    padding: 12px !important;
  }

  .v-card-text {
    padding: 12px !important;
  }

  .v-btn {
    min-height: 44px !important; /* Better touch targets */
  }

  .text-h5 {
    font-size: 1.25rem !important;
  }

  .text-h6 {
    font-size: 1.1rem !important;
  }

  /* Make dialog buttons stack on mobile */
  .v-card-actions.flex-column .v-btn {
    width: 100% !important;
    margin: 4px 0 !important;
  }

  /* Optimize table for mobile */
  .v-data-table .v-data-table__wrapper {
    overflow-x: auto;
  }

  /* Smaller padding for mobile */
  .pa-mobile {
    padding: 8px !important;
  }
}

/* Custom utility classes */
.block-sm {
  width: 100%;
}

@media (min-width: 600px) {
  .block-sm {
    width: auto;
  }
}

/* Improve readability on small screens */
@media (max-width: 959px) {
  .v-data-table-footer {
    flex-wrap: wrap;
  }

  .v-data-table-footer__items-per-page {
    margin-bottom: 8px;
  }
}
</style>
