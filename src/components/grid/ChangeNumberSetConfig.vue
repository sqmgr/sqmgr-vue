/*
Copyright 2024 Tom Peters

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
    <section class="change-number-set-config">
        <div class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <span>You can change the number rotation rules up until you draw the numbers for your first game.</span>
        </div>

        <form v-if="config" @submit.prevent="submit" class="standalone">
            <fieldset>
                <div class="option-cards">
                    <option-card
                        v-for="nsc in config.numberSetConfigs"
                        :key="nsc.key"
                        :value="nsc.key"
                        :title="nsc.label"
                        :description="getNumberSetDescription(nsc.key)"
                        :selected="selectedConfig === nsc.key"
                        name="number-set-config"
                        @update:selected="selectedConfig = $event"
                    />
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
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import OptionCard from "@/components/ui/OptionCard";
import { getNumberSetDescription } from "@/utils/numberSetDescriptions";

export default {
    name: "ChangeNumberSetConfig",
    components: {LoadingIndicator, OptionCard},
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
        getNumberSetDescription,
    }
}
</script>

<style scoped lang="scss">
@use "sass:color";
@use '../../variables.scss' as *;

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

.buttons {
    display: flex;
    gap: $space-3;
    justify-content: flex-end;
}
</style>
