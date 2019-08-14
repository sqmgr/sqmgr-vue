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

import EventEmitter from 'events'
import auth0 from 'auth0-js'
import authConfig from '../../auth_config'

const localStorageKey = 'loggedIn'
const loginEvent = 'loginEvent'

const webAuth = new auth0.WebAuth({
    domain: authConfig.domain,
    redirectUri: `${window.location.origin}/callback`,
    clientID: authConfig.clientId,
    audience: authConfig.audience,
    responseType: 'token id_token',
    scope: 'openid profile email',
})

class AuthService extends EventEmitter {
    idToken = null
    profile = null
    tokenExpiry = null

    accessToken = null
    accessTokenExpiry = null

    login(appState = {}) {
        if (!appState.target) {
            appState.target = '/account'
        }
        webAuth.authorize({appState})
    }

    handleAuthentication() {
        return new Promise((res, rej) => {
            webAuth.parseHash((err, authResult) => {
                if (err) {
                    rej(err)
                    return
                }

                this.localLogin(authResult)
                res(authResult.idToken)
            })
        })
    }

    localLogin(authResult) {
        this.idToken = authResult.idToken
        this.profile = authResult.idTokenPayload
        this.tokenExpiry = new Date(this.profile.exp * 1000)

        this.accessToken = authResult.accessToken
        this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000)

        localStorage.setItem(localStorageKey, 'true')

        this.emit(loginEvent, {
            loggedIn: true,
            profile: this.profile,
            state: authResult.appState || {},
        })
    }

    renewTokens() {
        return new Promise((res, rej) => {
            if (localStorage.getItem(localStorageKey) !== 'true') {
                rej('not logged in')
                return
            }

            webAuth.checkSession({}, (err, authResult) => {
                if (err) {
                    rej(err)
                    return
                }

                this.localLogin(authResult)
                res(authResult)
            })
        })
    }

    logOut() {
        localStorage.removeItem(localStorageKey)

        this.idToken = null
        this.tokenExpiry = null
        this.profile = null

        webAuth.logout({
            returnTo: window.location.origin,
        })

        this.emit(loginEvent, {loggedIn: false})
    }

    isAuthenticated() {
        return Date.now() < this.tokenExpiry &&
            localStorage.getItem(localStorageKey) === 'true'
    }

    isAccessTokenValid() {
        return this.accessToken &&
            this.accessTokenExpiry &&
            Date.now() < this.accessTokenExpiry
    }

    getAccessToken() {
        return new Promise(((resolve, reject) => {
            if (this.isAccessTokenValid()) {
                resolve(this.accessToken)
                return
            }

            this.renewTokens()
                .then(authResult => {
                    resolve(authResult.accessToken)
                }, reject)
        }))
    }
}

export default new AuthService()