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
along with this program.  If not, see https://www.gnu.org/licenses/.
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
        font-family:      'Anton', sans-serif;
        font-size:        30px;
        font-weight:      400;
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