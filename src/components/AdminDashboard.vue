<template>
  <v-app>
    <v-app-bar app dark color="primary" elevation="4">
      <v-app-bar-title>
        <v-icon left>mdi-trophy</v-icon>
        Sweepstakes Admin
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <!-- Stats Cards -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-card color="primary" dark>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-account-multiple</v-icon>
                  <div>
                    <div class="text-h4">{{ totalEntries }}</div>
                    <div class="text-subtitle-1">Total Entries</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="success" dark>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-trophy-award</v-icon>
                  <div>
                    <div class="text-h4">{{ winners }}</div>
                    <div class="text-subtitle-1">Winners</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="info" dark>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-calendar-today</v-icon>
                  <div>
                    <div class="text-h4">{{ todayEntries }}</div>
                    <div class="text-subtitle-1">Today's Entries</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card color="warning" dark>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-percent</v-icon>
                  <div>
                    <div class="text-h4">{{ winRate }}%</div>
                    <div class="text-subtitle-1">Win Rate</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mb-4">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <v-icon left>mdi-lightning-bolt</v-icon>
                Quick Actions
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      block
                      size="large"
                      color="success"
                      :loading="isDrawing"
                      @click="drawWinner"
                      :disabled="totalEntries === 0"
                    >
                      <v-icon left>mdi-dice-6</v-icon>
                      Draw Winner
                    </v-btn>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      block
                      size="large"
                      color="info"
                      :loading="isExporting"
                      @click="exportToCSV"
                      :disabled="totalEntries === 0"
                    >
                      <v-icon left>mdi-download</v-icon>
                      Export CSV
                    </v-btn>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-btn
                      block
                      size="large"
                      color="error"
                      @click="confirmClearDatabase"
                      :disabled="totalEntries === 0"
                    >
                      <v-icon left>mdi-delete-sweep</v-icon>
                      Clear Database
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card v-if="lastWinner" color="success" dark>
              <v-card-title>
                <v-icon left>mdi-trophy</v-icon>
                Latest Winner
              </v-card-title>
              <v-card-text>
                <div class="text-h6">{{ lastWinner.first_name }} {{ lastWinner.last_name }}</div>
                <div class="text-subtitle-2">{{ lastWinner.phone_number }}</div>
                <div class="text-caption">{{ formatDate(lastWinner.entry_date) }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Entries Table -->
        <v-card>
          <v-card-title>
            <v-icon left>mdi-table</v-icon>
            Sweepstakes Entries
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search entries..."
              single-line
              hide-details
              density="compact"
              class="mr-4"
              style="max-width: 300px;"
            ></v-text-field>
            <v-btn
              color="primary"
              @click="refreshEntries"
              :loading="isLoading"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="entries"
            :search="search"
            :loading="isLoading"
            loading-text="Loading entries..."
            no-data-text="No entries found"
            class="elevation-1"
            item-value="id"
            :items-per-page="25"
          >
            <template v-slot:item.is_winner="{ item }">
              <v-chip
                :color="item.is_winner ? 'success' : 'default'"
                size="small"
              >
                <v-icon left size="small">
                  {{ item.is_winner ? 'mdi-trophy' : 'mdi-account' }}
                </v-icon>
                {{ item.is_winner ? 'Winner' : 'Entry' }}
              </v-chip>
            </template>
            
            <template v-slot:item.entry_date="{ item }">
              {{ formatDate(item.entry_date) }}
            </template>
            
            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="!item.is_winner"
                size="small"
                color="success"
                @click="markAsWinner(item)"
              >
                <v-icon>mdi-trophy</v-icon>
              </v-btn>
              <v-btn
                size="small"
                color="error"
                @click="deleteEntry(item)"
                class="ml-2"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
          Are you sure you want to clear all entries from the database? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showClearDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            @click="clearDatabase"
            :loading="isClearing"
          >
            Clear Database
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Winner Announcement Dialog -->
    <v-dialog v-model="showWinnerDialog" max-width="600px">
      <v-card v-if="selectedWinner">
        <v-card-title class="text-h4 text-center pa-6">
          <v-icon size="60" color="success" class="mb-4">mdi-trophy</v-icon>
          <div>Congratulations!</div>
        </v-card-title>
        <v-card-text class="text-center pa-6">
          <div class="text-h5 mb-2">{{ selectedWinner.first_name }} {{ selectedWinner.last_name }}</div>
          <div class="text-h6 mb-4">{{ selectedWinner.phone_number }}</div>
          <div class="text-body-1">You are our lucky winner!</div>
        </v-card-text>
        <v-card-actions class="justify-center pa-6">
          <v-btn
            color="primary"
            size="large"
            @click="closeWinnerDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="bottom"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          text
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase, type SweepstakesEntry } from '@/lib/supabase'

// Reactive state
const entries = ref<SweepstakesEntry[]>([])
const search = ref('')
const isLoading = ref(false)
const isDrawing = ref(false)
const isExporting = ref(false)
const isClearing = ref(false)
const showClearDialog = ref(false)
const showWinnerDialog = ref(false)
const selectedWinner = ref<SweepstakesEntry | null>(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Table headers
const headers = [
  { title: 'Name', key: 'first_name', value: (item: SweepstakesEntry) => `${item.first_name} ${item.last_name}` },
  { title: 'Phone', key: 'phone_number' },
  { title: 'Entry Date', key: 'entry_date' },
  { title: 'Source', key: 'entry_source' },
  { title: 'Status', key: 'is_winner' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Computed properties
const totalEntries = computed(() => entries.value.length)
const winners = computed(() => entries.value.filter(entry => entry.is_winner).length)
const todayEntries = computed(() => {
  const today = new Date().toDateString()
  return entries.value.filter(entry => 
    new Date(entry.entry_date).toDateString() === today
  ).length
})
const winRate = computed(() => {
  if (totalEntries.value === 0) return 0
  return Math.round((winners.value / totalEntries.value) * 100)
})
const lastWinner = computed(() => {
  const winnerEntries = entries.value.filter(entry => entry.is_winner)
  return winnerEntries.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
})

// Methods
const showSnackbar = (message: string, color: string = 'success') => {
  snackbar.value = { show: true, message, color }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const fetchEntries = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('sweepstakes_entries')
      .select('*')
      .order('entry_date', { ascending: false })

    if (error) throw error
    entries.value = data || []
  } catch (error) {
    console.error('Error fetching entries:', error)
    showSnackbar('Error fetching entries', 'error')
  } finally {
    isLoading.value = false
  }
}

const refreshEntries = () => {
  fetchEntries()
}

const drawWinner = async () => {
  isDrawing.value = true
  try {
    const availableEntries = entries.value.filter(entry => !entry.is_winner)
    if (availableEntries.length === 0) {
      showSnackbar('No available entries to draw from', 'warning')
      return
    }

    const randomIndex = Math.floor(Math.random() * availableEntries.length)
    const winner = availableEntries[randomIndex]
    
    await markAsWinner(winner)
    selectedWinner.value = winner
    showWinnerDialog.value = true
  } catch (error) {
    console.error('Error drawing winner:', error)
    showSnackbar('Error drawing winner', 'error')
  } finally {
    isDrawing.value = false
  }
}

const markAsWinner = async (entry: SweepstakesEntry) => {
  try {
    const { error } = await supabase
      .from('sweepstakes_entries')
      .update({ 
        is_winner: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', entry.id)

    if (error) throw error
    
    // Update local state
    const index = entries.value.findIndex(e => e.id === entry.id)
    if (index !== -1) {
      entries.value[index].is_winner = true
      entries.value[index].updated_at = new Date().toISOString()
    }
    
    showSnackbar(`${entry.first_name} ${entry.last_name} marked as winner!`)
  } catch (error) {
    console.error('Error marking as winner:', error)
    showSnackbar('Error marking as winner', 'error')
  }
}

const deleteEntry = async (entry: SweepstakesEntry) => {
  if (!confirm(`Are you sure you want to delete ${entry.first_name} ${entry.last_name}?`)) {
    return
  }

  try {
    const { error } = await supabase
      .from('sweepstakes_entries')
      .delete()
      .eq('id', entry.id)

    if (error) throw error
    
    // Remove from local state
    const index = entries.value.findIndex(e => e.id === entry.id)
    if (index !== -1) {
      entries.value.splice(index, 1)
    }
    
    showSnackbar(`${entry.first_name} ${entry.last_name} deleted`)
  } catch (error) {
    console.error('Error deleting entry:', error)
    showSnackbar('Error deleting entry', 'error')
  }
}

const exportToCSV = async () => {
  isExporting.value = true
  try {
    const csvContent = [
      ['First Name', 'Last Name', 'Phone Number', 'Entry Date', 'Source', 'Is Winner', 'Notes'].join(','),
      ...entries.value.map(entry => [
        entry.first_name,
        entry.last_name,
        entry.phone_number,
        entry.entry_date,
        entry.entry_source,
        entry.is_winner ? 'Yes' : 'No',
        entry.notes || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sweepstakes_entries_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showSnackbar('CSV exported successfully!')
  } catch (error) {
    console.error('Error exporting CSV:', error)
    showSnackbar('Error exporting CSV', 'error')
  } finally {
    isExporting.value = false
  }
}

const confirmClearDatabase = () => {
  showClearDialog.value = true
}

const clearDatabase = async () => {
  isClearing.value = true
  try {
    const { error } = await supabase
      .from('sweepstakes_entries')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (error) throw error
    
    entries.value = []
    showClearDialog.value = false
    showSnackbar('Database cleared successfully!')
  } catch (error) {
    console.error('Error clearing database:', error)
    showSnackbar('Error clearing database', 'error')
  } finally {
    isClearing.value = false
  }
}

const closeWinnerDialog = () => {
  showWinnerDialog.value = false
  selectedWinner.value = null
}

// Lifecycle
onMounted(() => {
  fetchEntries()
})
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
</style>
