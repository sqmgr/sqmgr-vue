/*
Copyright 2019 Tom Peters

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

const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    configureWebpack: {
        devtool: 'eval-source-map',
        plugins: [
            new SitemapWebpackPlugin({
                base: 'https://sqmgr.com',
                paths: [
                    {
                        path: '/',
                        priority: 0.9,
                    },
                    {
                        path: '/about',
                        priority: 0.8,
                    },
                    '/terms',
                    '/private',
                    '/cookies',
                    '/donate',
                    '/login',
                ],
                options: {
                    lastMod: true,
                    changeFreq: 'hourly',
                },
            }),
            new WorkboxPlugin.InjectManifest({

                swSrc: './src/sw.js',
                maximumFileSizeToCacheInBytes: 1024 * 1024 * 5, // 5 MiB
            }),
        ],
    },
    devServer: {
        allowedHosts: 'all',
    },
}