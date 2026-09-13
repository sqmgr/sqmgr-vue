<!--
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
-->

<template>
    <section class="oauth-authorize">
        <div class="authorize-card">
            <div class="icon-container">
                <i class="fas fa-plug"></i>
            </div>

            <template v-if="loading">
                <h1>Authorize Application</h1>
                <p class="description">Loading...</p>
            </template>

            <template v-else-if="error">
                <h1>Cannot Authorize</h1>
                <p class="description error">{{ error }}</p>
                <router-link to="/" class="action-btn">Back to SqMGR</router-link>
            </template>

            <template v-else-if="needsLogin">
                <h1>Log In to Continue</h1>
                <p class="description">
                    An application is asking for read-only access to SqMGR admin analytics.
                    Log in with your SqMGR site admin account to review the request.
                </p>
                <button class="lg" @click="logIn">Log In</button>
            </template>

            <template v-else>
                <h1>Authorize {{ client.clientName }}</h1>
                <p class="description">
                    <strong>{{ client.clientName }}</strong> is requesting <strong>read-only</strong> access to
                    SqMGR admin analytics on behalf of <strong>{{ userEmail }}</strong>.
                </p>
                <ul class="permissions">
                    <li><i class="fas fa-check"></i> Read site-wide statistics, pools, squares, and user activity</li>
                    <li><i class="fas fa-check"></i> Run read-only reports and queries</li>
                    <li><i class="fas fa-times"></i> Cannot change or delete anything</li>
                </ul>
                <p class="redirect">You will be sent back to <code>{{ redirectHost }}</code>.</p>
                <div class="actions">
                    <button class="lg" :disabled="submitting" @click="decide(true)">Approve</button>
                    <button class="lg secondary" :disabled="submitting" @click="decide(false)">Deny</button>
                </div>
                <p class="note">Access can be revoked at any time by removing the site admin role.</p>
            </template>
        </div>
    </section>
</template>

<script>
import sqmgrClient from "@/models/sqmgrClient"

// Query parameters an OAuth client sends to the authorization endpoint.
const oauthParams = [
    'client_id',
    'redirect_uri',
    'response_type',
    'code_challenge',
    'code_challenge_method',
    'state',
    'scope',
    'resource',
]

export default {
    name: "OAuthAuthorize",
    data() {
        return {
            loading: true,
            submitting: false,
            needsLogin: false,
            error: null,
            client: null,
            user: null,
        }
    },
    computed: {
        params() {
            const params = {}
            oauthParams.forEach(key => {
                const value = this.$route.query[key]
                if (typeof value === 'string') {
                    params[key] = value
                }
            })
            return params
        },
        userEmail() {
            return this.user?.email || this.$auth.profile?.email || 'your account'
        },
        redirectHost() {
            try {
                return new URL(this.params.redirect_uri).host
            } catch {
                return this.params.redirect_uri
            }
        },
    },
    methods: {
        logIn() {
            this.$auth.loginWithRedirect({
                target: this.$route.fullPath,
            })
        },
        async decide(approve) {
            this.submitting = true
            try {
                const res = await sqmgrClient.authorizeOAuthClient({...this.params, approve})
                window.location.assign(res.redirectUri)
            } catch (err) {
                this.error = err.message || 'The request could not be completed.'
                this.submitting = false
            }
        },
        async load() {
            if (!this.params.client_id || !this.params.redirect_uri) {
                this.error = 'This authorization link is missing required parameters.'
                return
            }

            try {
                await this.$auth.loadProfile()
            } catch {
                this.needsLogin = true
                return
            }

            try {
                this.user = await sqmgrClient.getUser()
            } catch {
                this.error = 'Your account could not be loaded. Please try again.'
                return
            }

            if (!this.user.is_site_admin) {
                this.error = 'Only SqMGR site admins can authorize this application.'
                return
            }

            try {
                this.client = await sqmgrClient.getOAuthClient(this.params.client_id)
            } catch {
                this.error = 'This application is not registered with SqMGR.'
                return
            }

            if (!this.client.redirectUris.includes(this.params.redirect_uri)) {
                this.error = 'The redirect address does not match the registered application.'
            }
        },
    },
    async created() {
        try {
            await this.load()
        } finally {
            this.loading = false
        }
    },
}
</script>

<style lang="scss" scoped>
@use '../../variables.scss' as *;

section.oauth-authorize {
    display:         flex;
    justify-content: center;
    align-items:     center;
    min-height:      60vh;
    padding:         $space-5;
}

.authorize-card {
    background:    $surface-elevated;
    border:        1px solid $light-gray;
    border-radius: $radius-xl;
    padding:       $space-12 $space-10;
    text-align:    center;
    max-width:     480px;
    width:         100%;
    box-shadow:    $shadow-card;

    .icon-container {
        width:           72px;
        height:          72px;
        background:      rgba($primary, 0.08);
        border-radius:   $radius-xl;
        display:         flex;
        align-items:     center;
        justify-content: center;
        margin:          0 auto $space-6;

        i {
            font-size: 2em;
            color:     $primary;
        }
    }

    h1 {
        font-size:      1.6em;
        margin-bottom:  $space-3;
        color:          $text-color;
        font-weight:    700;
        letter-spacing: -0.01em;
    }

    .description {
        color:         $dark-gray;
        line-height:   1.65;
        margin-bottom: $space-6;
        font-size:     0.95em;

        &.error {
            color: $red;
        }
    }

    .permissions {
        list-style: none;
        padding:    0;
        margin:     0 0 $space-6;
        text-align: left;

        li {
            padding:     $space-2 0;
            color:       $text-color;
            font-size:   0.95em;
            line-height: 1.5;

            i {
                width:        1.5em;
                margin-right: $space-2;
                color:        $primary;
            }

            i.fa-times {
                color: $gray;
            }
        }
    }

    .redirect {
        color:         $gray;
        font-size:     0.85em;
        margin-bottom: $space-6;

        code {
            color: $dark-gray;
        }
    }

    .actions {
        display:        flex;
        gap:            $space-3;
        flex-direction: column;
        margin-bottom:  $space-4;

        button.lg {
            width: 100%;
        }
    }

    .note {
        color:     $gray;
        font-size: 0.8em;
        margin:    0;
    }
}

@media (max-width: 480px) {
    section.oauth-authorize {
        min-height: 50vh;
        padding:    $space-4;
    }

    .authorize-card {
        padding: $space-8 $space-5;
    }
}
</style>
