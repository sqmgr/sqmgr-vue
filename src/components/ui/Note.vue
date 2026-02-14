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
    <form class="add-note" @submit.prevent.stop="submit">
        <div class="field">
            <label for="note">Note</label>
            <input type="text" id="note" name="note" v-model="form.note" ref="name" placeholder="Reason for change">
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()">Cancel</button>
            <button type="submit" name="submit">Make Note</button>
        </div>
    </form>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    export default {
        name: "Note.vue",
        data() {
            return {
                ModalController,
                form: {
                    note: null
                }
            }
        },
        mounted() {
            setTimeout(() => this.$refs.name.focus(), 1)
        },
        methods: {
            submit() {
                this.$emit('save', this.form.note)
            }
        }
    }
</script>
