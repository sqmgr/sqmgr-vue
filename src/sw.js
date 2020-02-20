/*
Copyright 2020 Tom Peters

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

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

self.addEventListener("message", event => {
    if (event.data && event.data === 'skipWaiting') {
        self.skipWaiting()
    }
})

clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

registerRoute(
    new RegExp('^https://[^.]+.fontawesome.com/'),
    new NetworkFirst({
        cacheName: 'font-awesome',
    }),
)

// following two are recipes from: https://developers.google.com/web/tools/workbox/guides/common-recipes

registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
)

registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
)
