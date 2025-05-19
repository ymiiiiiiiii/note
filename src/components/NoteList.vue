<template>
  <div class="note-list" v-if="!selectedNote">
    <div class="del_btn" v-if="isDeleteMode">
      <label class="container select-all">
        <input type="checkbox" :checked="store.selectedNotes.size === store.notes.length && store.notes.length > 0"
          @change="store.toggleSelectAll()">
        <span class="checkmark"></span>
        <span>全选</span>
      </label>
	  <!-- 删除 -->
      <button @click="deleteSelected" class="learn-more" :disabled="store.selectedNotes.size === 0">
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="learn-more-text">删除选中({{ store.selectedNotes.size }})</span>
      </button>
	  <!--退出 -->
      <button @click="exitDeleteMode" class="batch-delete-btn">
        退出删除模式
      </button>
    </div>

    <button v-if="!isDeleteMode" @click="enterDeleteMode" class="enter-delete-mode-btn normal-mode">
      <span class="button_lg">
        <span class="button_sl"></span>
        <span class="button_text">删除模式</span>
      </span>
    </button>

    <div v-for="note in filteredNotes" :key="note.id" class="note-item" @touchstart="startLongPress(note)"
      @touchend="cancelLongPress">
      <div class="note-header">
        <label class="container" v-if="isDeleteMode">
          <input type="checkbox" :checked="store.selectedNotes.has(note.id)"
            @change="store.toggleNoteSelection(note.id)">
          <span class="checkmark"></span>
        </label>
        <h3 @click="openNoteDetail(note)">{{ note.title }}</h3>
      </div>
      <div class="note-meta">
        <span class="category" :class="note.category">{{ note.category }}</span>
        <span class="date">{{ formatDate(note.createdAt) }}</span>
      </div>
      <p class="content" @click="openNoteDetail(note)" v-if="!isDeleteMode">{{ truncateContent(note.content) }}</p>
      <a v-if="note.link" :href="note.link" target="_blank" class="link">相关链接</a>
      <button @click="deleteNote(note.id)" class="delete-btn delete-mode" v-if="isDeleteMode">删除</button>
    </div>
  </div>
  <note-detail v-else :note="selectedNote" @close="selectedNote = null" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { store } from '../store/notes'
import NoteDetail from './NoteDetail.vue'

const longPressTimeout = ref(null);
const isDeleteMode = ref(false);

const startLongPress = (note) => {
  longPressTimeout.value = setTimeout(() => {
    isDeleteMode.value = true
  }, 500) // 500ms for long press
}
const cancelLongPress = () => {
  clearTimeout(longPressTimeout.value)
}

const exitDeleteMode = () => {
  isDeleteMode.value = false
  if (store.clearSelectedNotes) {
    store.clearSelectedNotes()
  } else {
    console.warn('clearSelectedNotes function is not defined in store')
  }
}

const props = defineProps({
  searchText: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: ''
  }
})

const filteredNotes = computed(() => {
  return store.notes.filter(note => {
    const matchesSearch = props.searchText
      ? note.title.toLowerCase().includes(props.searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(props.searchText.toLowerCase())
      : true

    const matchesCategory = props.selectedCategory
      ? note.category === props.selectedCategory
      : true

    return matchesSearch && matchesCategory
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const deleteNote = (id) => {
  if (confirm('确定要删除这条笔记吗？')) {
    store.deleteNote(id)
  }
}

const deleteSelected = () => {
  if (confirm(`确定要删除选中的 ${store.selectedNotes.size} 条笔记吗？`)) {
    store.deleteSelectedNotes()
  }
}

const selectedNote = ref(null)

const truncateContent = (content) => {
  const isMobile = window.innerWidth <= 768
  const maxLength = isMobile ? 50 : 100
  return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
}

// Watch for window resize to adjust content length
const updateTruncateLength = () => {
  // Trigger view update
  filteredNotes.value = [...filteredNotes.value]
}

onMounted(() => {
  window.addEventListener('resize', updateTruncateLength)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTruncateLength)
})

const openNoteDetail = (note) => {
  selectedNote.value = note
  isDeleteMode.value = false // 确保在打开详情页时退出删除模式
}
const enterDeleteMode = () => {
  isDeleteMode.value = true;
}

</script>

<style scoped>
.note-list {
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.note-item {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  margin-bottom: 1rem;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.note-header h3 {
  margin: 0;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}

.content {
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.5;
  margin: 0.75rem 0;
}

.note-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.75rem 0;
  align-items: center;
}

.category {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 100%;
  overflow-wrap: break-word;
}

.link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #1976d2;
  text-decoration: none;
  word-break: break-all;
}

@media (max-width: 768px) {
  .note-item {
    padding: 1rem;
  }

  .note-meta {
    flex-wrap: wrap;
  }

  .category {
    width: auto;
    max-width: 100%;
    margin-bottom: 0.25rem;
  }

  .content {
    width: 100%;
    box-sizing: border-box;
    font-size: 0.9rem;
  }

  .batch-actions {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .batch-delete-btn {
    width: 100%;
  }

  .note-header h3 {
    font-size: 1rem;
  }
}

.note-item:hover {
  transform: translateY(-2px);
}

.note-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.75rem 0;
  align-items: center;
}

.category {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.category.视频感悟 {
  background: #fff3e0;
  color: #e65100;
}

.category.文章思考 {
  background: #e8f5e9;
  color: #2e7d32;
}

.category.AI工具学习 {
  background: #e3f2fd;
  color: #1565c0;
}

.delete-mode {
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  padding: 0.375em 1em;
  font-weight: 600;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}

.delete-mode:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
}


.normal-mode {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  background: none;
  color: #0f1923;
  cursor: pointer;
  position: relative;
  padding: 8px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
  transition: all .15s ease;
}

.normal-mode::before,
.normal-mode::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  left: 0;
  height: calc(50% - 5px);
  border: 1px solid #7D8082;
  transition: all .15s ease;
}

.normal-mode::before {
  top: 0;
  border-bottom-width: 0;
}

.normal-mode::after {
  bottom: 0;
  border-top-width: 0;
}

.normal-mode:active,
.normal-mode:focus {
  outline: none;
}

.normal-mode:active::before,
.normal-mode:active::after {
  right: 3px;
  left: 3px;
}

.normal-mode:active::before {
  top: 3px;
}

.normal-mode:active::after {
  bottom: 3px;
}

.button_lg {
  position: relative;
  display: block;
  padding: 10px 20px;
  color: #fff;
  background-color: #0f1923;
  overflow: hidden;
  box-shadow: inset 0px 0px 0px 1px transparent;
}

.button_lg::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 2px;
  background-color: #0f1923;
}

.button_lg::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 4px;
  height: 4px;
  background-color: #0f1923;
  transition: all .2s ease;
}

.button_sl {
  display: block;
  position: absolute;
  top: 0;
  bottom: -1px;
  left: -8px;
  width: 0;
  background-color: #ff4655;
  transform: skew(-15deg);
  transition: all .2s ease;
}

.button_text {
  position: relative;
}

.normal-mode:hover {
  color: #0f1923;
}

.normal-mode:hover .button_sl {
  width: calc(100% + 15px);
}

.normal-mode:hover .button_lg::after {
  background-color: #fff;
}

.del_btn {
  margin-bottom: 0.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .del_btn {
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
}


/* 全选单选框 */
.container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
  display: flex;
  align-items: center;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: #ccc;
  border-radius: 100%;
  background: #e8e8e8;
  box-shadow: 3px 3px 5px #c5c5c5,
    -3px -3px 5px #ffffff;
  transition-duration: 0.5s;
  margin-right: 0.5em;
}

.container input:checked~.checkmark {
  box-shadow: inset 3px 3px 5px #c5c5c5,
    inset -3px -3px 5px #ffffff;
}

.checkmark:after {
  content: "";
  position: absolute;
  opacity: 0;
}

.container input:checked~.checkmark:after {
  opacity: 1;
}

.checkmark:after {
  left: 0.35em;
  top: 0.25em;
  width: 0.25em;
  height: 0.5em;
  border: solid darkgray;
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
}

/* 退出删除 */
.learn-more {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
}

.learn-more {
  width: 12rem;
  height: auto;
}

.learn-more .circle {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3rem;
  height: 3rem;
  background: #282936;
  border-radius: 1.625rem;
}

.learn-more .circle .icon {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
}

.learn-more .circle .icon.arrow {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  left: 0.625rem;
  width: 1.125rem;
  height: 0.125rem;
  background: none;
}

.learn-more .circle .icon.arrow::before {
  position: absolute;
  content: "";
  top: -0.29rem;
  right: 0.0625rem;
  width: 0.625rem;
  height: 0.625rem;
  border-top: 0.125rem solid #fff;
  border-right: 0.125rem solid #fff;
  transform: rotate(45deg);
}

.learn-more .learn-more-text {
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 0;
  margin: 0 0 0 1.85rem;
  color: #282936;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
}

.learn-more:hover .circle {
  width: 100%;
}

.learn-more:hover .circle .icon.arrow {
  background: #fff;
  transform: translate(1rem, 0);
}

.learn-more:hover .learn-more-text {
  color: #fff;
}
</style>