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
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import bus from '@/utils/bus'
import authService from "@/models/authService"
import { GUEST_JOIN } from "@/constants/events"

export default {
    install(app) {
        app.config.globalProperties.$auth = authService

        app.mixin({
            created() {
                if (this.handleLoginEvent) {
                    authService.on('loginEvent', this.handleLoginEvent)
                }

                if (this.handleGuestJoinEvent) {
                    bus.on(GUEST_JOIN, this.handleGuestJoinEvent)
                }
            },

            unmounted() {
                if (this.handleLoginEvent) {
                    authService.off('loginEvent', this.handleLoginEvent)
                }

                if (this.handleGuestJoinEvent) {
                    bus.off(GUEST_JOIN, this.handleGuestJoinEvent)
                }
            },
        })
    },
}
