/*
Copyright 2025 Tom Peters

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
import {createAuth0Client} from "@auth0/auth0-spa-js"
import authConfig from "../../auth_config.json"

class Auth0Service extends EventEmitter {
    auth0Client = null
    isAuthenticated = false
    profile = {}
    error = null


    async initAuth0() {
        this.auth0Client = await createAuth0Client({
            domain: authConfig.domain,
            clientId: authConfig.clientId,
            cacheLocation: 'localstorage',
            authorizationParams: {
                audience: authConfig.audience,
                redirect_uri: `${window.location.origin}/callback`,
            },
        })
    }

    async loadProfile() {
        if (this.profile && this.isAuthenticated) {
            return Promise.resolve()
        }

        return this.auth0Client.getUser()
            .then(res => {
                this.profile = res
                this.isAuthenticated = true

                console.log("loadProfile")
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

    logout(o) {
        return this.auth0Client.logout(o)
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