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
    <div>
        <div class="numbers">
            <template v-for="(num, i) in numbers" :key="i">
                <input :class="{ duplicate: duplicates[num] }"
                       type="text"
                       inputmode="numeric"
                       pattern="[0-9]"
                       maxlength="1"
                       v-model="numbers[i]"
                       :placeholder="`pos ${i + 1}`"/>
            </template>
        </div>

        <div class="number-validator">
            <span v-if="missingNumbers.length === 0"><i class="fas fa-check"></i> OK!</span>
            <span v-else><i class="fas fa-times"></i> Missing numbers: {{ missingNumbers.join(', ') }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManualDrawNumbers",
        props: {
            modelValue: {
                type: Object,
                required: true,
            }
        },
        emits: ['update:modelValue'],
        data() {
            return {
                numbers: [...this.modelValue.numbers],
                missingNumbers: [],
                duplicates: {},
            }
        },
        watch: {
            numbers: {
                handler() {
                    this.validateNumbers()
                    this.$emit('update:modelValue', {
                        numbers: this.numbers,
                        valid: this.missingNumbers.length === 0,
                    })
                },
                deep: true,
            }
        },
        mounted() {
            this.$el.querySelectorAll('input').forEach(input => {
                input.onfocus = ev => {
                    ev.target.select()
                    ev.target.setSelectionRange && ev.target.setSelectionRange(0, 99999)
                }

                input.onkeyup = ev => {
                    if (ev.key === 'Backspace' && input.previousElementSibling) {
                        input.previousElementSibling.select()
                        input.previousElementSibling.setSelectionRange && input.previousElementSibling.setSelectionRange(0, 99999)
                        ev.preventDefault()
                    }
                }

                input.oninput = ev => {
                    if (ev.inputType === 'deleteContentBackward') {
                        return
                    }

                    if (input.nextElementSibling && input.nextElementSibling.tagName === 'INPUT') {
                        input.nextElementSibling.select()
                        input.nextElementSibling.setSelectionRange && input.nextElementSibling.setSelectionRange(0, 99999)
                    } else {
                        input.select()
                        input.setSelectionRange && input.setSelectionRange(0, 99999)
                    }
                }
            })

            this.validateNumbers()
        },
        methods: {
            select() {
                this.$el.querySelector('input').select()
            },
            validateNumbers() {
                this.duplicates = {}

                const want = new Map()
                for (let i = 0; i < 10; i++) want.set(i, true)
                for (let i = 0; i < this.numbers.length; i++) {
                    if (isNaN(this.numbers[i]) || this.numbers[i] < 0 || this.numbers[i] > 9 || `${this.numbers[i]}`.length > 1) {
                        this.numbers[i] = 0
                    }
                }

                this.numbers.forEach(n => {
                    const nInt = parseInt(n, 10)
                    if (want.get(nInt) !== undefined) {
                        want.delete(nInt)
                    } else {
                        this.duplicates[nInt] = true
                    }
                })

                this.missingNumbers = Array.from(want.keys())
            }
        }
    }
</script>

<style scoped lang="scss">
    @use '../variables.scss' as *;

    div.numbers {
        display:               grid;
        grid-template-columns: repeat(10, 1fr);
        grid-gap:              $minimal-spacing;

        @media(max-width: 400px + 9 * $minimal-spacing) {
            grid-template-columns: repeat(5, 1fr);
        }
    }

    input[type="text"] {
        text-align: center;

        &.duplicate {
            border-color: $red;
        }

        &::placeholder {
            font-size: 0.7em;
        }
    }

    div.number-validator {
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