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

// TODO - handle max lengths and notification

<template>
    <section class="grid-customize">
        <form @submit.prevent="submit">
            <template v-if="errors">
                <template v-for="(errList, errKey) in errors" :key="errKey">
                    <div class="errors">
                        <h2>Error</h2>

                        <p>Please correct the following errors:</p>

                        <ul>
                            <li>{{ errKey }}
                                <ul>
                                    <li v-for="err in errList" :key="err">{{ err }}</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </template>
            </template>
            <fieldset>
                <legend>Event Setup</legend>

                <div class="event-mode-toggle">
                    <label class="event-mode-card" :class="{ active: eventMode === 'live' }">
                        <input type="radio" v-model="eventMode" value="live">
                        <span class="event-mode-content">
                            <span class="event-mode-icon"><i class="fas fa-satellite-dish"></i></span>
                            <span class="event-mode-text">
                                <span class="event-mode-title">Link to Event</span>
                                <span class="event-mode-desc">Search for a real game &mdash; teams, colors, and scores update automatically</span>
                            </span>
                        </span>
                    </label>
                    <label class="event-mode-card" :class="{ active: eventMode === 'manual', disabled: form.bdlEventId }">
                        <input type="radio" v-model="eventMode" value="manual" :disabled="form.bdlEventId">
                        <span class="event-mode-content">
                            <span class="event-mode-icon"><i class="fas fa-pen"></i></span>
                            <span class="event-mode-text">
                                <span class="event-mode-title">Manual Entry</span>
                                <span class="event-mode-desc">Enter team names and colors yourself &mdash; for custom or non-listed events</span>
                            </span>
                        </span>
                    </label>
                </div>

                <EventSearch
                    v-if="eventMode === 'live' && !form.bdlEventId"
                    ref="eventSearch"
                    @selected="onEventSelected"
                    :initial-event="form.bdlEvent"
                />

                <div v-if="form.bdlEventId" class="linked-event-notice">
                    <div class="linked-event-header">
                        <span class="linked-event-icon">
                            <i class="fas fa-link"></i>
                        </span>
                        <span class="linked-event-label">Linked Event</span>
                        <span v-if="isLinkedEventFinal" class="final-badge">
                            <i class="fas fa-flag-checkered"></i> Final
                        </span>
                        <button v-else type="button" class="sm destructive" @click="unlinkEvent">Unlink</button>
                    </div>
                    <div class="linked-event-body">
                        <div class="linked-event-matchup">
                            <span class="team-name">{{ linkedAwayTeamName }}</span>
                            <span class="at-separator">@</span>
                            <span class="team-name">{{ linkedHomeTeamName }}</span>
                        </div>
                        <div class="linked-event-meta">
                            <span v-if="form.bdlEvent?.name" class="event-tag">
                                <i class="fas fa-trophy"></i> {{ form.bdlEvent.name }}
                            </span>
                            <span v-if="linkedEventDate" class="event-tag">
                                <i class="fas fa-calendar-alt"></i> {{ linkedEventDate }}
                            </span>
                        </div>
                    </div>
                    <div v-if="isLinkedEventFinal" class="final-details">
                        This game has ended and cannot be unlinked
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Teams</legend>

                <div class="teams-row">
                    <GridCustomizeTeam name="Away Team" v-model="form.awayTeam" :disabled="!!form.bdlEventId"/>
                    <GridCustomizeTeam name="Home Team" v-model="form.homeTeam" :disabled="!!form.bdlEventId"/>
                </div>
            </fieldset>

            <fieldset>
                <legend>Event Details</legend>

                <div class="field">
                    <label for="label" class="optional">Event Name</label>
                    <input type="text" id="label" name="label" v-model="form.label">
                </div>

                <div class="field">
                    <label for="event-date" class="optional">Event Date</label>
                    <input type="date" id="event-date" name="event-date" v-model="form.eventDate" :disabled="!!form.bdlEventId">
                </div>

                <div v-if="form.bdlEventId" class="field">
                    <label for="payout-config">Number of Payouts</label>
                    <select id="payout-config" v-model="form.payoutConfig">
                        <option value="standard">Final only</option>
                        <option value="hf">Half, Final</option>
                        <option v-if="!isNCAAB" value="123f">1st, 2nd, 3rd, Final</option>
                    </select>
                    <small class="helper-text">Select how many payouts for this event.</small>
                </div>

                <div class="field radio" v-if="pool.gridType === 'roll100'">
                    <label>Rollover?</label>
                    <label><input type="radio" v-model="form.rollover" :value="false"> No</label>
                    <label><input type="radio" v-model="form.rollover" :value="true"> Yes</label>
                </div>

                <div class="field">
                    <label for="notes" class="optional">Notes to Members</label>
                    <textarea id="notes" :maxlength="notesMaxLength" name="notes" placeholder="Notes"
                              v-model="form.notes"></textarea>
                </div>

                <div class="branding-section">
                    <div class="branding-fields">
                        <div class="field">
                            <label for="branding-image-url" class="optional">Branding Image URL</label>
                            <input type="url" id="branding-image-url" name="branding-image-url"
                                   placeholder="https://example.com/logo.png"
                                   v-model="form.brandingImageUrl">
                            <small class="helper-text">Link to a branding image to display with the grid. Must be hosted elsewhere.</small>
                        </div>

                        <div class="field" v-if="form.brandingImageUrl">
                            <label for="branding-image-alt" class="optional">Image Description (Alt Text)</label>
                            <input type="text" id="branding-image-alt" name="branding-image-alt"
                                   placeholder="Description of the image"
                                   v-model="form.brandingImageAlt">
                        </div>
                    </div>

                    <div class="branding-preview" v-if="form.brandingImageUrl">
                        <span class="preview-label">Preview</span>
                        <img :src="form.brandingImageUrl" :alt="form.brandingImageAlt || 'Branding image'"
                             @error="onImageError" @load="onImageLoad" :class="{ 'image-error': imageError }">
                        <small v-if="imageError" class="error-text">Unable to load image. Please check the URL.</small>
                    </div>
                </div>
            </fieldset>

            <div class="buttons">
                <button type="button" class="secondary" @click.prevent="didClickCancel">Cancel</button>
                <button type="submit" name="submit">Save</button>
            </div>
        </form>
    </section>
</template>

<script>
import GridCustomizeTeam from './GridCustomizeTeam.vue'
import EventSearch from '../admin/EventSearch.vue'
import ModalController from '@/controllers/ModalController'
import sqmgrClient from "@/models/sqmgrClient"
import sqmgrConfig from "@/models/sqmgrConfig"

export default {
    name: "GridCustomize",
    components: {GridCustomizeTeam, EventSearch},
    props: {
        token: {
            type: String,
            required: true,
        },
        pool: {
            type: Object,
            required: true,
        },
        grid: {
            type: Object,
            required: false,
        },
    },
    data() {
        return {
            ModalController,
            errors: null,
            notesMaxLength: 200,
            imageError: false,
            eventMode: 'live',
            form: {
                eventDate: '0000-00-00',
                notes: '',
                rollover: false,
                label: '',
                brandingImageUrl: '',
                brandingImageAlt: '',
                bdlEventId: null,
                bdlEvent: null,
                payoutConfig: 'standard',
                awayTeam: {
                    name: '',
                    color1: '',
                    color2: '',
                },
                homeTeam: {
                    name: '',
                    color1: '',
                    color2: '',
                },
            },
        }
    },
    computed: {
        linkedEventDescription() {
            if (!this.form.bdlEvent) return ''
            const event = this.form.bdlEvent
            const away = event.awayTeam?.fullName || event.awayTeam?.name || 'Away'
            const home = event.homeTeam?.fullName || event.homeTeam?.name || 'Home'
            const matchup = `${away} @ ${home}`

            // Format: "Super Bowl LX: Team A @ Team B - Date" or "Team A @ Team B - Date"
            let description = event.name ? `${event.name}: ${matchup}` : matchup

            if (event.eventDate) {
                const date = new Date(event.eventDate)
                const dateStr = date.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                })
                description += ` - ${dateStr}`
            }
            return description
        },
        linkedAwayTeamName() {
            if (!this.form.bdlEvent) return 'Away'
            return this.form.bdlEvent.awayTeam?.fullName || this.form.bdlEvent.awayTeam?.name || 'Away'
        },
        linkedHomeTeamName() {
            if (!this.form.bdlEvent) return 'Home'
            return this.form.bdlEvent.homeTeam?.fullName || this.form.bdlEvent.homeTeam?.name || 'Home'
        },
        linkedEventDate() {
            if (!this.form.bdlEvent?.eventDate) return null
            const date = new Date(this.form.bdlEvent.eventDate)
            return date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            })
        },
        isLinkedEventFinal() {
            return this.form.bdlEvent?.status === 'final'
        },
        isNCAAB() {
            return this.form.bdlEvent?.league === 'ncaab'
        },
    },
    created() {
        sqmgrConfig()
            .then(config => this.notesMaxLength = config.notesMaxLength)
            .catch(err => ModalController.showError(err))
    },
    beforeMount() {
        if (this.grid) {
            const date = this.grid.eventDate.substr(0, 10)
            this.form.eventDate = date === '0001-01-01' ? '' : date
            this.form.notes = this.grid.settings.notes
            this.form.rollover = this.grid.rollover
            this.form.label = this.grid.label
            this.form.brandingImageUrl = this.grid.settings.brandingImageUrl || ''
            this.form.brandingImageAlt = this.grid.settings.brandingImageAlt || ''
            this.form.awayTeam.name = this.grid.awayTeamName
            this.form.awayTeam.color1 = this.grid.settings.awayTeamColor1
            this.form.awayTeam.color2 = this.grid.settings.awayTeamColor2
            this.form.homeTeam.name = this.grid.homeTeamName
            this.form.homeTeam.color1 = this.grid.settings.homeTeamColor1
            this.form.homeTeam.color2 = this.grid.settings.homeTeamColor2

            // Load BDL event if linked
            if (this.grid.bdlEventId) {
                this.form.bdlEventId = this.grid.bdlEventId
                this.form.bdlEvent = this.grid.bdlEvent || null
                this.eventMode = 'live'
                // Load payout config if set, otherwise use pool default
                this.form.payoutConfig = this.grid.payoutConfig || this.pool?.numberSetConfig || 'standard'
            }
        }
    },
    methods: {
        submit() {
            // Check if branding image URL is broken
            if (this.form.brandingImageUrl && this.imageError) {
                ModalController.showPrompt(
                    'Broken Image URL',
                    'The branding image URL could not be loaded. Would you like to fix the URL or remove it?',
                    {
                        cancelButton: 'Fix it',
                        actionButton: 'Remove it and Save',
                        warning: 'If you remove it, the grid will be saved without a branding image.',
                        cancelAction: () => {
                            this.$nextTick(() => {
                                const input = document.getElementById('branding-image-url')
                                if (input) input.focus()
                            })
                        },
                        action: () => {
                            this.form.brandingImageUrl = ''
                            this.form.brandingImageAlt = ''
                            this.imageError = false
                            ModalController.hide()
                            this.doSave()
                        },
                    },
                )
                return
            }

            this.doSave()
        },
        doSave() {
            this.errors = null

            const id = this.grid ? this.grid.id : 0
            const data = {
                eventDate: this.form.eventDate,
                notes: this.form.notes,
                label: this.form.label,
                homeTeamName: this.form.homeTeam.name,
                homeTeamColor1: this.form.homeTeam.color1,
                homeTeamColor2: this.form.homeTeam.color2,
                awayTeamName: this.form.awayTeam.name,
                awayTeamColor1: this.form.awayTeam.color1,
                awayTeamColor2: this.form.awayTeam.color2,
                brandingImageUrl: this.form.brandingImageUrl,
                brandingImageAlt: this.form.brandingImageAlt,
                bdlEventId: this.form.bdlEventId,
                // Only save payoutConfig when an event is linked; clear it otherwise
                payoutConfig: this.form.bdlEventId ? this.form.payoutConfig : '',
            }

            if (this.pool.gridType === 'roll100') data.rollover = this.form.rollover

            sqmgrClient.saveGrid(this.token, id, data)
                .then(grid => {
                    this.$emit('saved', grid)
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.result) {
                        this.errors = err.response.data.result
                    }

                    ModalController.showError(err)
                })
        },
        didClickCancel() {
            this.$emit('canceled')
            ModalController.abort()
        },
        onImageError() {
            this.imageError = true
        },
        onImageLoad() {
            this.imageError = false
        },
        onEventSelected(event) {
            // Block changing if current event is final
            if (this.isLinkedEventFinal) {
                // Reset EventSearch to show original event
                this.$refs.eventSearch?.resetToEvent(this.form.bdlEvent)
                return
            }

            // If already linked to a different event, confirm before changing
            if (this.form.bdlEventId && this.form.bdlEventId !== event.id) {
                const currentEventName = this.linkedEventDescription
                const newAway = event.awayTeam?.name || 'Away'
                const newHome = event.homeTeam?.name || 'Home'
                const newEventName = `${newAway} @ ${newHome}`

                ModalController.showPrompt(
                    'Change Linked Event?',
                    `You are about to change the linked event from "${currentEventName}" to "${newEventName}". This will affect score tracking.`,
                    {
                        cancelButton: 'Cancel',
                        actionButton: 'Change Event',
                        action: () => {
                            ModalController.hide()
                            this.applyEventSelection(event)
                        },
                        cancelAction: () => {
                            // Reset EventSearch to show original event
                            this.$refs.eventSearch?.resetToEvent(this.form.bdlEvent)
                        },
                    },
                )
                return
            }

            this.applyEventSelection(event)
        },
        applyEventSelection(event) {
            this.form.bdlEventId = event.id
            this.form.bdlEvent = event

            // Auto-populate event name if available (e.g., "Super Bowl LX")
            if (event.name) {
                this.form.label = event.name
            }

            // Auto-populate team names and colors from event
            if (event.homeTeam) {
                this.form.homeTeam.name = event.homeTeam.fullName || event.homeTeam.name || ''
                if (event.homeTeam.color) {
                    this.form.homeTeam.color1 = '#' + event.homeTeam.color
                }
                if (event.homeTeam.alternateColor) {
                    this.form.homeTeam.color2 = '#' + event.homeTeam.alternateColor
                }
            }
            if (event.awayTeam) {
                this.form.awayTeam.name = event.awayTeam.fullName || event.awayTeam.name || ''
                if (event.awayTeam.color) {
                    this.form.awayTeam.color1 = '#' + event.awayTeam.color
                }
                if (event.awayTeam.alternateColor) {
                    this.form.awayTeam.color2 = '#' + event.awayTeam.alternateColor
                }
            }

            // Auto-populate event date
            if (event.eventDate) {
                const date = new Date(event.eventDate)
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                this.form.eventDate = `${year}-${month}-${day}`
            }

            // Set payout config to match pool's number rotation format
            let payoutConfig = this.pool?.numberSetConfig || 'standard'

            // For NCAAB, don't allow 123f (1st, 2nd, 3rd, Final)
            if (event.league === 'ncaab' && payoutConfig === '123f') {
                payoutConfig = 'hf' // Default to Half, Final for NCAAB
            }

            this.form.payoutConfig = payoutConfig
        },
        unlinkEvent() {
            this.form.bdlEventId = null
            this.form.bdlEvent = null
            this.form.payoutConfig = this.pool?.numberSetConfig || 'standard'
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

section.grid-customize {
    form {
        padding: 0;
        background-color: transparent;
        border: none;
    }
}

.event-mode-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-3;
    margin-bottom: $space-4;

    @include mobile {
        grid-template-columns: 1fr;
        gap: $space-2;
    }
}

.event-mode-card {
    position: relative;
    display: block;
    cursor: pointer;
    border: 2px solid $light-gray;
    border-radius: $radius-lg;
    padding: $space-3 $space-4;
    background: $surface-elevated;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

    @include mobile {
        padding: $space-3;
    }

    &:hover:not(.disabled) {
        border-color: $gray;
    }

    &.active {
        border-color: $primary;
        box-shadow: 0 0 0 1px $primary;
        background: $primary-50;
    }

    &.disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .event-mode-content {
        display: flex;
        align-items: flex-start;
        gap: $space-3;
    }

    .event-mode-icon {
        @include flex-center;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: $radius-md;
        background: $light-gray;
        color: $text-secondary;
        font-size: 0.85em;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    &.active .event-mode-icon {
        background: $primary;
        color: #fff;
    }

    .event-mode-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .event-mode-title {
        font-weight: 600;
        font-size: 0.95em;
        color: $text-color;
    }

    .event-mode-desc {
        font-size: 0.8em;
        color: $text-secondary;
        line-height: 1.4;
    }
}

.teams-row {
    display: flex;
    gap: $standard-spacing;

    @include mobile {
        flex-direction: column;
    }

    > :deep(*) {
        flex: 1;
    }
}

.linked-event-notice {
    border: 1px solid $primary-light;
    border-radius: $radius-lg;
    margin-top: var(--spacing);
    margin-bottom: $standard-spacing;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba($primary, 0.1);

    .linked-event-header {
        display: flex;
        align-items: center;
        gap: $space-2;
        padding: $space-2 $space-4;
        background: linear-gradient(135deg, $primary-50, rgba($primary, 0.08));
        border-bottom: 1px solid rgba($primary, 0.12);

        @include mobile {
            padding: $space-2 $space-3;
        }
    }

    .linked-event-icon {
        @include flex-center;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        background-color: $primary;
        border-radius: $radius-full;
        color: #fff;
        font-size: 0.6em;
    }

    .linked-event-label {
        font-weight: 600;
        font-size: 0.8em;
        color: $primary-dark;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .final-badge {
        margin-left: auto;
        font-size: 0.75em;
        font-weight: 600;
        color: $text-secondary;
        background-color: $light-gray;
        padding: $space-1 $space-2;
        border-radius: $radius-full;

        i {
            margin-right: 2px;
        }
    }

    button {
        flex-shrink: 0;
        margin-left: auto;
    }

    .linked-event-body {
        padding: $space-3 $space-4;

        @include mobile {
            padding: $space-3;
        }
    }

    .linked-event-matchup {
        display: flex;
        align-items: baseline;
        gap: $space-2;
        font-size: 1.05em;
        font-weight: 600;
        color: $text-color;
        line-height: 1.4;

        @include mobile {
            flex-wrap: wrap;
            justify-content: center;
            text-align: center;
        }
    }

    .at-separator {
        color: $text-secondary;
        font-weight: 400;
        font-size: 0.85em;
    }

    .linked-event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: $space-2;
        margin-top: $space-2;

        @include mobile {
            justify-content: center;
        }
    }

    .event-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8em;
        color: $text-secondary;
        background-color: $surface-sunken;
        padding: 2px $space-2;
        border-radius: $radius-sm;

        i {
            font-size: 0.85em;
        }
    }

    .final-details {
        padding: $space-2 $space-4;
        background-color: $surface-sunken;
        border-top: 1px solid $light-gray;
        font-size: 0.85em;
        color: $text-secondary;
        font-style: italic;
        text-align: center;
    }
}

.helper-text {
    display:    block;
    margin-top: 4px;
    color:      #666;
    font-size:  0.85em;
}

.error-text {
    display:    block;
    margin-top: 4px;
    color:      #f44336;
    font-size:  0.85em;
}

input#event-date:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.branding-section {
    display:     flex;
    gap:         $standard-spacing;
    align-items: flex-start;

    @include mobile {
        gap: 0;
        flex-direction: column;
        margin-bottom: $standard-spacing;
    }
}

.branding-fields {
    flex: 1;
}

.branding-preview {
    flex-shrink: 0;
    width:       150px;

    .preview-label {
        display:       block;
        margin-bottom: calc(var(--minimal-spacing) * 1.5);
        font-weight:   500;
    }

    img {
        background-color: white;
        padding:          calc(var(--minimal-spacing) * 2.5);
        display:          block;
        max-width:        100%;
        max-height:       150px;
        border:           1px solid var(--border-color);
        border-radius:    6px;
        object-fit:       contain;

        &.image-error {
            display: none;
        }
    }
}
</style>