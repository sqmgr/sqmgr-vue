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
import WarningBox from "@/components/ui/WarningBox"

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
@use '../../variables.scss' as *;

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
