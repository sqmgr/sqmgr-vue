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
    <p>{{errorMessage}}</p>
</template>

<script>
    export default {
        name: "Error",
        computed: {
            errorMessage() {
                try {
                    const err = this.error.response.data.error
                    return err
                } catch (e) {
                    return this.error
                }
            }
        },
        props: {
            error: {
                type: Error,
                required: true,
            }
        }
    }
</script>

<style scoped>

</style>