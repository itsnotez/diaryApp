<template>
  <div class="max-w-5xl mx-auto p-4 md:p-8">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <div class="flex items-center space-x-6">
        <button 
          @click="changeMonth(-1)" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          &larr;
        </button>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white min-w-[200px] text-center">
          {{ currentMonthName }} {{ currentYear }}
        </h1>
        <button 
          @click="changeMonth(1)" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          &rarr;
        </button>
      </div>

      <button 
        @click="handleWriteToday" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition shadow-md flex items-center gap-2"
      >
        <span>+</span> Write Today
      </button>
    </header>

    <!-- Calendar Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <!-- Days of Week -->
      <div class="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div 
          v-for="day in weekDays" 
          :key="day" 
          class="py-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Cells -->
      <div class="grid grid-cols-7 auto-rows-fr">
        <!-- Empty cells for start padding -->
        <div 
          v-for="n in startPadding" 
          :key="`pad-${n}`" 
          class="h-32 md:h-40 border-b border-r border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30"
        ></div>

        <!-- Days -->
        <div 
          v-for="day in daysInMonth" 
          :key="day"
          @click="handleDateClick(day)"
          class="relative h-32 md:h-40 border-b border-r border-gray-100 dark:border-gray-700 p-2 transition group cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50"
          :class="{'bg-blue-50/50': isToday(day)}"
        >
          <!-- Date Number -->
          <span 
            class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
            :class="isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'"
          >
            {{ day }}
          </span>

          <!-- Diary Entry Indicator -->
          <div v-if="getDiaryForDay(day)" class="mt-2 text-center">
            <div class="flex justify-center items-center gap-1 mb-1">
               <span class="text-xl transform group-hover:scale-110 transition duration-300">
                  {{ getMoodEmoji(getDiaryForDay(day).mood_score) }}
               </span>
               <span v-if="getDiaryForDay(day).weather" class="text-sm" :title="getDiaryForDay(day).weather">
                  {{ getWeatherIcon(getDiaryForDay(day).weather) }}
               </span>
            </div>
            <div v-if="getDiaryForDay(day).temperature" class="text-[0.65rem] text-gray-400 font-mono mb-1">
              {{ getDiaryForDay(day).temperature }}°C
            </div>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 px-1 text-left hidden md:block leading-tight">
              {{ getDiaryForDay(day).content }}
            </p>
            <!-- Mobile dot -->
            <div class="md:hidden w-2 h-2 mx-auto bg-blue-400 rounded-full mt-1"></div>
          </div>

          <!-- Hover 'Add' icon for empty days -->
          <div 
            v-else 
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
          >
            <span class="text-blue-200 dark:text-gray-600 text-4xl font-light">+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDiaryStore } from '../stores/diary';

const router = useRouter();
const store = useDiaryStore();

const currentDate = ref(new Date());
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' });
});

const startPadding = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return firstDay;
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

function changeMonth(delta) {
  currentDate.value = new Date(currentYear.value, currentMonth.value + delta, 1);
}

function isToday(day) {
  const today = new Date();
  return day === today.getDate() && 
         currentMonth.value === today.getMonth() && 
         currentYear.value === today.getFullYear();
}

function getDateString(day) {
  const month = (currentMonth.value + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${currentYear.value}-${month}-${d}`;
}

function getDiaryForDay(day) {
  return store.getDiaryByDate(getDateString(day));
}

function getMoodEmoji(score) {
  const emojis = { 1: '😢', 2: '😟', 3: '😐', 4: '🙂', 5: '😄' };
  return emojis[score] || '😐';
}

function getWeatherIcon(weather) {
  const icons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨'
  };
  return icons[weather?.toLowerCase()] || '🌤️';
}

function handleWriteToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const diary = store.getDiaryByDate(dateStr);
  
  if (diary) {
    router.push(`/write/${diary.id}`);
  } else {
    router.push(`/write?date=${dateStr}`);
  }
}

function handleDateClick(day) {
  const dateStr = getDateString(day);
  const diary = getDiaryForDay(day);
  
  if (diary) {
    router.push(`/write/${diary.id}`);
  } else {
    router.push(`/write?date=${dateStr}`);
  }
}
</script>
