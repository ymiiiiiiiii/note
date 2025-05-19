import { reactive } from 'vue'

export const store = reactive({
  notes: [],
  categories: ['视频感悟', '文章思考', 'AI工具学习'],
  selectedNotes: new Set(), // 用于存储选中的笔记ID
  addNote(note) {
    this.notes.push({
      ...note,
      id: Date.now(),
      createdAt: new Date().toISOString()
    })
    // 保存到 localStorage
    this.saveToStorage()
  },
  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id)
    this.saveToStorage()
  },
  saveToStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes))
  },
  loadFromStorage() {
    const saved = localStorage.getItem('notes')
    if (saved) {
      this.notes = JSON.parse(saved)
    }
  },
  toggleNoteSelection(id) {
    if (this.selectedNotes.has(id)) {
      this.selectedNotes.delete(id)
    } else {
      this.selectedNotes.add(id)
    }
  },

  deleteSelectedNotes() {
    this.notes = this.notes.filter(note => !this.selectedNotes.has(note.id))
    this.selectedNotes.clear()
    this.saveToStorage()
  },

  clearSelection() {
    this.selectedNotes.clear()
  },
  toggleSelectAll() {
    if (this.selectedNotes.size === this.notes.length) {
      // 如果全部选中，则取消全选
      this.selectedNotes.clear()
    } else {
      // 否则全选
      this.selectedNotes = new Set(this.notes.map(note => note.id))
    }
  },
})