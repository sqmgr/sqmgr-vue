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
    <div class="card">
        <div class="card-header">
            <i :class="isCombined ? 'fas fa-info-circle' : 'fas fa-sliders-h'"></i>
            <h2>{{ isCombined ? 'Pool Details' : 'Pool Settings' }}</h2>
        </div>

        <div class="settings-list">
            <div class="setting-item">
                <label>Name</label>
                <div class="setting-value">
                    <template v-if="editPoolName">
                        <form class="inline-edit" @submit.prevent="poolNameUpdate">
                            <input class="pool-name" ref="poolName" type="text" v-model="localPoolName"
                                   @keydown="poolNameKeyDown"
                                   placeholder="Squares Pool Name"/>
                            <div class="inline-edit-actions">
                                <button type="button" class="icon-btn secondary"
                                        @click.prevent="undoEditPoolName">
                                    <i class="fas fa-times"></i>
                                </button>
                                <button type="submit" class="icon-btn">
                                    <i class="fas fa-check"></i>
                                </button>
                            </div>
                        </form>
                    </template>
                    <template v-else>
                        <span class="pool-name-display">{{ pool.name }}</span>
                        <button v-if="pool.isAdmin" class="edit-link"
                                @click.prevent="editPoolName=true">
                            <i class="fas fa-edit"></i>
                        </button>
                    </template>
                </div>
            </div>

            <div class="setting-item" v-if="pool.isAdmin">
                <label>Invite Link</label>
                <div class="setting-value">
                    <button type="button" class="sm" v-if="inviteToken" @click="copyInviteLink">
                        <i class="fas fa-copy"></i> Copy Link
                    </button>
                </div>
            </div>

            <div class="setting-item" v-if="pool.isAdmin">
                <label>Join Password</label>
                <div class="setting-value">
                    <button type="button" class="sm secondary" @click="changeJoinPassword">
                        <i class="fas fa-key"></i> Change
                    </button>
                </div>
            </div>

            <template v-if="isCombined && grid">
                <div v-if="!grid.bdlEvent" class="setting-item">
                    <label>Event Date</label>
                    <div class="setting-value">{{ eventDate }}</div>
                </div>
                <LinkedGameInfo v-if="grid.bdlEvent"
                                :bdl-event="grid.bdlEvent"
                                :payout-config="grid.payoutConfig"
                                :number-set-config="pool.numberSetConfig"/>
            </template>

            <div class="setting-item">
                <label>Grid Type</label>
                <div class="setting-value">
                    <span class="badge">{{ pool.gridType }}</span>
                </div>
            </div>

            <div class="setting-item">
                <label>Number Rotation</label>
                <div class="setting-value">
                    <span class="badge number-set-badge">{{ numberSetConfigLabel }}</span>
                    <button v-if="pool.isAdmin && pool.canChangeNumberSetConfig"
                            class="edit-link"
                            @click.prevent="openChangeNumberSetConfig">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>

            <div v-if="isCombined && grid" class="setting-item">
                <label>Payouts</label>
                <div class="setting-value">
                    <span class="badge">{{ payoutConfigLabel }}</span>
                </div>
            </div>

            <div class="setting-item">
                <label>Claimed Squares</label>
                <div class="setting-value">
                    <div class="progress-info">
                        <span class="progress-text">{{ claimed }} of {{ total }}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isCombined && grid" class="setting-item">
                <label>Numbers</label>
                <div class="setting-value">
                    <span v-if="!numbersAreDrawn" class="numbers-pending">
                        <i class="fas fa-clock"></i> Pending
                    </span>
                    <span v-else-if="grid.manualDraw" class="numbers-manual">
                        <i class="fas fa-edit"></i> Manual
                    </span>
                    <span v-else class="numbers-random">
                        <i class="fas fa-dice"></i> Random
                    </span>
                </div>
            </div>

            <div class="setting-item">
                <label>State</label>
                <div class="setting-value">
                    <span class="status-badge" :class="{ locked: isLocked, open: !isLocked }">
                        <i :class="isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
                        {{ isLocked ? `Locked (${date(pool.locks, false)})` : 'Open' }}
                    </span>
                </div>
            </div>

            <div class="setting-item" v-if="pool.isAdmin">
                <label>Password Required?</label>
                <div class="setting-value">
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" v-model="localPasswordRequired" :value="true"> Yes
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="localPasswordRequired" :value="false"> No
                        </label>
                    </div>
                </div>
            </div>

            <div class="setting-item" v-if="pool.isAdmin">
                <label>Password Required if Locked?</label>
                <div class="setting-value">
                    <div class="radio-group">
                        <label class="radio-label" :class="{ disabled: !localPasswordRequired }">
                            <input type="radio" v-model="localOpenAccessOnLock" :value="false"
                                   :disabled="!localPasswordRequired"> Yes
                        </label>
                        <label class="radio-label" :class="{ disabled: !localPasswordRequired }">
                            <input type="radio" v-model="localOpenAccessOnLock" :value="true"
                                   :disabled="!localPasswordRequired"> No
                        </label>
                    </div>
                </div>
            </div>

            <div class="setting-item">
                <label>Created</label>
                <div class="setting-value">
                    <span class="date-text">{{ date(pool.created, true) }}</span>
                </div>
            </div>
        </div>

        <div class="card-footer" v-if="pool.isAdmin">
            <button v-if="isLocked" type="button" class="secondary" @click="unlockSquares">
                <i class="fas fa-lock-open"></i> Open Squares
            </button>
            <button v-else type="button" @click="lockSquares">
                <i class="fas fa-lock"></i> Lock Squares
            </button>
        </div>
    </div>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"
import sqmgrConfig from "@/models/sqmgrConfig"
import ModalController from "@/controllers/ModalController"
import toClipboard from "@/utils/toClipboard"
import ManageMembership from "@/components/pool/ManageMembership"
import ChangeNumberSetConfig from "@/components/grid/ChangeNumberSetConfig"
import LinkedGameInfo from "@/components/grid/LinkedGameInfo"
import Common from '@/common'

export default {
    name: "PoolSettingsCard",
    components: {
        LinkedGameInfo,
    },
    props: {
        pool: {
            type: Object,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        grid: {
            type: Object,
            default: null,
        },
        gridConfig: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:pool', 'copied'],
    data() {
        return {
            editPoolName: false,
            origPoolName: null,
            localPoolName: this.pool.name,
            localPasswordRequired: this.pool.passwordRequired,
            localOpenAccessOnLock: this.pool.openAccessOnLock,
            inviteToken: null,
            squares: null,
            config: null,
        }
    },
    beforeMount() {
        sqmgrClient.getPoolSquares(this.token)
            .then(squares => this.squares = squares)

        sqmgrConfig().then(config => this.config = config)

        if (this.pool.isAdmin) {
            this.getInviteToken()
        }
    },
    computed: {
        isCombined() {
            return !!this.grid
        },
        isLocked() {
            const locks = new Date(this.pool.locks)
            return locks.getFullYear() > 1 && locks.getTime() < new Date().getTime()
        },
        claimed() {
            const total = this.squares ? Object.values(this.squares).filter(s => s.state !== 'unclaimed').length : 0
            if (this.pool.gridType === 'roll100') return total / 2
            return total
        },
        total() {
            const total = this.squares ? Object.values(this.squares).length : 0
            if (this.pool.gridType === 'roll100') return total / 2
            return total
        },
        progressPercent() {
            if (this.total === 0) return 0
            return Math.round((this.claimed / this.total) * 100)
        },
        numberSetConfigLabel() {
            const cfg = this.gridConfig || this.config
            const found = cfg?.numberSetConfigs?.find(c => c.key === this.pool.numberSetConfig)
            return found?.label || 'Standard'
        },
        eventDate() {
            if (!this.grid) return 'Not specified'
            if (new Date(this.grid.eventDate).getFullYear() === 0) {
                return 'Not specified'
            }
            return Common.NewDateWithoutTimezone(this.grid.eventDate).toLocaleDateString("default", Common.DateOptions)
        },
        numbersAreDrawn() {
            if (!this.grid) return false
            if (this.grid.homeNumbers || this.grid.awayNumbers) {
                return true
            }
            if (this.grid.numberSets && Object.keys(this.grid.numberSets).length > 0) {
                return true
            }
            return false
        },
        payoutConfigLabel() {
            if (!this.grid) return 'Final'
            const config = this.grid.payoutConfig || this.pool?.numberSetConfig || 'standard'
            if (config === 'standard') {
                return 'Final'
            }
            const cfg = this.gridConfig || this.config
            const found = cfg?.numberSetConfigs?.find(c => c.key === config)
            return found?.label || 'Final'
        },
    },
    watch: {
        editPoolName(newVal) {
            if (newVal) {
                this.origPoolName = this.localPoolName
                this.$nextTick()
                    .then(() => this.$refs.poolName.select())
            }
        },
        localPasswordRequired(newVal) {
            sqmgrClient.setPasswordRequiredForPool(this.token, newVal)
                .catch(err => ModalController.showError(err))
        },
        localOpenAccessOnLock(newVal) {
            sqmgrClient.setOpenAccessOnLockForPool(this.token, newVal)
                .catch(err => ModalController.showError(err))
        },
    },
    methods: {
        getInviteToken() {
            sqmgrClient.getPoolInviteToken(this.token)
                .then(res => this.inviteToken = res.token)
                .catch(err => ModalController.showError(err))
        },
        undoEditPoolName() {
            this.localPoolName = this.origPoolName
            this.editPoolName = false
        },
        poolNameUpdate() {
            if (this.localPoolName === '') {
                this.undoEditPoolName()
                return
            }

            sqmgrClient.renamePool(this.token, this.localPoolName)
                .then(() => {
                    this.$emit('update:pool', {...this.pool, name: this.localPoolName})
                    this.editPoolName = false
                })
                .catch(err => ModalController.showError(err))
        },
        poolNameKeyDown(event) {
            if (event.key === 'Escape') {
                this.undoEditPoolName()
            }
        },
        copyInviteLink(event) {
            const url = this.localPasswordRequired
                ? `${window.location.origin}/pool/${this.token}/join#${this.inviteToken}`
                : `${window.location.origin}/pool/${this.token}`
            toClipboard(url)
            this.$emit('copied', event)
        },
        changeJoinPassword() {
            ModalController.show('Manage Membership', ManageMembership, {
                    pool: this.pool,
                },
                {
                    updated: () => {
                        this.getInviteToken()
                    },
                })
        },
        openChangeNumberSetConfig() {
            ModalController.show('Change Number Rotation', ChangeNumberSetConfig, {
                    pool: this.pool,
                },
                {
                    updated: (pool) => {
                        this.$emit('update:pool', pool)
                    },
                })
        },
        lockSquares() {
            sqmgrClient.getPoolSquares(this.token)
                .then(squares => {
                    this.squares = squares
                    const promptOpts = {
                        actionButton: "Lock Squares",
                        action: () => {
                            ModalController.hide()

                            sqmgrClient.lockPool(this.token)
                                .then(pool => this.$emit('update:pool', pool))
                                .catch(err => ModalController.showError(err))
                        },
                    }

                    const unclaimedSquares = Object.values(squares).filter(s => s.state === 'unclaimed')
                    if (unclaimedSquares.length > 0) {
                        promptOpts.warning = "There are still unclaimed squares."
                    }

                    ModalController.showPrompt("Lock the squares?", "Are you sure you want to lock the squares? Users will no longer be allowed to claim any open squares.", promptOpts)
                })
                .catch(err => ModalController.showError(err))
        },
        unlockSquares() {
            const promptOpts = {
                actionButton: "Unlock Squares",
                action: () => {
                    ModalController.hide()

                    sqmgrClient.unlockPool(this.token)
                        .then(pool => this.$emit('update:pool', pool))
                        .catch(err => ModalController.showError(err))
                },
            }

            ModalController.showPrompt("Unlock the squares?", "Are you sure you want to open the squares back up again for users to claim?", promptOpts)
        },
        date(date, includeTime) {
            const d = new Date(date)
            if (d.getFullYear() <= 1) {
                return ''
            }

            return includeTime ? d.toLocaleString(Common.DateTimeOptions) : d.toLocaleDateString(Common.DateTimeOptions)
        },
    },
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.card {
    @include card-base($radius-xl);
    overflow: hidden;
}

.card-header {
    @include card-header;
    gap: $space-4;

    h2 {
        margin:    0;
        font-size: 1.25rem;
    }
}

.card-footer {
    @include card-footer;
}

// Settings List
.settings-list {
    padding: $space-2 0;
}

.setting-item {
    display:     flex;
    align-items: flex-start;
    padding:     $space-3 $space-5;
    gap:         $space-4;
    transition:  background-color var(--transition-fast);

    &:hover {
        background-color: #fafafa;
    }

    & > label {
        flex:        0 0 140px;
        font-size:   0.875rem;
        color:       $text-secondary;
        padding-top: $space-1;
    }

    .setting-value {
        flex:        1;
        display:     flex;
        align-items: center;
        gap:         $space-2;
        min-height:  32px;
    }
}

.pool-name-display {
    font-weight: 500;
}

.edit-link {
    background: transparent;
    border:     none;
    box-shadow: none;
    color:      $gray;
    padding:    $space-1;
    min-height: auto;
    cursor:     pointer;

    &:hover {
        color:      $primary;
        background: transparent;
        transform:  none;
        box-shadow: none;
    }
}

code.token {
    background:    $light-gray;
    padding:       $space-1 $space-2;
    border-radius: $radius-sm;
    font-size:     0.875rem;
    font-family:   monospace;
}

.badge {
    @include badge;
}

// Progress Bar
.progress-info {
    width:     100%;
    max-width: 200px;
}

.progress-text {
    font-size:     0.875rem;
    font-weight:   500;
    display:       block;
    margin-bottom: $space-1;
}

.progress-bar {
    height:        6px;
    background:    $light-gray;
    border-radius: $radius-full;
    overflow:      hidden;
}

.progress-fill {
    height:        100%;
    background:    linear-gradient(90deg, $primary-light 0%, $primary 100%);
    border-radius: $radius-full;
    transition:    width var(--transition-slow);
}

// Status Badge
.status-badge {
    @include status-badge;

    &.open {
        background: rgba($primary, 0.1);
        color:      $primary-dark;
    }

    &.locked {
        background: rgba($red, 0.1);
        color:      $red;
    }

    i {
        font-size: 0.875rem;
    }
}

// Radio Group
.radio-group {
    display: flex;
    gap:     $space-4;
}

.radio-label {
    display:     inline-flex;
    align-items: center;
    gap:         $space-2;
    font-size:   0.875rem;
    cursor:      pointer;

    &.disabled {
        opacity: 0.5;
        cursor:  not-allowed;
    }

    input[type="radio"] {
        margin: 0;
    }
}

.date-text {
    font-size: 0.875rem;
    color:     $text-secondary;
}

// Numbers status
.numbers-pending,
.numbers-manual,
.numbers-random {
    @include numbers-status;
}

.numbers-pending {
    color: $text-secondary;
}

.numbers-manual,
.numbers-random {
    color: $primary-dark;
}

// Inline Edit
.inline-edit {
    display:     flex;
    flex-wrap:   wrap;
    align-items: center;
    gap:         $space-2;
    width:       100%;

    input.pool-name {
        flex:          1 0 100%;
        padding:       $space-2 $space-3;
        border:        1px solid $border-color;
        border-radius: $radius-md;
        font-size:     0.9375rem;

        &:focus {
            outline:      none;
            border-color: $primary;
            box-shadow:   0 0 0 3px rgba($primary, 0.1);
        }
    }
}

.inline-edit-actions {
    display: flex;
    gap:     $space-1;
}

// Icon Buttons (inline edit actions)
.icon-btn {
    @include icon-btn;

    &.secondary {
        border-color: $light-gray;
    }
}
</style>
