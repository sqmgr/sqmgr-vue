/*
Copyright 2026 Tom Peters

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

import sqmgrClient from "@/models/sqmgrClient"
import ModalController from "@/controllers/ModalController"
import { getErrorMessage } from "@/utils/adminFormat"

// Shared "Join" action for the admin pool tables: confirm, join through the
// admin endpoint, then call `afterJoin(pool)`, which opens the pool unless
// the component overrides it.
export default {
    data() {
        return {
            joiningPool: null,
        }
    },
    methods: {
        confirmJoinPool(pool) {
            ModalController.showPrompt(
                'Join Pool',
                `Are you sure you want to join the pool "${pool.name}"?`,
                {
                    actionButton: 'Join Pool',
                    action: () => {
                        this.joinPool(pool)
                        ModalController.hide()
                    },
                },
            )
        },

        async joinPool(pool) {
            this.joiningPool = pool.token
            try {
                await sqmgrClient.adminJoinPool(pool.token)
                await this.afterJoin(pool)
            } catch (err) {
                ModalController.showError(getErrorMessage(err))
            } finally {
                this.joiningPool = null
            }
        },

        // afterJoin runs once the join succeeded; components override it to
        // stay on the page and refresh instead of navigating.
        afterJoin(pool) {
            this.$router.push(`/pool/${pool.token}`)
        },
    },
}
