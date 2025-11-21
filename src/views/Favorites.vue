<template>
  <Layout>
    <div class="favorites-container">
      <div class="container">
        <h2>我的收藏</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="articles.length === 0" class="empty">暂无收藏</div>
        <div v-else class="articles-list">
          <article v-for="article in articles" :key="article.articleId" class="article-card">
            <div v-if="article.coverImage" class="cover-image">
              <img :src="article.coverImage" alt="cover" />
            </div>
            <div class="article-content">
              <div class="article-header">
                <h3 @click="goToDetail(article.articleId)" class="title">
                  {{ article.title }}
                </h3>
                <button @click="removeFavorite(article.articleId)" class="remove-btn" title="取消收藏">
                  取消收藏
                </button>
              </div>
              <p class="summary">{{ article.summary || article.content?.substring(0, 100) }}</p>
              <div class="meta">
                <span class="tag">{{ article.tagName }}</span>
                <span class="date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                <span class="views">阅读 {{ article.viewCount || 0 }}</span>
                <span class="likes">点赞 {{ article.likeCount || 0 }}</span>
              </div>
            </div>
          </article>
        </div>
        <div v-if="total > pageSize" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页</span>
          <button @click="nextPage" :disabled="currentPage >= Math.ceil(total / pageSize)">
            下一页
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getFavoriteList, toggleArticleFavorite } from '@/api/favorite'
import Layout from '@/components/Layout.vue'

const router = useRouter()
const userStore = useUserStore()

const articles = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadFavorites = async () => {
  loading.value = true
  try {
    const res = await getFavoriteList({
      userId: userStore.userInfo.userId,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    if (res.code === 1) {
      articles.value = res.data.rows || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载收藏失败:', error)
  } finally {
    loading.value = false
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadFavorites()
    window.scrollTo(0, 0)
  }
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(total.value / pageSize.value)) {
    currentPage.value++
    loadFavorites()
    window.scrollTo(0, 0)
  }
}

const goToDetail = (id) => {
  router.push(`/article/${id}`)
}

// 取消收藏
const removeFavorite = async (articleId) => {
  if (!confirm('确定要取消收藏这篇文章吗？')) {
    return
  }
  try {
    const res = await toggleArticleFavorite({
      articleId: articleId,
      userId: userStore.userInfo.userId,
    })
    if (res.code === 1) {
      // 重新获取收藏列表，确保数据一致性
      await loadFavorites()
      // 如果当前页没有数据了，且不是第一页，跳转到上一页
      if (articles.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
        await loadFavorites()
      }
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
    alert('取消收藏失败，请重试')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split(' ')[0]
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
.favorites-container {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
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

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 10px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
  flex: 1;
}

.title:hover {
  color: #409eff;
}

.remove-btn {
  padding: 6px 12px;
  background: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #f78989;
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

