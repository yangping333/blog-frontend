<template>
  <Layout>
    <div class="article-edit-container">
      <div class="container">
        <div class="edit-box">
          <h2>{{ isEdit ? '编辑文章' : '写文章' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>标题 *</label>
              <input v-model="form.title" type="text" required placeholder="请输入文章标题" />
            </div>
            <div class="form-group">
              <label>标签</label>
              <select v-model="form.tagId">
                <option value="">请选择标签</option>
                <option v-for="tag in tags" :key="tag.tagId" :value="tag.tagId">
                  {{ tag.tagName }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>封面图片</label>
              <div class="upload-area">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  style="display: none"
                />
                <button type="button" @click="$refs.fileInput.click()" class="upload-btn">
                  选择图片
                </button>
                <div v-if="form.coverImage" class="preview">
                  <img :src="form.coverImage" alt="preview" />
                  <button type="button" @click="form.coverImage = ''" class="remove-btn">删除</button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>摘要</label>
              <textarea
                v-model="form.summary"
                rows="3"
                placeholder="请输入文章摘要（可选）"
              ></textarea>
            </div>
            <div class="form-group">
              <label>内容 *</label>
              <textarea
                v-model="form.content"
                rows="15"
                required
                placeholder="请输入文章内容"
              ></textarea>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="form.status">
                <option :value="0">草稿</option>
                <option :value="1">发布</option>
              </select>
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div class="actions">
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? '保存中...' : isEdit ? '更新' : '发布' }}
              </button>
              <router-link to="/" class="cancel-btn">取消</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getArticleById, addArticle, updateArticle } from '@/api/article'
import { getTagList } from '@/api/tag'
import { uploadImage } from '@/api/upload'
import Layout from '@/components/Layout.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  tagId: '',
  coverImage: '',
  summary: '',
  content: '',
  status: 1,
})

const tags = ref([])
const loading = ref(false)
const errorMessage = ref('')

const loadTags = async () => {
  try {
    const res = await getTagList({ status: 1, page: 1, pageSize: 100 })
    if (res.code === 1) {
      tags.value = res.data.rows || []
    }
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

const loadArticle = async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const res = await getArticleById(route.params.id)
    if (res.code === 1) {
      const data = res.data
      form.value = {
        title: data.title || '',
        tagId: data.tagId || '',
        coverImage: data.coverImage || '',
        summary: data.summary || '',
        content: data.content || '',
        status: data.status || 0,
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    errorMessage.value = '加载文章失败'
  } finally {
    loading.value = false
  }
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  loading.value = true
  try {
    const res = await uploadImage(file)
    if (res.code === 1) {
      form.value.coverImage = res.data
    }
  } catch (error) {
    console.error('上传失败:', error)
    errorMessage.value = '图片上传失败'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const articleData = {
      userId: userStore.userInfo.userId,
      title: form.value.title,
      content: form.value.content,
      summary: form.value.summary,
      coverImage: form.value.coverImage,
      status: form.value.status,
    }

    if (form.value.tagId) {
      articleData.tagId = form.value.tagId
    }

    if (form.value.status === 1) {
      articleData.publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    let res
    if (isEdit.value) {
      articleData.articleId = parseInt(route.params.id)
      res = await updateArticle(articleData)
    } else {
      res = await addArticle(articleData)
    }

    if (res.code === 1) {
      router.push('/')
    } else {
      errorMessage.value = res.msg || '保存失败'
    }
  } catch (error) {
    errorMessage.value = error.message || '保存失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTags()
  if (isEdit.value) {
    loadArticle()
  }
})
</script>

<style scoped>
.article-edit-container {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.edit-box {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #409eff;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-btn {
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
}

.upload-btn:hover {
  background: #e6e6e6;
}

.preview {
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.submit-btn {
  padding: 12px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #66b1ff;
}

.submit-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #e6e6e6;
}
</style>

