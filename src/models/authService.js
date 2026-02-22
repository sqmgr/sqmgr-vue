/*
Copyright 2025 Tom Peters

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

import mitt from 'mitt'
import authConfig from "../../auth_config.json"

class Auth0Service {
    auth0Client = null
    isAuthenticated = false
    profile = {}
    error = null
    #emitter = mitt()

    on(type, handler) {
        this.#emitter.on(type, handler)
    }

    off(type, handler) {
        this.#emitter.off(type, handler)
    }

    emit(type, event) {
        this.#emitter.emit(type, event)
    }


    async initAuth0() {
        const {createAuth0Client} = await import("@auth0/auth0-spa-js")
        this.auth0Client = await createAuth0Client({
            domain: authConfig.domain,
            clientId: authConfig.clientId,
            cacheLocation: 'localstorage',
            useRefreshTokens: true,
            authorizationParams: {
                audience: authConfig.audience,
                redirect_uri: `${window.location.origin}/callback`,
            },
        })

        // Restore auth state from cached session
        this.isAuthenticated = await this.auth0Client.isAuthenticated()
        if (this.isAuthenticated) {
            this.profile = await this.auth0Client.getUser() || {}
        }
    }

    async loadProfile() {
        // Always verify we can get a token, not just that we have cached state
        try {
            await this.auth0Client.getTokenSilently()
        } catch {
            // Token refresh failed - clear cached state and notify UI
            this.isAuthenticated = false
            this.profile = {}
            this.emit('loginEvent', {
                loggedIn: false,
                profile: {},
                state: null,
            })
            throw new Error('not authenticated')
        }

        if (this.profile && this.isAuthenticated) {
            return Promise.resolve()
        }

        return this.auth0Client.getUser()
            .then(res => {
                if (!res) throw new Error('not authenticated')

                this.profile = res
                this.isAuthenticated = true

                this.emit('loginEvent', {
                    loggedIn: true,
                    profile: this.profile,
                    state: null,
                })
            })
    }

    loginWithRedirect(o = {}) {
        if (!o.target) {
            o.target = '/account'
        }

        return this.auth0Client.loginWithRedirect({
            appState: o,
        })
    }

    logout() {
        return this.auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin,
            }
        })
    }

    getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o)
    }

    async handleRedirectCallback() {
        let appState
        try {
            appState = await this.auth0Client.handleRedirectCallback().then(res => res.appState)
        } catch (e) {
            this.error = e
        } finally {
            this.isAuthenticated = await this.auth0Client.isAuthenticated()
            this.profile = this.isAuthenticated ? await this.auth0Client.getUser() : {}

            if (this.isAuthenticated) {
                console.log("handleRedirectCallback")
                this.emit('loginEvent', {
                    loggedIn: true,
                    profile: this.profile,
                    state: appState,
                })
            }
        }
    }
}

export default new Auth0Service()