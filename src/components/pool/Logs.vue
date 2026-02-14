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
    <section class="audit-log">
        <template v-if="showAddNote">
            <div class="add-note-row">
                <button type="button" class="add-note-btn" @click.prevent="addNote">
                    <i class="fa-solid fa-comment-plus"></i>
                    Add Note
                </button>
            </div>
        </template>

        <div v-if="logs.length === 0" class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <p>No activity yet</p>
        </div>

        <div v-else class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th class="col-id">ID</th>
                        <th class="col-time">Time</th>
                        <th class="col-state">State</th>
                        <th class="col-claimant">Claimant</th>
                        <th class="col-note">Note</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in logs" :key="log.id">
                        <td class="col-id">
                            <span class="square-id">#{{ log.squareID }}</span>
                        </td>
                        <td class="col-time">
                            <span class="timestamp">{{ datetime(log.created) }}</span>
                        </td>
                        <td class="col-state">
                            <span class="state-badge" :class="stateClass(log.state)">
                                <i :class="stateIcon(log.state)"></i>
                                {{ formatState(log.state) }}
                            </span>
                        </td>
                        <td class="col-claimant">{{ log.claimant }}</td>
                        <td class="col-note">{{ log.note }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    import Note from '../ui/Note.vue'
    import Common from '../../common'
    import ModalController from '@/controllers/ModalController'
    import sqmgrClient from "@/models/sqmgrClient";

    export default {
        name: "Logs",
        props: {
            poolConfig: {
                type: Object,
                required: true,
            },
            squareId: {
                type: Number,
            },
            logs: {
                type: Array,
                required: true,
            },
            showAddNote: {
                type: Boolean,
            },
        },
        methods: {
            addNote() {
                ModalController.show('Add Note', Note, {}, {
                    save: note => {
                        if (note) {
                            sqmgrClient.updateSquare(this.poolConfig.token, this.squareId, {note})
                                .then(() => {
                                    ModalController.hide()
                                    this.$emit('note-added')
                                })
                                .catch(err => ModalController.showError(err))
                            return
                        }

                        ModalController.hide()
                    }
                })
            },
            datetime(dt) {
                return new Date(dt).toLocaleDateString(undefined, Common.DateTimeOptions)
            },
            stateClass(state) {
                const stateMap = {
                    'unclaimed': 'unclaimed',
                    'claimed': 'claimed',
                    'paid-partial': 'partial',
                    'paid-full': 'paid',
                }
                return stateMap[state] || 'default'
            },
            stateIcon(state) {
                const iconMap = {
                    'unclaimed': 'fas fa-square',
                    'claimed': 'fas fa-user-check',
                    'paid-partial': 'fas fa-coins',
                    'paid-full': 'fas fa-check-circle',
                }
                return iconMap[state] || 'fas fa-info-circle'
            },
            formatState(state) {
                const labelMap = {
                    'unclaimed': 'Unclaimed',
                    'claimed': 'Claimed',
                    'paid-partial': 'Partial',
                    'paid-full': 'Paid',
                }
                return labelMap[state] || state
            }
        }
    }
</script>

<style lang="scss" scoped>
@use '../../variables.scss' as *;

button.add-note-btn {
    background: $light-gray;
    box-shadow: none;
    color: $text-color;

    &:hover {
        color: $primary;
        transform: none;
    }
}

section.audit-log {
    overflow: auto;
    border-top: 1px solid $light-gray;
    margin-top: $standard-spacing;
}

.add-note-row {
    padding: $space-3 0;
    text-align: right;
}

.empty-state {
    @include empty-state;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
        opacity: 0.4;
    }
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

thead {
    th {
        padding: $space-3 $space-4;
        text-align: left;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: $text-secondary;
        background: $surface-sunken;
        border-bottom: 1px solid $light-gray;
        white-space: nowrap;

        &:first-child {
            padding-left: $space-5;
        }

        &:last-child {
            padding-right: $space-5;
        }
    }
}

tbody {
    tr {
        transition: background-color 0.15s ease;

        &:hover {
            background-color: $surface-sunken;
        }

        &:not(:last-child) {
            border-bottom: 1px solid $light-gray;
        }
    }

    td {
        padding: $space-3 $space-4;
        vertical-align: middle;
        color: $text-color;

        &:first-child {
            padding-left: $space-5;
        }

        &:last-child {
            padding-right: $space-5;
        }
    }
}

.col-id {
    width: 70px;
}

.col-time {
    width: 160px;
}

.col-state {
    width: 100px;
}

.col-claimant {
    width: 150px;
}

.col-note {
    min-width: 150px;
    color: $text-secondary;
    font-style: italic;
}

.square-id {
    display: inline-block;
    font-family: monospace;
    font-weight: 600;
    font-size: 0.8125rem;
    color: $light-gray;
    background: $dark-gray;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
}

.timestamp {
    font-size: 0.8125rem;
    color: $text-secondary;
    white-space: nowrap;
}

.state-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-2;
    border-radius: $radius-full;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;

    i {
        font-size: 0.5625rem;
    }

    &.unclaimed {
        background: rgba($gray, 0.2);
        color: $dark-gray;
    }

    &.claimed {
        background: rgba(#2196f3, 0.1);
        color: #1565c0;
    }

    &.partial {
        background: rgba(#ffc107, 0.15);
        color: #f57c00;
    }

    &.paid {
        background: rgba($primary, 0.1);
        color: $primary-dark;
    }

    &.default {
        background: $light-gray;
        color: $text-secondary;
    }
}

@include mobile {
    thead {
        th {
            padding: $space-2 $space-3;
            font-size: 0.6875rem;

            &:first-child {
                padding-left: $space-3;
            }

            &:last-child {
                padding-right: $space-3;
            }
        }
    }

    tbody td {
        padding: $space-2 $space-3;
        font-size: 0.8125rem;

        &:first-child {
            padding-left: $space-3;
        }

        &:last-child {
            padding-right: $space-3;
        }
    }

    .col-id {
        width: 50px;
    }

    .col-time {
        width: auto;
    }

    .col-claimant,
    .col-note {
        min-width: 100px;
    }
}
</style>
