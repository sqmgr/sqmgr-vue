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
   <div>
       <p>Loading...</p>
   </div>
</template>

<script>
    import accessTokenManager from "@/models/accessTokenManager";
    import sqmgrClient from "@/models/sqmgrClient";

    export default {
        name: "Auth0Callback",
        methods: {
            handleLoginEvent(data) {
                this.$router.push(data.state.target || "/")
            }
        },
        created() {
            this.$auth.handleAuthentication()
                .then(() => {
                    const jwt = accessTokenManager.getGuestAccessToken()
                    if (!jwt) {
                        return
                    }

                    sqmgrClient.mergeWithGuestUser(jwt)
                        .then(() => accessTokenManager.deleteGuestAccessToken())
                        .catch(err => console.warn("could not merge with guest user:", err)) // no-op
                })
        }
    }
</script>

<style scoped>

</style>