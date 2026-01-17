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
@use '../variables.scss' as *;

section.login {
    display:         flex;
    justify-content: center;
    align-items:     center;
    min-height:      60vh;
    padding:         $standard-spacing;
}

.login-card {
    background:     $surface-elevated;
    border:         1px solid $light-gray;
    border-radius:  16px;
    padding:        $standard-spacing * 2;
    text-align:     center;
    max-width:      400px;
    width:          100%;
    box-shadow:     0 2px 8px rgba(0, 0, 0, 0.04);
    transition:     all 0.3s ease;

    &:hover {
        box-shadow:   0 12px 24px rgba(0, 0, 0, 0.1);
        border-color: transparent;
    }

    .icon-container {
        width:           80px;
        height:          80px;
        background:      linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($primary, 0.05) 100%);
        border-radius:   20px;
        display:         flex;
        align-items:     center;
        justify-content: center;
        margin:          0 auto $standard-spacing * 1.5;

        i {
            font-size: 2.5em;
            color:     $primary;
        }
    }

    h1 {
        font-size:     1.75em;
        margin-bottom: $standard-spacing * 0.75;
        color:         $text-color;
    }

    .description {
        color:         $dark-gray;
        line-height:   1.6;
        margin-bottom: $standard-spacing * 1.5;
    }

    button.lg {
        width:         100%;
        margin-bottom: $standard-spacing;
    }

    .note {
        color:     $dark-gray;
        font-size: 0.85em;
        margin:    0;
    }
}

@media (max-width: 480px) {
    section.login {
        min-height: 50vh;
        padding:    $standard-spacing * 0.75;
    }

    .login-card {
        padding: $standard-spacing * 1.5;

        .icon-container {
            width:  64px;
            height: 64px;

            i {
                font-size: 2em;
            }
        }

        h1 {
            font-size: 1.5em;
        }
    }
}
</style>