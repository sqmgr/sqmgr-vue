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
    <form class="standalone admin-action-prompt" @submit.prevent="submit">
        <p>{{ description }}</p>

        <warning-box v-if="warning" :warning="warning"/>

        <div v-for="field in fields" :key="field.key" class="field">
            <label :for="`action-${field.key}`" :class="{ required: field.required }">{{ field.label }}</label>
            <admin-user-picker
                v-if="field.type === 'user'"
                :ref="el => setInputRef(field.key, el)"
                :input-id="`action-${field.key}`"
                v-model="values[field.key]"
                :suggestions="field.suggestions || []"
                :suggestions-label="field.suggestionsLabel"
                :exclude-ids="field.excludeIds || []"
                :excluded-note="field.excludedNote"
                :invalid="!!errors[field.key]"
                :described-by="describedBy(field)"
            />
            <input
                v-else
                :id="`action-${field.key}`"
                :ref="el => setInputRef(field.key, el)"
                :type="field.type || 'text'"
                v-model="values[field.key]"
                :placeholder="field.placeholder || ''"
                :min="field.min"
                :autocomplete="field.type === 'password' ? 'new-password' : 'off'"
                :aria-invalid="errors[field.key] ? 'true' : undefined"
                :aria-describedby="describedBy(field) || undefined"
            />
            <span v-if="field.helper" :id="`action-${field.key}-helper`" class="helper">{{ field.helper }}</span>
            <div v-if="errors[field.key]" :id="`action-${field.key}-error`" class="field-error" role="alert">{{ errors[field.key] }}</div>
        </div>

        <div class="field">
            <label for="action-reason" class="optional">Reason</label>
            <input
                id="action-reason"
                type="text"
                v-model="values.reason"
                placeholder="Recorded in the audit log"
                autocomplete="off"
            />
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()">Cancel</button>
            <button type="submit" :class="{ destructive: isDestructive }">{{ actionButton }}</button>
        </div>
    </form>
</template>

<script>
import ModalController from "@/controllers/ModalController"
import WarningBox from "@/components/ui/WarningBox"
import AdminUserPicker from "@/components/admin/AdminUserPicker"

// AdminActionPrompt is a confirmation dialog for site-admin actions that
// records an optional reason and any extra inputs the action requires.
export default {
    name: "AdminActionPrompt",
    components: {WarningBox, AdminUserPicker},
    props: {
        description: {
            type: String,
            required: true,
        },
        actionButton: {
            type: String,
            default: 'Confirm',
        },
        isDestructive: {
            type: Boolean,
            default: false,
        },
        warning: {
            type: String,
            default: '',
        },
        // [{ key, label, type, placeholder, required, minLength, min, helper }]
        // A field of type 'user' is a search-by-email picker; it also accepts
        // { suggestions, suggestionsLabel, excludeIds, excludedNote } and its confirmed
        // value is the chosen user's ID.
        fields: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['confirm'],
    data() {
        const values = { reason: '' }
        this.fields.forEach(field => {
            values[field.key] = field.type === 'user' ? null : ''
        })
        return {
            ModalController,
            values,
            errors: {},
        }
    },
    created() {
        // plain object: element refs do not need to be reactive
        this.inputEls = {}
    },
    methods: {
        setInputRef(key, el) {
            if (el) {
                this.inputEls[key] = el
            } else {
                delete this.inputEls[key]
            }
        },

        describedBy(field) {
            const ids = []
            if (field.helper) ids.push(`action-${field.key}-helper`)
            if (this.errors[field.key]) ids.push(`action-${field.key}-error`)
            return ids.join(' ')
        },

        focusFirstInvalid() {
            const first = this.fields.find(field => this.errors[field.key])
            const el = first ? this.inputEls[first.key] : null
            if (el) {
                this.$nextTick(() => el.focus())
            }
        },

        validate() {
            const errors = {}
            this.fields.forEach(field => {
                if (field.type === 'user') {
                    if (field.required && !this.values[field.key]) {
                        errors[field.key] = 'Search for a user and choose them from the list.'
                    }
                    return
                }
                const value = String(this.values[field.key] ?? '').trim()
                if (field.required && value === '') {
                    errors[field.key] = `${field.label} is required.`
                } else if (field.minLength && value.length < field.minLength) {
                    errors[field.key] = `${field.label} must be at least ${field.minLength} characters.`
                } else if (field.type === 'number' && value !== '' && !/^\d+$/.test(value)) {
                    errors[field.key] = `${field.label} must be a whole number.`
                }
            })
            this.errors = errors
            return Object.keys(errors).length === 0
        },

        submit() {
            if (!this.validate()) {
                this.focusFirstInvalid()
                return
            }
            const result = {}
            const userKeys = this.fields.filter(field => field.type === 'user').map(field => field.key)
            Object.entries(this.values).forEach(([key, value]) => {
                if (userKeys.includes(key)) {
                    result[key] = value ? value.id : null
                    return
                }
                result[key] = typeof value === 'string' ? value.trim() : value
            })
            this.$emit('confirm', result)
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables' as *;

.admin-action-prompt {
    min-width: min(420px, 85vw);

    .field {
        .helper {
            @include helper-text;
        }

        .field-error {
            margin-top: $space-1;
            color:      $red;
            font-size:  0.85em;
        }
    }
}
</style>
