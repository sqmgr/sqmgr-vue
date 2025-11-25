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
    <section class="tipjar">
        <h1>SqMGR Tip Jar</h1>

        <div class="columns">
            <div class="note">
                <p>
                    <strong>Do not pay for your squares here!</strong>
                </p>

                <p>Payments for squares should be sent to the person running your pool. Money sent here is to help keep this site 100% free to use and ad-free.</p>
            </div>

            <div>
                <p>If you like this service, please consider chipping in to help cover server costs. This ensures I can
                    keep
                    this site up free of charge and without any obnoxious ads. If you're inclined to chip in, my Venmo
                    username is <a
                        href="https://venmo.com/?txn=pay&audience=public&recipients=thomaspeters&amount=10&note=SqMGR">thomaspeters</a>.
                </p>

                <p>The source code for this site is also open-source. So if tipping isn't your thing, perhaps
                    donating some of your brain power is! See <a href="https://github.com/sqmgr/sqmgr">here</a> for the
                    source code.</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "Donate",
}
</script>

<style scoped>
section.tipjar {
    max-width: 1200px;
    margin: 0 auto;

    div.columns {
        display: flex;
        flex-direction: column;
        gap:     var(--spacing);

        @media (min-width: 650px) {
            flex-direction: row;
        }

        div.note {
            background-color: var(--warning);
            color:            black;
            padding:          var(--spacing);
            border-radius:    5px;
            max-width:        500px;
            margin: 0;

            p:last-child {
                margin: 0;
            }
        }
    }
}
</style>