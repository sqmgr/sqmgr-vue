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

import bus from '@/utils/bus'
import authService from "@/models/authService"

export default {
    install(Vue) {
        Vue.prototype.$auth = authService

        Vue.mixin({
            created() {
                if (this.handleLoginEvent) {
                    authService.addListener('loginEvent', this.handleLoginEvent)
                }

                if (this.handleGuestJoinEvent) {
                    bus.$on('guestJoin', this.handleGuestJoinEvent)
                }
            },

            destroyed() {
                if (this.handleLoginEvent) {
                    authService.removeListener('loginEvent', this.handleLoginEvent)
                }

                if (this.handleGuestJoinEvent) {
                    bus.$off('guestJoin', this.handleGuestJoinEvent)
                }
            },
        })
    },
}