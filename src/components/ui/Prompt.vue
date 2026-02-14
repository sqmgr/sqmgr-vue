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
    <div>
        <p>{{description}}</p>

        <template v-if="warning">
            <warning-box :warning="warning" />
        </template>

        <div class="buttons">
            <template v-if="dismissButton">
                <button type="button" @click.prevent="ModalController.hide()">{{dismissButton}}</button>
            </template>
            <template v-else>
                <button type="button" class="secondary" @click.prevent="$emit('cancel-was-clicked')">{{ cancelButton || 'Cancel' }}</button>
                <button type="button" :class="{ destructive: isDestructive }" @click.prevent="$emit('action-was-clicked')">{{actionButton}}</button>
            </template>
        </div>
    </div>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    import WarningBox from "@/components/ui/WarningBox";

    export default {
        name: "Prompt.vue",
        components: {WarningBox},
        props: {
            description: {
                type: String,
                required: true,
            },
            actionButton: String,
            cancelButton: String,
            dismissButton: String,
            warning: String,
            isDestructive: {
                type: Boolean,
            }
        },
        data() {
            return {
                ModalController
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>