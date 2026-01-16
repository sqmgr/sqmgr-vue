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
    @import '../variables';
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