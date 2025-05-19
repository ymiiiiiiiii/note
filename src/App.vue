<script setup>
import NoteEditor from './components/NoteEditor.vue'
import NoteList from './components/NoteList.vue'
import SearchBar from './components/SearchBar.vue'
import { store } from './store/notes'
import { ref, onMounted } from 'vue'

const searchText = ref('')
const selectedCategory = ref('')

const handleSearch = ({ text, category }) => {
  searchText.value = text
  selectedCategory.value = category
}

onMounted(() => {
  store.loadFromStorage()
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>个人笔记本</h1>
    </header>

    <div class="main-content">
      <div class="sidebar">
        <NoteEditor />
      </div>

      <div class="content">
        <SearchBar @search="handleSearch" />
        <NoteList :searchText="searchText" :selectedCategory="selectedCategory" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #4CAF50;
  --background-color: #f5f5f5;
  --text-color: #333;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: var(--text-color);
  font-size: 2rem;
  margin: 0;
}

.main-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

@media (max-width: 768px) {
  .app {
    padding: 0.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .main-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .sidebar {
    position: static;
  }
}
</style>
