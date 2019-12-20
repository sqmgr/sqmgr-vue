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

import EventBus from "@/models/EventBus";
import ResponseError from "@/models/ResponseError";
import accessTokenManager from "@/models/accessTokenManager";

class sqmgrClient {
    baseURL = process.env.VUE_APP_API_URL
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

    renamePool(token, name) {
        return this.updatePool(token, {action: 'rename', name })
    }

    archivePool(token) {
        return this.updatePool(token, {action: 'archive'})
    }

    unarchivePool(token) {
        return this.updatePool(token, {action: 'unarchive'})
    }

    getPoolSquares(token) {
        return this.request(`/pool/${token}/square`)
    }

    drawNumbers(token, gridId) {
        return this.request(`/pool/${token}/grid/${gridId}`, null, true, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'drawNumbers',
            })
        })
    }

    drawManualNumbers(token, gridId, homeTeamNumbers, awayTeamNumbers) {
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
                }
            })
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
                EventBus.$emit('grid-updated', true)
                return res
            })
    }

    getSquareByTokenAndSquareId(token, squareId) {
        return this.request(`/pool/${token}/square/${squareId}`)
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
                EventBus.$emit('square-updated', true)
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

    joinPool(token, passwordOrJWT, isJWT = false) {
        const data = {}
        if (isJWT) {
            data.jwt = passwordOrJWT
        } else {
            data.password = passwordOrJWT
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
}

export default new sqmgrClient()