<template>
  <div class="max-w-2xl mx-auto p-6">
    <header class="mb-8">
      <router-link to="/" class="text-gray-500 hover:text-gray-700 mb-4 inline-block">&larr; Back to List</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
        {{ isEditing ? 'Edit Diary' : 'New Entry' }}
      </h1>
    </header>

    <form @submit.prevent="saveDiary" class="space-y-6">
      
      <!-- Date Picker -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
        <input 
          type="date" 
          v-model="form.date"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        >
      </div>

      <!-- Mood Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How are you feeling?</label>
        <div class="flex space-x-4 mb-6">
          <button 
            type="button"
            v-for="score in 5" 
            :key="score"
            @click="form.mood_score = score"
            :class="[
              'text-3xl p-3 rounded-full transition transform hover:scale-110',
              form.mood_score === score ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ getMoodEmoji(score) }}
          </button>
        </div>
      </div>

      <!-- Weather & Temperature -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center gap-2">
            <span>Weather</span>
            <button
              type="button"
              @click="fetchWeatherForLocation"
              class="shrink-0 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition whitespace-nowrap"
              :disabled="weatherLoading"
            >
              {{ weatherLoading ? 'Loading...' : '📍 Get / Refresh' }}
            </button>
          </label>
          <select 
            v-model="form.weather"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="sunny">☀️ Sunny</option>
            <option value="cloudy">☁️ Cloudy</option>
            <option value="rainy">🌧️ Rainy</option>
            <option value="snowy">❄️ Snowy</option>
            <option value="windy">💨 Windy</option>
          </select>
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temp (°C)</label>
           <input 
             type="number" 
             v-model="form.temperature"
             class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
             placeholder="24"
           >
        </div>
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dear Diary...</label>
        <textarea 
          v-model="form.content"
          rows="10" 
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
          placeholder="Write your thoughts here..."
          required
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition shadow-lg flex items-center"
        >
          <span v-if="loading" class="animate-spin mr-2">⏳</span>
          Save Entry
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDiaryStore } from '../stores/diary';
import { fetchCurrentWeather } from '../utils/weather';

const router = useRouter();
const route = useRoute();
const store = useDiaryStore();

const isEditing = ref(false);
const loading = ref(false);

const form = ref({
  date: new Date().toISOString().split('T')[0],
  mood_score: 3,
  weather: 'sunny',
  temperature: null,
  content: ''
});

function getMoodEmoji(score) {
  const emojis = { 1: '😢', 2: '😟', 3: '😐', 4: '🙂', 5: '😄' };
  return emojis[score] || '😐';
}

onMounted(() => {
  // Check if editing existing entry
  if (route.params.id) {
    isEditing.value = true;
    const diary = store.getDiaryById(route.params.id);
    if (diary) {
      form.value = {
        date: diary.date,
        mood_score: diary.mood_score,
        weather: diary.weather || 'sunny',
        temperature: diary.temperature,
        content: diary.content
      };
    } else {
      router.push('/');
    }
  } 
  // Check if creating for specific date
  else {
    if (route.query.date) {
      form.value.date = route.query.date;
    }
    
    // Auto-fetch weather if date is today (and no manual override yet)
    const todayStr = new Date().toISOString().split('T')[0];
    if (form.value.date === todayStr && !form.value.temperature) {
      fetchWeatherForLocation();
    }
  }
});

const weatherLoading = ref(false);

async function fetchWeatherForLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  
  weatherLoading.value = true;
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const weatherData = await fetchCurrentWeather(latitude, longitude);
      if (weatherData) {
        form.value.weather = weatherData.weather;
        form.value.temperature = weatherData.temperature;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch weather data.");
    } finally {
      weatherLoading.value = false;
    }
  }, (err) => {
    weatherLoading.value = false;
    console.warn("Geolocation warning:", err);
    // Common errors: 1=Denied, 2=Unavailable, 3=Timeout
    if (err.code === 1) {
      alert("Location access denied. Please enable it in browser settings to auto-fetch weather.");
    } else {
      alert("Could not retrieve location.");
    }
  });
}

async function saveDiary() {
  loading.value = true;
  
  if (isEditing.value) {
    store.updateDiary(route.params.id, form.value);
  } else {
    store.addDiary(form.value);
  }
  
  // Simulate network delay
  await new Promise(r => setTimeout(r, 500));
  
  loading.value = false;
  router.push('/');
}
</script>
