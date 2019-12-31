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
    <form class="add-annotation" @submit.prevent="$emit('submit', form.annotation)">
        <div class="field">
            <label for="annotation">Annotation</label>
            <input type="text" id="annotation" name="annotation" v-model="form.annotation" ref="name" placeholder="Annotation">
        </div>

        <div class="buttons">
            <button type="button" class="secondary" @click.prevent="ModalController.hide()">Cancel</button>
            <button type="submit" name="submit">Annotate</button>
        </div>
    </form>
</template>

<script>
    import ModalController from '@/controllers/ModalController'
    export default {
        name: "Annotate.vue",
        props: {
            annotation: {
                type: Object,
            }
        },
        data() {
            return {
                ModalController,
                form: {
                    annotation: this.annotation ? this.annotation.annotation : '',
                }
            }
        },
        mounted() {
            setTimeout(() => this.$refs.name.focus(), 1)
        }
    }
</script>
