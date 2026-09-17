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
    <div class="admin-user-picker">
        <div v-if="modelValue" class="selected">
            <span class="selected-user">
                <i class="fas fa-user" aria-hidden="true"></i>
                <strong>{{ userLabel(modelValue) }}</strong>
                <span class="muted">#{{ modelValue.id }}</span>
            </span>
            <button type="button" class="secondary sm" @click="clear">Change</button>
        </div>

        <template v-else>
            <input
                :id="inputId"
                ref="input"
                type="search"
                v-model="query"
                placeholder="Search by email address"
                autocomplete="off"
                role="combobox"
                aria-autocomplete="list"
                :aria-expanded="options.length > 0 ? 'true' : 'false'"
                :aria-controls="`${inputId}-results`"
                :aria-activedescendant="activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined"
                :aria-invalid="invalid ? 'true' : undefined"
                :aria-describedby="describedBy || undefined"
                @input="onInput"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="selectActive"
            />

            <div v-if="listLabel" class="list-label">{{ listLabel }}</div>
            <ul v-if="options.length > 0" :id="`${inputId}-results`" class="results" role="listbox">
                <li
                    v-for="(user, i) in options"
                    :id="`${inputId}-option-${i}`"
                    :key="user.id"
                    role="option"
                    :aria-selected="i === activeIndex ? 'true' : 'false'"
                    :aria-disabled="isExcluded(user) ? 'true' : undefined"
                    :class="{ active: i === activeIndex, disabled: isExcluded(user) }"
                    @mousedown.prevent
                    @click="select(user)"
                    @mousemove="activeIndex = i"
                >
                    <span class="option-label">{{ userLabel(user) }}</span>
                    <span class="option-meta">
                        <span v-if="isExcluded(user)" class="status neutral">{{ excludedNote }}</span>
                        <span v-else-if="user.note" class="status neutral">{{ user.note }}</span>
                        <span class="muted">#{{ user.id }}</span>
                    </span>
                </li>
            </ul>
            <div v-else-if="searching" class="hint" role="status">Searching...</div>
            <div v-else-if="searchError" class="hint error-text" role="alert">{{ searchError }}</div>
            <div v-else-if="searched" class="hint" role="status">No registered users match "{{ query.trim() }}".</div>
        </template>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import { debounce } from "@/utils/debounce"
import { formatUserLabel, getErrorMessage } from "@/utils/adminFormat"

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS = 8

// AdminUserPicker lets a site admin choose a registered user by searching for
// their email address, so that nobody has to look up or remember user IDs.
// The v-model value is the chosen user ({ id, email, store }) or null.
export default {
    name: "AdminUserPicker",
    props: {
        modelValue: {
            type: Object,
            default: null,
        },
        inputId: {
            type: String,
            default: 'admin-user-picker',
        },
        // users offered before anything is typed: [{ id, email, store, note }]
        suggestions: {
            type: Array,
            default: () => [],
        },
        suggestionsLabel: {
            type: String,
            default: 'Suggestions',
        },
        // user IDs that may not be chosen. They still show up in search
        // results, greyed out with excludedNote, so that a search for one of
        // them does not look like the user does not exist.
        excludeIds: {
            type: Array,
            default: () => [],
        },
        excludedNote: {
            type: String,
            default: 'Not available',
        },
        invalid: {
            type: Boolean,
            default: false,
        },
        describedBy: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            query: '',
            results: [],
            searching: false,
            searched: false,
            searchError: null,
            activeIndex: -1,
        }
    },
    computed: {
        hasQuery() {
            return this.query.trim().length >= MIN_QUERY_LENGTH
        },

        options() {
            if (this.hasQuery) {
                return this.results
            }
            return this.suggestions.filter(user => !this.isExcluded(user))
        },

        listLabel() {
            if (this.options.length === 0) return ''
            return this.hasQuery ? 'Matching users' : this.suggestionsLabel
        },
    },
    created() {
        this.debouncedSearch = debounce(() => this.search(), 250)
    },
    beforeUnmount() {
        this.debouncedSearch.cancel()
    },
    methods: {
        isExcluded(user) {
            return this.excludeIds.includes(user.id)
        },

        userLabel(user) {
            return formatUserLabel(user.id, user.email, user.store)
        },

        focus() {
            if (this.$refs.input) this.$refs.input.focus()
        },

        onInput() {
            this.activeIndex = -1
            this.searched = false
            this.searchError = null
            if (!this.hasQuery) {
                this.debouncedSearch.cancel()
                this.results = []
                this.searching = false
                return
            }
            this.searching = true
            this.debouncedSearch()
        },

        async search() {
            const query = this.query.trim()
            try {
                const result = await sqmgrClient.getAdminUsers(query, 0, MAX_RESULTS)
                // ignore a response that a newer keystroke has superseded
                if (query !== this.query.trim()) return
                this.results = result.users || []
                this.searched = true
            } catch (err) {
                if (query !== this.query.trim()) return
                this.results = []
                this.searchError = getErrorMessage(err)
            } finally {
                if (query === this.query.trim()) this.searching = false
            }
        },

        move(step) {
            if (this.options.length === 0) return
            const count = this.options.length
            this.activeIndex = (this.activeIndex + step + count) % count
        },

        selectActive() {
            // with a single match, Enter picks it without arrowing down first
            const index = this.activeIndex >= 0 ? this.activeIndex : (this.options.length === 1 ? 0 : -1)
            if (index >= 0) this.select(this.options[index])
        },

        select(user) {
            if (this.isExcluded(user)) return
            this.$emit('update:modelValue', { id: user.id, email: user.email, store: user.store })
        },

        clear() {
            this.$emit('update:modelValue', null)
            this.query = ''
            this.results = []
            this.searched = false
            this.activeIndex = -1
            this.$nextTick(() => this.focus())
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;
@use './admin' as *;

.admin-user-picker {
    .status {
        @include admin-status;
    }

    .muted {
        color:     $text-secondary;
        font-size: 0.85em;
    }

    .selected {
        display:         flex;
        align-items:     center;
        justify-content: space-between;
        gap:             $space-3;
        padding:         $space-2 $space-3;
        border:          1px solid $light-gray;
        border-radius:   $radius-lg;

        .selected-user {
            display:     flex;
            align-items: center;
            gap:         $space-2;
            min-width:   0;

            strong {
                overflow:      hidden;
                text-overflow: ellipsis;
                white-space:   nowrap;
            }
        }
    }

    .list-label {
        margin-top:     $space-2;
        color:          $text-secondary;
        font-size:      0.75em;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .results {
        list-style:    none;
        margin:        $space-1 0 0;
        padding:       0;
        max-height:    260px;
        overflow-y:    auto;
        border:        1px solid $light-gray;
        border-radius: $radius-lg;

        li {
            display:         flex;
            align-items:     center;
            justify-content: space-between;
            gap:             $space-3;
            padding:         $space-2 $space-3;
            cursor:          pointer;

            & + li {
                border-top: 1px solid $light-gray;
            }

            &.active {
                background: $primary-50;
            }

            &.disabled {
                cursor: not-allowed;
                background: transparent;

                .option-label {
                    color: $text-secondary;
                }
            }

            .option-label {
                overflow:      hidden;
                text-overflow: ellipsis;
                white-space:   nowrap;
            }

            .option-meta {
                display:     flex;
                align-items: center;
                gap:         $space-2;
                flex-shrink: 0;
            }
        }
    }

    .hint {
        margin-top: $space-2;
        color:      $text-secondary;
        font-size:  0.9em;

        &.error-text {
            color: $red;
        }
    }
}
</style>
