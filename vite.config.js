/*
Copyright 2019 Tom Peters

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || pkg.version),
  },
  plugins: [
    vue(),
    Sitemap({
      hostname: 'https://sqmgr.com',
      dynamicRoutes: [
        '/',
        '/about',
        '/resources',
        '/resources/how-football-squares-work',
        '/resources/setting-up-a-pool',
        '/resources/linking-live-events-and-payouts',
        '/resources/multiple-games-and-rollover',
        '/resources/best-numbers-in-football-squares',
        '/resources/super-bowl-squares',
        '/terms',
        '/privacy',
        '/cookies',
        '/tipjar',
        '/login',
      ],
      changefreq: 'hourly',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
    port: 8080,
  },
})
