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
    <form class="add-annotation" @submit.prevent="submit">
        <validation-errors :validation-errors="errors" v-if="errors" />

        <div class="field">
            <label for="annotation">Annotation</label>
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
            <button type="submit" name="submit">Annotate</button>
        </div>
    </form>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    import sqmgrConfig from "@/models/sqmgrConfig";
    import ValidationErrors from "@/components/ValidationErrors";

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
                    icon: this.annotation ? this.annotation.icon : 0,
                },
                gridAnnotationIcons: null,
            }
        },
        computed: {
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
                if (this.form.annotation.length === 0) {
                    this.errors = { Annotation: [ "cannot be empty" ] }
                    return
                }

                this.errors = null
                this.$emit('submit', this.form)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../variables.scss';

    div.options {
        display:               grid;
        grid-gap:              $minimal-spacing;
        grid-template-columns: repeat(auto-fit, 60px);
        grid-auto-columns:     auto;
        text-align:            center;

        label {
            background-color: white;
            border:           1px solid $border-color;
            padding:          $minimal-spacing;
            margin:           0;

            i {
                background-color: #fff;
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
