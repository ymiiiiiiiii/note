<template>
  <div class="note-detail" v-if="note">
    <div class="detail-header">
      <button class="back-btn" @click="$emit('close')">返回</button>
      <h2>{{ note.title }}</h2>
    </div>
    <div class="detail-meta">
      <span class="category" :class="note.category">{{ note.category }}</span>
      <span class="date">{{ formatDate(note.createdAt) }}</span>
    </div>
    <div class="detail-content">
      <p>{{ note.content }}</p>
      <a v-if="note.link" :href="note.link" target="_blank" class="link">相关链接</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

defineEmits(['close'])
</script>

<style scoped>
.note-detail {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-header h2 {
  margin: 0;
  flex: 1;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  max-width: 100%;
  font-size: clamp(1rem, 1.2rem, 1.5rem);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .detail-header h2 {
    font-size: clamp(0.9rem, 1rem, 1.2rem);
  }
}

.back-btn {
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  /* font-size: 1.35rem; */
  padding: 0.375em 1em;
  font-weight: 600;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}

.back-btn:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
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

.date {
  color: #666;
  font-size: 0.9rem;
}

.detail-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  width: 100%;
  box-sizing: border-box;
}

.detail-content p {
  margin: 0;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}

.link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #2196F3;
  text-decoration: none;
  word-break: break-all;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .note-detail {
    padding: 1rem;
  }

  .detail-content {
    font-size: 1rem;
  }

  .detail-header h2 {
    font-size: 1.2rem;
  }

  .detail-meta {
    gap: 0.5rem;
  }
}
</style>