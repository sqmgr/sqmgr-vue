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
    <section class="login">
        <h1>Log In to SqMGR</h1>

        <p>That feature requires a SqMGR account. Registration and the SqMGR site is 100% free.</p>

        <p>You can create an account or log in by clicking <a href="#" @click.prevent="logIn">here</a>.</p>
    </section>
</template>

<script>
    import authService from "@/models/authService";

    export default {
        name: "LogIn",
        methods: {
            logIn() {
                authService.login({
                    target: this.$route.query.target,
                })
            },
        },
    }
</script>

<style scoped>

</style>