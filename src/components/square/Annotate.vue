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
    <form class="add-annotation" @submit.prevent="submit">
        <validation-errors :validation-errors="errors" v-if="errors" />

        <div class="field">
            <label for="annotation" class="required">Annotation</label>
            <input type="text" id="annotation" name="annotation" v-model="form.annotation" ref="name"
                   placeholder="Annotation">
        </div>

        <div class="field">
            <label>Icon</label>

            <div class="options">
                <label v-for="key in gridAnnotationIconsKeys" :key="key">
                    <i :class="`fas fa-${gridAnnotationIcons[key].name}`"></i>
                    <input type="radio" v-model="form.icon" :value="key">
                </label>
            </div>
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()">Cancel</button>
            <button type="submit" name="submit" :disabled="!canSubmit">Annotate</button>
        </div>
    </form>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    import sqmgrConfig from "@/models/sqmgrConfig";
    import ValidationErrors from "@/components/ui/ValidationErrors";

    export default {
        name: "Annotate.vue",
        components: {ValidationErrors},
        props: {
            annotation: {
                type: Object,
            }
        },
        data() {
            return {
                ModalController,
                errors: null,
                form: {
                    annotation: this.annotation ? this.annotation.annotation : '',
                    icon: this.annotation ? String(this.annotation.icon) : null,
                },
                gridAnnotationIcons: null,
            }
        },
        computed: {
            canSubmit() {
                return this.form.annotation.length > 0 && this.form.icon !== null && this.form.icon !== ''
            },
            gridAnnotationIconsKeys() {
                if (!this.gridAnnotationIcons) {
                    return []
                }

                return Object.keys(this.gridAnnotationIcons).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
            }
        },
        mounted() {
            sqmgrConfig()
                .then(res => this.gridAnnotationIcons = res.gridAnnotationIcons)
                .catch(err => ModalController.showError(err))

            setTimeout(() => this.$refs.name.focus(), 1)
        },
        methods: {
            submit() {
                if (!this.canSubmit) {
                    return
                }

                this.errors = null
                this.$emit('submit', this.form)
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../../variables.scss' as *;

    div.options {
        display:               grid;
        grid-gap:              $minimal-spacing;
        grid-template-columns: repeat(auto-fit, 60px);
        grid-auto-columns:     auto;
        text-align:            center;

        label {
            background-color: $surface-elevated;
            border:           1px solid $border-color;
            padding:          $minimal-spacing;
            margin:           0;

            i {
                background-color: $surface-elevated;
                color:            $primary;
                display:          block;
            }

            input[type="radio"] {
                display:    block;
                margin:     $minimal-spacing auto;
                text-align: center;
            }
        }
    }
</style>
