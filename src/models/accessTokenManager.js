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
