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

import authService from "@/models/authService";
import sqmgrClient from "@/models/sqmgrClient";

const storageKey = 'guestAccessToken'

class accessTokenManager {
    async getAccessToken(createGuestToken) {
        try {
            return await authService.getTokenSilently()
        } catch {
            // no-op
        }

        const accessToken = this.getGuestAccessToken()
        if (!accessToken) {
            if (!createGuestToken) {
                throw new Error('access token not found')
            }

            return this.createGuestAccessToken()
        }

        return accessToken
    }

    createGuestAccessToken() {
       return new Promise((resolve, reject) => {
           sqmgrClient.createGuestUser()
               .then(data => {
                   sessionStorage.setItem(storageKey, JSON.stringify(data))
                   resolve(data.jwt)
               }, reject)
       })
    }

    getGuestAccessToken() {
        try {
            const data = JSON.parse(sessionStorage.getItem(storageKey))
            if (data.expiresAt * 1000 > Date.now()) {
                return data.jwt
            }
        } catch {
            // no-op
        }

        return;
    }

    deleteGuestAccessToken() {
        sessionStorage.removeItem(storageKey)
    }
}

export default new accessTokenManager()
