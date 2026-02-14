/*
Copyright 2026 Tom Peters

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
    <label class="option-card" :class="{ selected }">
        <input type="radio"
               :name="name"
               :value="value"
               :checked="selected"
               @change="$emit('update:selected', value)" />
        <span class="option-content">
            <span class="option-title">{{ title }}</span>
            <span v-if="description" class="option-desc">{{ description }}</span>
        </span>
        <span class="check-icon"><i class="fas fa-check"></i></span>
    </label>
</template>

<script>
export default {
    name: "OptionCard",
    props: {
        value: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        selected: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: true,
        },
    },
    emits: ['update:selected'],
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.option-card {
    display: flex;
    align-items: center;
    padding: $space-4;
    border: 2px solid $light-gray;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all var(--transition-fast);
    background: $surface-elevated;
    margin: 0;
    font-weight: normal;

    input[type="radio"] {
        display: none;
    }

    .option-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: $space-1;
    }

    .option-title {
        font-weight: 600;
        color: $text-color;
        font-size: 0.95em;
    }

    .option-desc {
        font-size: 0.8em;
        color: $dark-gray;
    }

    .check-icon {
        width: 24px;
        height: 24px;
        border: 2px solid $gray;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);
        flex-shrink: 0;

        i {
            font-size: 0.7em;
            color: white;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
    }

    &:hover {
        border-color: $primary-light;
        background: $primary-50;
    }

    &.selected {
        border-color: $primary;
        background: $primary-50;

        .check-icon {
            background: $primary;
            border-color: $primary;

            i {
                opacity: 1;
            }
        }
    }
}
</style>
