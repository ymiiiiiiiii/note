<template>
  <div class="search-bar">
    <input
      v-model="searchText"
      @input="emitSearch"
      type="text"
      placeholder="搜索笔记..."
      class="search-input"
    />
    <select
      v-model="selectedCategory"
      @change="emitSearch"
      class="category-filter"
    >
      <option value="">所有分类</option>
      <option v-for="category in store.categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { store } from '../store/notes'

const searchText = ref('')
const selectedCategory = ref('')

const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', {
    text: searchText.value,
    category: selectedCategory.value
  })
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input,
.category-filter {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus,
.category-filter:focus {
  border-color: #4CAF50;
  outline: none;
}

.search-input {
  flex: 1;
}

.category-filter {
  width: 150px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .category-filter {
    width: 100%;
  }
  
  .search-input,
  .category-filter {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>