var CACHE_NAME = 'samlau.me'
var urlsToCache = [
  '/',
  '/projects/2016-09-01-jupyterhub',
  '/projects/2017-09-01-nbinteract',
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          // console.log('Cache hit:', event.request.url)
          return response
        }

        return fetch(event.request).then(function(response) {
          // console.log('Cache miss:', event.request.url)
          if (event.request.method === 'GET') {
            cache.put(event.request, response.clone())
          }
          return response
        })
      })
    }),
  )
})
