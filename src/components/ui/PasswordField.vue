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
    <div class="field">
        <label for="password">Join Password</label>
        <p class="requirement">Must be at least {{minLength}} characters</p>
        <div class="password">
            <input type="password"
                   ref="password"
                   id="password"
                   name="password"
                   placeholder="Join Password"
                   autocomplete="off"
                   v-model="password"
                   :pattern="`.{${minLength},}`"
                   :title="`Password must be at least ${minLength} characters`"
                   required
            />
            <input type="password"
                   id="confirm-password"
                   name="confirm-password"
                   placeholder="Password Confirmation"
                   autocomplete="off"
                   v-model="confirmPassword"
                   required
            />

            <div class="passwords-match-check">
                <span v-if="showPasswordsDoNotMatchMessage"><i
                        class="fas fa-times"></i> The passwords do not match</span>
                <span v-else-if="confirmPassword.length > 0"><i class="fas fa-check"></i> The passwords match</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PasswordField",
        props: {
            minLength: {
                type: Number,
                default: 8,
            },
            modelValue: String,
        },
        emits: ['update:modelValue'],
        data() {
            return {
                password: this.modelValue,
                confirmPassword: '',
            }
        },
        watch: {
            password(val) {
                this.$emit('update:modelValue', val)
            },
            showPasswordsDoNotMatchMessage(val) {
                if (val) {
                    this.$refs.password.setCustomValidity('The passwords do not match')
                } else {
                    this.$refs.password.setCustomValidity('')
                }
            }
        },
        computed: {
            showPasswordsDoNotMatchMessage() {
                return this.confirmPassword.length > 0 && this.password !== this.confirmPassword
            }
        },
    }
</script>

<style scoped lang="scss">
    @use '../../variables' as *;
    .passwords-match-check {
        font-size:  0.8em;
        margin-top: $minimal-spacing;

        i.fa-check {
            color: $primary;
        }

        i.fa-times {
            color: $red;
        }
    }
</style>