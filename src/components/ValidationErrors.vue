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
    <div class="errors" v-if="validationErrors">
        <p>There were one or more errors:</p>

        <ul>
            <li v-for="key in Object.keys(validationErrors).sort()" :key="key">
                {{key}}
                <ul>
                    <li v-for="(err, i) in validationErrors[key]" :key="`${i}-${err}`">{{err}}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "ValidationErrors",
        props: {
            validationErrors: Array
        }
    }
</script>

<style scoped>

</style>