/*
Copyright 2024 Tom Peters

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
    <section class="change-number-set-config">
        <div class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <span>You can change the number rotation rules up until you draw the numbers for your first game.</span>
        </div>

        <form v-if="config" @submit.prevent="submit" class="standalone">
            <fieldset>
                <div class="option-cards">
                    <label v-for="nsc in config.numberSetConfigs"
                           :key="nsc.key"
                           class="option-card"
                           :class="{ selected: selectedConfig === nsc.key }">
                        <input type="radio"
                               name="number-set-config"
                               :value="nsc.key"
                               v-model="selectedConfig" />
                        <span class="option-content">
                            <span class="option-title">{{ nsc.label }}</span>
                            <span class="option-desc">{{ getNumberSetDescription(nsc.key) }}</span>
                        </span>
                        <span class="check-icon"><i class="fas fa-check"></i></span>
                    </label>
                </div>

                <div class="buttons">
                    <button type="button" @click="cancel" class="secondary">Cancel</button>
                    <button type="submit" :disabled="saving || selectedConfig === pool.numberSetConfig">
                        <loading-indicator v-if="saving" class="small" />
                        <template v-else>Save</template>
                    </button>
                </div>
            </fieldset>
        </form>
        <loading-indicator v-else />
    </section>
</template>

<script>
import sqmgrConfig from "@/models/sqmgrConfig";
import ModalController from "@/controllers/ModalController";
import sqmgrClient from "@/models/sqmgrClient";
import LoadingIndicator from "@/components/LoadingIndicator";

export default {
    name: "ChangeNumberSetConfig",
    components: {LoadingIndicator},
    props: {
        pool: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            selectedConfig: this.pool.numberSetConfig,
            config: null,
            saving: false,
        }
    },
    created() {
        sqmgrConfig()
            .then(config => this.config = config)
            .catch(err => ModalController.showError(err))
    },
    methods: {
        cancel() {
            ModalController.hide()
        },
        submit() {
            this.saving = true
            sqmgrClient.changeNumberSetConfig(this.pool.token, this.selectedConfig)
                .then(pool => {
                    ModalController.hide()
                    this.$emit('updated', pool)
                })
                .catch(err => {
                    ModalController.showError(err)
                })
                .finally(() => this.saving = false)
        },
        getNumberSetDescription(key) {
            const descriptions = {
                'standard': 'Drawn numbers remain the same for the whole game',
                '123f': 'Different numbers for first, second and third quarters and the final score',
                'hf': 'Different numbers for first half and final',
                '1234': 'Different numbers for all four quarters. Ignores overtime',
                'h4': 'Different numbers for first half and second half. Ignores overtime',
            }
            return descriptions[key] || ''
        }
    }
}
</script>

<style scoped lang="scss">
@use "sass:color";
@use '../variables.scss' as *;

.change-number-set-config {
    min-width: 400px;

    @include mobile {
        min-width: auto;
    }
}

.warning-box {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    background: rgba($yellow, 0.1);
    border: 1px solid rgba($yellow, 0.3);
    border-radius: $radius-md;
    margin-bottom: $space-5;
    font-size: 0.875rem;
    color: color.adjust($yellow, $lightness: -30%);

    i {
        color: $yellow;
        flex-shrink: 0;
    }
}

.option-cards {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    margin-bottom: $space-5;
}

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

.buttons {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
}
</style>
