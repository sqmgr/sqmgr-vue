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
along with this program.  If not, see https://www.gnu.org/licenses/.
*/

<template>
    <section class="login">
        <div class="login-card">
            <div class="icon-container">
                <i class="fas fa-user-circle"></i>
            </div>
            <h1>Log In to SqMGR</h1>
            <p class="description">
                This feature requires a SqMGR account.
                Registration is quick and the site is 100% free.
            </p>
            <button class="lg" @click="logIn">
                Log In / Sign Up
            </button>
            <p class="note">No payment info required</p>
        </div>
    </section>
</template>

<script>
export default {
    name: "LogIn",
    methods: {
        logIn() {
            this.$auth.loginWithRedirect({
                target: this.$route.query.target,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../variables.scss' as *;

section.login {
    display:         flex;
    justify-content: center;
    align-items:     center;
    min-height:      60vh;
    padding:         $space-5;
}

.login-card {
    background:     $surface-elevated;
    border:         1px solid $light-gray;
    border-radius:  $radius-xl;
    padding:        $space-12 $space-10;
    text-align:     center;
    max-width:      420px;
    width:          100%;
    box-shadow:     $shadow-card;

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
        margin-bottom: $space-8;
        font-size:     0.95em;
    }

    button.lg {
        width:         100%;
        margin-bottom: $space-4;
    }

    .note {
        color:     $gray;
        font-size: 0.8em;
        margin:    0;
    }
}

@media (max-width: 480px) {
    section.login {
        min-height: 50vh;
        padding:    $space-4;
    }

    .login-card {
        padding: $space-8 $space-6;

        .icon-container {
            width:  56px;
            height: 56px;

            i {
                font-size: 1.5em;
            }
        }

        h1 {
            font-size: 1.4em;
        }
    }
}
</style>