<template>
  <div class="note-editor">
    <input type="text" v-model="title" maxlength="50" placeholder="输入标题..." class="title-input" />
    <select v-model="category" class="category-select">
      <option value="">选择分类</option>
      <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
    </select>
    <textarea v-model="content" placeholder="输入笔记内容..." class="content-input"></textarea>
    <input v-model="link" placeholder="相关链接" class="link-input" />
    <button @click="saveNote" class="save-btn">保存</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../store/notes'

const title = ref('')
const content = ref('')
const category = ref('')
const link = ref('')

const saveNote = () => {
  if (!title.value || !content.value || !category.value) return

  store.addNote({
    title: title.value,
    content: content.value,
    category: category.value,
    link: link.value
  })

  // 清空输入
  title.value = ''
  content.value = ''
  category.value = ''
  link.value = ''
}
</script>

<style scoped>
.note-editor {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}

.title-input,
.category-select,
.content-input,
.link-input,
.save-btn {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s;
}

.content-input {
  min-height: 150px;
  resize: vertical;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.save-btn:hover {
  background: #45a049;
}

@media (max-width: 768px) {
  .note-editor {
    padding: 0.5rem;
  }

  .title-input,
  .category-select,
  .content-input,
  .link-input,
  .save-btn {
    font-size: 16px;
    padding: 0.5rem;
  }
}
</style>