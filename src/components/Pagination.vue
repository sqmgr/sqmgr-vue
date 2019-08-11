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

<template>
    <nav class="pagination">
        <ul>
            <template v-if="currentPage === 1">
                <li class="prev"><span class="current"><span>Previous</span></span></li>
            </template>
            <template v-else>
                <li class="prev"><a href="#" @click.prevent="$emit('page', prevPage)"><span>Previous</span></a></li>
            </template>

            <template v-for="page in pages">
                <template v-if="page === 0">
                    <li :key="page" class="ellipses"><span>&mldr;</span></li>
                </template>
                <template v-else>
                    <li :key="page" v-if="page === currentPage" class="page"><span class="current">{{page}}</span></li>
                    <li :key="page" v-else class="page"><a href="#" @click.prevent="$emit('page', page)"><span>{{page}}</span></a></li>
                </template>
            </template>

            <template v-if="currentPage === numPages">
                <li class="next"><span class="current"><span>Next</span></span></li>
            </template>
            <template v-else>
                <li class="next"><a href="#" @click.prevent="$emit('page', nextPage)"><span>Next</span></a></li>
            </template>
        </ul>

        <p class="showing">Showing {{showingStart}}-{{showingEnd}} of {{total}}</p>
    </nav>
</template>

<script>
    export default {
        name: "Pagination",
        props: {
            // how many elements to show at beginning and end
            capBuffer: {
                type: Number,
                default: 1,
            },
            // how many elements to show in the current window. Includes current page so it must be >= 1
            windowBuffer: {
                type: Number,
                default: 5,
            },

            total: {
                type: Number,
                required: true,
            },
            perPage: {
                type: Number,
                required: true,
            },
            currentPage: {
                type: Number,
                required: true,
            }
        },
        computed: {
            numPages() {
                return Math.ceil(this.total / this.perPage)
            },
            pages() {
                const visible = this.capBuffer * 2 + this.windowBuffer + 1

                if (this.numPages < visible) {
                    const items = []
                    let i
                    for (i = 0; i < this.numPages; i++) {
                        items[i] = i + 1
                    }

                    return items
                }

                const items = []
                let i
                for (i = 1; i <= this.capBuffer; i++) {
                    items.push(i)
                }

                let windowEnd = this.currentPage + Math.floor(this.windowBuffer / 2)
                let windowStart = windowEnd - this.windowBuffer + 1

                const capRightStart = this.numPages - this.capBuffer + 1
                const capRightEnd = this.numPages

                if (windowStart <= this.capBuffer) {
                    windowStart = this.capBuffer + 1
                    windowEnd = this.capBuffer + this.windowBuffer - 1
                }

                if (windowEnd >= capRightStart) {
                    windowEnd = capRightStart - 1

                    if (this.numPages-this.windowBuffer+1 < windowStart) {
                        windowStart = this.numPages - this.windowBuffer + 1
                    }
                }

                if (this.capBuffer+1 < windowStart) {
                    items.push(0)
                }

                for (i = windowStart; i <= windowEnd; i++) {
                    items.push(i)
                }

                if (windowEnd+1 < capRightStart) {
                    items.push(0)
                }

                for (i = capRightStart; i <= capRightEnd; i++) {
                    items.push(i)
                }

                return items
            },
            prevPage() {
                if (this.currentPage <= 1) {
                    return 1
                }

                return this.currentPage - 1
            },
            nextPage() {
                if (this.currentPage > this.numPages) {
                    return this.numPages
                }

                return this.currentPage + 1
            },
            showingStart() {
                if (this.total === 0) {
                    return 0
                }

                return ( this.currentPage - 1 ) * this.perPage + 1
            },
            showingEnd() {
                const end = this.showingStart + this.perPage - 1
                if (end > this.total) {
                    return this.total
                }

                return end
            }
        }
    }
</script>

<style scoped lang="scss">
    /* pagination */
    nav.pagination {
        margin-top: var(--spacing);
    }
    nav.pagination ul {
        list-style: none;
        margin: 0;
        text-align: center;
    }
    nav.pagination p.showing {
        color: var(--gray);
        font-size: 0.8em;
        text-align: center;
        margin: var(--minimal-spacing) 0 var(--spacing);
    }
    nav.pagination a {
        color: #000;
        display: inline-block;
        padding: 2px var(--minimal-spacing);
    }
    nav.pagination span.current {
        display: inline-block;
        padding: 2px var(--minimal-spacing);
    }
    nav.pagination li {
        display: inline-block;
    }
    nav.pagination li {
        margin-right: var(--minimal-spacing);
    }
    nav.pagination li.prev span.current,
    nav.pagination li.next span.current {
        color: var(--light-gray);
    }
    nav.pagination li.page span.current {
        background-color: var(--primary);
        color: #fff;
        border-radius: 3px;
    }
    nav.pagination li:last-child {
        margin-right: 0;
    }
    nav.pagination li.prev a span,
    nav.pagination li.next a span,
    nav.pagination li.prev span.current span,
    nav.pagination li.next span.current span {
        display: none;
    }
    nav.pagination li.next span.current::before,
    nav.pagination li.next a::before {
        display: inline-block;
        content: '\2771';
    }
    nav.pagination li.prev span.current::before,
    nav.pagination li.prev a::before {
        display: inline-block;
        content: '\2770';
    }
</style>