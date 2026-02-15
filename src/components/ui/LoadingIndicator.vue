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
        <div class="loading-indicator">
            <span v-for="i in 8" :key="i"></span>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        default: '',
    },
})
</script>

<style scoped lang="scss">
@use '../../variables' as *;

div.loading-wrapper {
    display:        flex;
    flex-direction: column;
    align-items:    center;
    gap:            12px;
}

p.loading-text {
    color:     var(--dark-gray);
    font-size: 0.9em;
    margin:    0;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

div.loading-indicator {
    $size:                 40px;
    display:               grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    width:                 $size;
    height:                $size;
    gap:                   2px;

    span {
        &:first-child {
            grid-column: 2;
        }

        background-color: $logo-green;
        animation:        fall-wave 2s ease-in-out infinite;

        // Create wave effect with staggered delays (bottom-right to top-left)
        &:nth-child(1) { animation-delay: 0.25s; }

        &:nth-child(2) { animation-delay: 0.15s; }

        &:nth-child(3) { animation-delay: 0.2s; }

        &:nth-child(4) { animation-delay: 0.1s; }

        &:nth-child(5) { animation-delay: 0.05s; }

        &:nth-child(6) { animation-delay: 0.15s; }

        &:nth-child(7) { animation-delay: 0.05s; }

        &:nth-child(8) { animation-delay: 0s; }
    }

    &.small {
        $size:         30px;
        width:         $size;
        height:        $size;
        line-height:   $size;
        border-radius: $size;
        font-size:     18px;
    }

    @keyframes fall-wave {
        0% {
            transform: translateY(calc(-$size / 2));
            opacity:   0;
        }
        15% {
            transform: translateY(0);
            opacity:   1;
        }
        85% {
            transform: translateY(0);
            opacity:   1;
        }
        100% {
            transform: translateY(calc($size / 2));
            opacity:   0;
        }
    }
}
</style>
