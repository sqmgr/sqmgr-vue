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
    <div class="loading-wrapper">
        <div class="loading-indicator"><span></span></div>
        <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
</template>

<script>
    export default {
        name: "LoadingIndicator",
        props: {
            text: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped lang="scss">
    div.loading-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    p.loading-text {
        color: var(--dark-gray);
        font-size: 0.9em;
        margin: 0;
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }

    div.loading-indicator {
        $size: 40px;
        animation:        spin 2.4s ease-in-out infinite, reveal .4s ease-in-out;
        background-color: var(--midnight-gray);
        border-radius:    $size;
        color:            #fff;
        display:          inline-block;
        font-family:      'Alfa Slab One', sans-serif;
        font-size:        30px;
        font-weight:      bold;
        height:           $size;
        line-height:      $size;
        text-align:       center;
        text-shadow:      1px 1px var(--midnight-gray), 3px 2px var(--primary);
        width:            $size;
        z-index:          3;

        span {
            position: relative;
            left: -1px;
        }
        span::after {
            content: 'S';
        }

        &.small {
            $size: 30px;
            width: $size;
            height: $size;
            line-height: $size;
            border-radius: $size;
            font-size: 18px;
        }
    }
</style>