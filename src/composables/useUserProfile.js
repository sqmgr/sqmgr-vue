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
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { computed, unref } from 'vue'

export function useUserProfile(userRef) {
    const displayName = computed(() => {
        const user = unref(userRef)
        if (!user) return 'User'
        if (user.email) return user.email
        if (user.store === 'sqmgr') return `Guest #${user.id}`
        return `User #${user.id}`
    })

    const initials = computed(() => {
        const user = unref(userRef)
        const email = user?.email
        if (!email) return user?.store === 'sqmgr' ? 'GU' : 'U'
        const parts = email.split('@')[0].split(/[._-]/)
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return email.substring(0, 2).toUpperCase()
    })

    const memberSince = computed(() => {
        const user = unref(userRef)
        if (!user?.created) return '...'
        const date = new Date(user.created)
        return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    })

    const authProvider = computed(() => {
        const user = unref(userRef)
        if (user?.store === 'auth0') return 'Auth0'
        if (user?.store === 'sqmgr') return 'Guest'
        return 'Unknown'
    })

    return { displayName, initials, memberSince, authProvider }
}
