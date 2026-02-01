/*
Copyright 2019 Tom Peters

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
    <section class="draw-confirmation">
        <form @submit.prevent="submit" class="standalone">
            <p>Do you want to randomly draw the numbers for this game? This action cannot be undone.</p>

            <warning-box v-if="!allSquaresClaimed" warning="Not all squares have been claimed yet."/>

            <div v-if="!isLocked" class="field checkbox-field">
                <label>
                    <input type="checkbox" v-model="lockPool"/>
                    Lock squares to prevent further changes
                </label>
            </div>

            <div class="buttons">
                <button type="button" class="secondary" @click="cancel">Cancel</button>
                <button type="submit">Draw</button>
            </div>
        </form>
    </section>
</template>

<script>
import ModalController from "@/controllers/ModalController"
import WarningBox from "@/components/WarningBox"

export default {
    name: "DrawConfirmation",
    components: {WarningBox},
    props: {
        allSquaresClaimed: {type: Boolean, required: true},
        isLocked: {type: Boolean, required: true},
    },
    emits: ['confirm'],
    data() {
        return {
            lockPool: true,
        }
    },
    methods: {
        cancel() {
            ModalController.hide()
        },
        submit() {
            this.$emit('confirm', this.lockPool)
        },
    },
}
</script>

<style scoped lang="scss">
@use '../variables.scss' as *;

.checkbox-field {
    margin: $standard-spacing 0;

    label {
        display:     flex;
        align-items: center;
        gap:         $minimal-spacing;
        cursor:      pointer;
        font-size:   0.95em;
        color:       $text-color;

        input[type="checkbox"] {
            width:        18px;
            height:       18px;
            cursor:       pointer;
            margin-right: $minimal-spacing;
        }
    }
}
</style>
