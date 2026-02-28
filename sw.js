sw.js
// sw.js - 简单的 Service Worker，实现离线缓存
const CACHE_NAME = 'xiaohan-cache-v1';
// 需要预缓存的资源列表（相对于根路径）
const urlsToCache = [
  './',                     // 当前目录（即你的 HTML 文件）
  './index.html',           // 如果 HTML 文件名不是 index.html，请改成实际文件名
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://i.postimg.cc/GtsZ5wrG/1770993841232.jpg'  // 应用图标（同时作为备用图标）
];

// 安装事件：预缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求：缓存优先，网络作为后备
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，直接返回缓存
        if (response) {
          return response;
        }
        // 否则发起网络请求
        return fetch(event.request).then(
          networkResponse => {
            // 检查是否有效响应
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // 可选：将新资源加入缓存（但要注意缓存大小）
            // 这里简单起见，不自动缓存所有请求
            return networkResponse;
          }
        );
      })
  );
});
