<template>
  <Layout>
    <div class="home-container">
      <div class="container">
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="搜索文章、用户..." @keyup.enter="goToSearch" />
          <button @click="goToSearch">搜索</button>
        </div>

        <div class="content">
          <div class="article-list">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="articles.length === 0" class="empty">暂无文章</div>
            <article v-for="article in articles" :key="article.articleId" class="article-card">
              <div v-if="article.coverImage" class="cover-image">
                <img :src="article.coverImage" alt="cover" />
              </div>
              <div class="article-content">
                <h3 @click="goToDetail(article.articleId)" class="title">
                  {{ article.title }}
                </h3>
                <p class="summary">{{ article.summary || article.content?.substring(0, 100) }}</p>
                <div class="meta">
                  <span class="tag">{{ article.tagName }}</span>
                  <span class="author">作者: {{ article.userId }}</span>
                  <span class="date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                  <span class="views">阅读 {{ article.viewCount || 0 }}</span>
                  <span class="likes">点赞 {{ article.likeCount || 0 }}</span>
                </div>
              </div>
            </article>

            <div v-if="total > pageSize" class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
              <span>第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页</span>
              <button @click="nextPage" :disabled="currentPage >= Math.ceil(total / pageSize)">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article'
import Layout from '@/components/Layout.vue'

const router = useRouter()

const articles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 添加搜索跳转方法
const goToSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const params = {
      status: 1, // 只查询已发布的文章
      isDeleted: 0,
      page: currentPage.value,
      pageSize: pageSize.value,
    }
    if (searchQuery.value) {
      params.query = searchQuery.value
    }
    const res = await getArticleList(params)
    if (res.code === 1) {
      articles.value = res.data.rows || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadArticles()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadArticles()
    window.scrollTo(0, 0)
  }
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(total.value / pageSize.value)) {
    currentPage.value++
    loadArticles()
    window.scrollTo(0, 0)
  }
}

const goToDetail = (id) => {
  router.push(`/article/${id}`)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split(' ')[0]
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 20px 0;
}

.search-bar input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-bar input:focus {
  outline: none;
  border-color: #409eff;
}

.search-bar button {
  padding: 12px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar button:hover {
  background: #66b1ff;
}

.content {
  display: flex;
  gap: 20px;
}

.article-list {
  flex: 1;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
}

.cover-image {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.title:hover {
  color: #409eff;
}

.summary {
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #999;
}

.tag {
  background: #ecf5ff;
  color: #409eff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
}

.pagination button {
  padding: 8px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #66b1ff;
}
</style>
