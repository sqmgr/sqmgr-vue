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

import EventBus from "@/models/EventBus";
import ResponseError from "@/models/ResponseError";
import accessTokenManager from "@/models/accessTokenManager";
import { GRID_UPDATED, SQUARE_UPDATED } from "@/constants/events";

class sqmgrClient {
    baseURL = import.meta.env.VITE_API_URL
    _user = null

    async request(path, query, requiresAuth = true, init = {}) {
        let url = `${this.baseURL}${path}`
        if (query) {
            const keys = Object.keys(query)
            if (keys.length > 0) {
                url += '?'
                Object.keys(query).forEach(key => {
                    url += `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}&`
                })
                url = url.substr(0, url.length - 1)
            }
        }

        if (requiresAuth) {
            const accessToken = await accessTokenManager.getAccessToken()
            const authHeader = {Authorization: `Bearer ${accessToken}`}
            if (init.headers) {
                init.headers = Object.assign({}, init.headers, authHeader)
            } else {
                init.headers = authHeader
            }
        }

        return fetch(url, init)
            .then(async res => {
                if (res.status < 200 || res.status >= 300) {
                    const data = await res.json()
                    throw new ResponseError(res.status, data)
                }

                // don't try to decode a no-content response
                if (res.status === 204) {
                    return
                }

                return res.json()
            })
    }

    async getUserOwnedPools(includeArchived = false, offset = 0, limit = 10) {
        const user = await this.getUser()
        return this.request(`/user/${user.id}/pool/own`, {offset, limit, includeArchived})
    }

    async getUserJoinedPools(offset = 0, limit = 10) {
        const user = await this.getUser()
        return this.request(`/user/${user.id}/pool/belong`, {offset, limit})
    }

    getPoolByToken(token) {
        return this.request(`/pool/${token}`)
    }

    getPoolGridsByToken(token, offset = 0, limit = 50) {
        return this.request(`/pool/${token}/grid`, {offset, limit})
    }

    getPoolGridByTokenAndGridId(token, gridId) {
        return this.request(`/pool/${token}/grid/${gridId}`)
    }

    deletePoolGridByTokenAndGridId(token, gridId) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'DELETE'
        })
    }

    setPoolGridSquareAnnotation(token, gridId, squareId, annotation, icon) {
        return this.request(`/pool/${token}/grid/${gridId}/square/${squareId}/annotation`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                annotation,
                icon: parseInt(icon, 10),
            })
        })
    }

    deletePoolGridSquareAnnotation(token, gridId, squareId) {
        return this.request(`/pool/${token}/grid/${gridId}/square/${squareId}/annotation`, null, true, {
            method: 'DELETE'
        })
    }

    updatePool(token, data) {
        return this.request(`/pool/${token}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }

    changeJoinPassword(token, password, resetMembership) {
        return this.updatePool(token, {
            action: 'changeJoinPassword',
            password,
            resetMembership,
        })
    }

    lockPool(token) {
        return this.updatePool(token, {action: 'lock'})
    }

    unlockPool(token) {
        return this.updatePool(token, {action: 'unlock'})
    }

    reorderGrids(token, ids) {
        return this.updatePool(token, {action: 'reorderGrids', ids})
    }

    setPasswordRequiredForPool(token, passwordRequired) {
        return this.updatePool(token, {action: 'passwordRequired', passwordRequired })
    }

    setOpenAccessOnLockForPool(token, openAccessOnLock) {
        return this.updatePool(token, {action: 'accessOnLock', openAccessOnLock })
    }

    renamePool(token, name) {
        return this.updatePool(token, {action: 'rename', name })
    }

    archivePool(token) {
        return this.updatePool(token, {action: 'archive'})
    }

    unarchivePool(token) {
        return this.updatePool(token, {action: 'unarchive'})
    }

    changeNumberSetConfig(token, numberSetConfig) {
        return this.updatePool(token, {
            action: 'changeNumberSetConfig',
            numberSetConfig
        })
    }

    getPoolSquares(token) {
        return this.request(`/pool/${token}/square`)
    }

    drawNumbers(token, gridId, lockPool = true) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'drawNumbers',
                data: { lockPool }
            })
        })
        .then(res => {
            EventBus.emit(GRID_UPDATED, true)
            return res
        })
    }

    drawManualNumbers(token, gridId, homeTeamNumbers, awayTeamNumbers, lockPool = true) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'drawManualNumbers',
                data: {
                    homeTeamNumbers,
                    awayTeamNumbers,
                    lockPool,
                }
            })
        })
        .then(res => {
            EventBus.emit(GRID_UPDATED, true)
            return res
        })
    }

    drawManualNumbersMultiSet(token, gridId, numberSets, lockPool = true) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'drawManualNumbers',
                data: {
                    numberSets,
                    lockPool,
                }
            })
        })
        .then(res => {
            EventBus.emit(GRID_UPDATED, true)
            return res
        })
    }

    saveGrid(token, gridId, data) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save',
                data,
            })
        })
            .then(res => {
                EventBus.emit(GRID_UPDATED, true)
                return res
            })
    }

    getSquareByTokenAndSquareId(token, squareId, gridId = null) {
        const query = gridId ? { gridId } : null
        return this.request(`/pool/${token}/square/${squareId}`, query)
    }

    updateSquare(token, squareId, data) {
        return this.request(`/pool/${token}/square/${squareId}`, null, true, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then(res => {
                EventBus.emit(SQUARE_UPDATED, true)
                return res
            })
    }

    claimSquare(token, squareId, claimant) {
        return this.updateSquare(token, squareId, {claimant})
    }

    claimSquareWithSecondary(token, squareId, secondarySquareId, claimant) {
        return this.updateSquare(token, squareId, {claimant, secondarySquareId})
    }

    unclaimSquare(token, squareId) {
        return this.updateSquare(token, squareId, {unclaim: true})
    }

    renameSquare(token, squareId, claimant) {
        return this.updateSquare(token, squareId, {claimant, rename: true})
    }

    setSquareState(token, squareId, state, note) {
        return this.updateSquare(token, squareId, {state, note})
    }

    bulkUpdateSquares(token, data) {
        return this.request(`/pool/${token}/squares/bulk`, null, true, {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => {
            EventBus.emit(SQUARE_UPDATED, true)
            return res
        })
    }

    getPoolLogs(token, offset = 0, limit = 100) {
        return this.request(`/pool/${token}/log`, {offset, limit})
    }

    getPoolConfiguration() {
        return this.request(`/pool/configuration`, null, false)
    }

    createPool(data) {
        return this.request(`/pool`, null, true, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    createGuestUser() {
        return this.request(`/user/guest`, null, false, {
            method: 'POST'
        })
    }

    getPoolInviteToken(token) {
        return this.request(`/pool/${token}/invitetoken`)
    }

    joinPool(token, passwordOrInvite, isInvite = false) {
        const data = {}
        if (isInvite) {
            data.invite = passwordOrInvite
        } else {
            data.password = passwordOrInvite
        }
        return this.request(`/pool/${token}/member`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }

    async mergeWithGuestUser(guestJWT) {
        const user = await this.getUser()
        return this.request(`/user/${user.id}/guestjwt`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({jwt: guestJWT})
        })
    }

    async leavePool(token) {
        const user = await this.getUser()
        return this.request(`/user/${user.id}/pool/${token}`, null, true, {
            method: 'DELETE',
        })
    }

    async getUser() {
        if (!this._user) {
            this._user = await this.request(`/user/self`)
        }

        return this._user
    }

    async getUserStats() {
        return this.request(`/user/self/stats`)
    }

    // Admin methods
    async getAdminStats(period = 'all') {
        const query = {}
        if (period && period !== 'all') {
            query.period = period
        }
        return this.request('/admin/stats', Object.keys(query).length > 0 ? query : null)
    }

    async getAdminPools(search = '', offset = 0, limit = 25) {
        const query = { offset, limit }
        if (search) query.search = search
        return this.request('/admin/pools', query)
    }

    async adminJoinPool(token) {
        return this.request(`/admin/pool/${token}/join`, null, true, { method: 'POST' })
    }

    async getAdminUser(userId) {
        return this.request(`/admin/user/${userId}`)
    }

    async getAdminUserPools(userId, includeArchived = false, offset = 0, limit = 25) {
        const query = { offset, limit }
        if (includeArchived) query.includeArchived = 'true'
        return this.request(`/admin/user/${userId}/pools`, query)
    }

    async getAdminUsers(search = '', offset = 0, limit = 25, sortBy = '', sortDir = 'desc') {
        const query = { offset, limit }
        if (search) query.search = search
        if (sortBy) query.sortBy = sortBy
        if (sortDir) query.sortDir = sortDir
        return this.request('/admin/users', query)
    }

    async getAdminEvents(offset = 0, limit = 25, sortBy = '', sortDir = 'desc') {
        const query = { offset, limit }
        if (sortBy) query.sortBy = sortBy
        if (sortDir) query.sortDir = sortDir
        return this.request('/admin/events', query)
    }

    async getAdminEventGrids(eventId, offset = 0, limit = 25) {
        return this.request(`/admin/events/${eventId}/grids`, { offset, limit })
    }

    // BDL (Ball Don't Lie) API methods
    async getBDLLeagues() {
        return this.request('/bdl/leagues', null, false)
    }

    async getBDLEvents(league, status = 'scheduled', limit = 50, offset = 0, search = '') {
        const query = { league, status, limit, offset }
        if (search && search.length >= 2) query.search = search
        return this.request('/bdl/events', query, false)
    }

    async getBDLEvent(eventId) {
        return this.request(`/bdl/events/${eventId}`, null, false)
    }

    async getBDLTeams(league) {
        return this.request('/bdl/teams', { league }, false)
    }
}

export default new sqmgrClient()