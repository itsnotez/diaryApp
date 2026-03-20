import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDiaryStore = defineStore('diary', () => {
  // State
  const diaries = ref([
    { id: 1, content: "Today was a productive day. I started the MindLog project!", mood_score: 5, weather: 'sunny', temperature: 24, date: new Date().toISOString().split('T')[0], created_at: new Date() },
    { id: 2, content: "Feeling a bit tired but excited about the progress.", mood_score: 3, weather: 'rainy', temperature: 18, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 86400000) }
  ]);
  const selectedDate = ref(new Date());
  const moodScore = ref(null);

  // Actions
  function setDate(date) {
    selectedDate.value = date;
  }

  function setMood(mood) {
    moodScore.value = mood;
  }

  function getDiaryById(id) {
    return diaries.value.find(d => d.id === Number(id));
  }

  function getDiaryByDate(dateString) {
    return diaries.value.find(d => d.date === dateString);
  }

  function addDiary(diary) {
    const newId = diaries.value.length > 0 ? Math.max(...diaries.value.map(d => d.id)) + 1 : 1;
    diaries.value.unshift({
      ...diary,
      id: newId,
      created_at: new Date()
    });
  }

  function updateDiary(id, updatedFields) {
    const index = diaries.value.findIndex(d => d.id === Number(id));
    if (index !== -1) {
      diaries.value[index] = { ...diaries.value[index], ...updatedFields };
    }
  }

  function resetDailyEntry() {
    moodScore.value = null;
  }

  return {
    diaries,
    selectedDate,
    moodScore,
    setDate,
    setMood,
    getDiaryById,
    getDiaryByDate,
    addDiary,
    updateDiary,
    resetDailyEntry,
  };
});
