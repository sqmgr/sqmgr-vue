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
       <p>Loading...</p>
   </div>
</template>

<script>
    import accessTokenManager from "@/models/accessTokenManager";
    import sqmgrClient from "@/models/sqmgrClient";
    import ModalController from "@/controllers/ModalController";

    export default {
        name: "Auth0Callback",
        methods: {
            handleLoginEvent(data) {
                console.log("handleLoginEvent")
                this.$router.push(data.state.target || "/")
            }
        },
        created() {
            this.$auth.handleRedirectCallback()
                .then(() => {
                    const jwt = accessTokenManager.getGuestAccessToken()
                    if (!jwt) {
                        return
                    }

                    sqmgrClient.mergeWithGuestUser(jwt)
                        .then(() => accessTokenManager.deleteGuestAccessToken())
                        .catch(err => ModalController.showError(err))
                })
        }
    }
</script>

<style scoped>

</style>