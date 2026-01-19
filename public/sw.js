/*
Copyright 2026 Tom Peters

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Kill switch service worker - clears caches and unregisters itself
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', async () => {
  // Clear all caches
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))

  // Claim clients so this takes effect immediately
  await self.clients.claim()

  // Unregister this service worker
  await self.registration.unregister()

  // Reload all open tabs to get fresh content
  const clients = await self.clients.matchAll({ type: 'window' })
  clients.forEach(client => client.navigate(client.url))
})
