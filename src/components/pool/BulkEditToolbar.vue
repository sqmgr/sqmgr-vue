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
    <div class="bulk-toolbar">
        <div class="bulk-toolbar-inner">
            <div class="bulk-actions">
                <select v-model="action" class="action-select">
                    <option value="">— Select action —</option>
                    <option value="claim">Claim</option>
                    <option value="unclaim">Unclaim</option>
                    <option value="set_state" :disabled="hasUnclaimedSelected">Set Payment Status</option>
                </select>

                <input
                    v-if="action === 'claim'"
                    v-model="claimant"
                    type="text"
                    placeholder="Name"
                    class="claimant-input"
                    maxlength="30"
                />

                <template v-if="action === 'set_state'">
                    <select v-model="state" class="state-select">
                        <option value="claimed">Claimed</option>
                        <option value="paid-partial">Paid Partial</option>
                        <option value="paid-full">Paid Full</option>
                    </select>

                    <input
                        v-model="note"
                        type="text"
                        placeholder="Note (optional)"
                        class="note-input"
                        maxlength="200"
                    />
                </template>

                <button
                    type="button"
                    class="submit-btn"
                    :disabled="!canSubmit || submitting"
                    @click.prevent="submit"
                >
                    <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
                    <template v-else>Apply</template>
                </button>

                <span v-if="showUnclaimedWarning" class="unclaimed-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Deselect unclaimed squares to set payment status
                </span>
            </div>

            <button type="button" class="cancel-btn" @click.prevent="$emit('cancel')">
                <i class="fas fa-times"></i>
                Done
            </button>
        </div>

        <span class="selected-count">
            <i class="fas fa-check-square"></i>
            {{ selectedSquares.size }}
        </span>

        <div v-if="results.length" class="bulk-results">
            <span class="result-ok">{{ successCount }} succeeded</span>
            <span v-if="errorCount" class="result-err">{{ errorCount }} failed</span>
        </div>
    </div>
</template>

<script>
import sqmgrClient from '@/models/sqmgrClient'
import ModalController from '@/controllers/ModalController'

export default {
    name: 'BulkEditToolbar',
    props: {
        token: {
            type: String,
            required: true,
        },
        selectedSquares: {
            type: Set,
            required: true,
        },
        squaresData: {
            type: Object,
            required: true,
        },
    },
    emits: ['cancel'],
    data() {
        return {
            action: '',
            claimant: '',
            state: 'paid-full',
            note: '',
            submitting: false,
            results: [],
        }
    },
    computed: {
        selectedCount() {
            return this.selectedSquares.size
        },
        hasUnclaimedSelected() {
            for (const id of this.selectedSquares) {
                const sq = this.squaresData[id]
                if (!sq || sq.state === 'unclaimed') return true
            }
            return false
        },
        hasClaimedSelected() {
            for (const id of this.selectedSquares) {
                const sq = this.squaresData[id]
                if (sq && sq.state !== 'unclaimed') return true
            }
            return false
        },
        showUnclaimedWarning() {
            return this.hasUnclaimedSelected && this.hasClaimedSelected
        },
        canSubmit() {
            if (this.selectedCount === 0 || !this.action) return false
            if (this.action === 'claim' && !this.claimant.trim()) return false
            if (this.action === 'set_state' && this.hasUnclaimedSelected) return false
            return true
        },
        successCount() {
            return this.results.filter(r => r.ok).length
        },
        errorCount() {
            return this.results.filter(r => !r.ok).length
        },
    },
    watch: {
        hasUnclaimedSelected(val) {
            if (val && this.action === 'set_state') {
                this.action = ''
            }
        },
    },
    methods: {
        async submit() {
            this.submitting = true
            this.results = []

            const allIds = [...this.selectedSquares]

            // For set_state, only include squares where the state will actually change
            const squareIds = this.action === 'set_state'
                ? allIds.filter(id => {
                    const sq = this.squaresData[id]
                    return !sq || sq.state !== this.state
                })
                : allIds

            if (squareIds.length === 0) {
                this.submitting = false
                return
            }

            const payload = {
                squareIds,
                action: this.action,
            }

            if (this.action === 'claim') {
                payload.claimant = this.claimant.trim()
            } else if (this.action === 'set_state') {
                payload.state = this.state
                if (this.note.trim()) {
                    payload.note = this.note.trim()
                }
            }

            sqmgrClient.bulkUpdateSquares(this.token, payload)
                .then(res => {
                    this.results = res.results
                    this.action = ''
                    this.claimant = ''
                    this.state = 'paid-full'
                    this.note = ''
                })
                .catch(err => ModalController.showError(err))
                .finally(() => {
                    this.submitting = false
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../variables' as *;

.bulk-toolbar {
    position:      relative;
    background:    #7c3aed;
    color:         #fff;
    padding:       $space-3 $space-4;
    border-radius: $radius-lg;
    margin-bottom: $space-4;
}

.bulk-toolbar-inner {
    display:     flex;
    align-items: center;
    flex-wrap:   wrap;
    gap:         $space-3;
}

.bulk-actions {
    display:     flex;
    align-items: center;
    flex-wrap:   wrap;
    gap:         $space-2;
    flex:        1;
}

.action-select,
.state-select,
.claimant-input,
.note-input {
    padding:       $space-2 $space-3;
    border:        1px solid rgba(255, 255, 255, 0.4);
    border-radius: $radius-md;
    background:    rgba(255, 255, 255, 0.15);
    color:         #fff;
    font-size:     0.875rem;

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }

    option {
        background: #5b21b6;
        color:      #fff;
    }
}

.claimant-input {
    min-width: 120px;
}

.note-input {
    min-width: 160px;
}

.submit-btn {
    padding:       $space-2 $space-4;
    background:    #fff;
    color:         #7c3aed;
    border:        none;
    border-radius: $radius-md;
    font-weight:   600;
    cursor:        pointer;
    transition:    opacity var(--transition-fast);

    &:disabled {
        opacity: 0.5;
        cursor:  not-allowed;
    }

    &:not(:disabled):hover {
        opacity: 0.9;
    }
}

.cancel-btn {
    display:     flex;
    align-items: center;
    gap:         $space-1;
    padding:     $space-2 $space-3;
    background:  transparent;
    color:       rgba(255, 255, 255, 0.8);
    border:      1px solid rgba(255, 255, 255, 0.4);
    border-radius: $radius-md;
    cursor:      pointer;
    font-size:   0.875rem;
    transition:  all var(--transition-fast);
    white-space: nowrap;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color:      #fff;
    }
}

.selected-count {
    position:      absolute;
    bottom:        $space-2;
    right:         $space-3;
    display:       flex;
    align-items:   center;
    gap:           $space-1;
    font-size:     0.75rem;
    font-weight:   600;
    white-space:   nowrap;
    opacity:       0.75;
    pointer-events: none;
}

.unclaimed-warning {
    font-size:  0.8rem;
    color:      #fde68a;
    white-space: nowrap;

    i {
        margin-right: $space-1;
    }
}

.bulk-results {
    margin-top: $space-2;
    font-size:  0.875rem;
    display:    flex;
    gap:        $space-3;
}

.result-ok {
    color: rgba(255, 255, 255, 0.9);
}

.result-err {
    color: #fca5a5;
}
</style>
