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
    <section class="index">
        <div class="free">
            <h1><i class="fas fa-wallet"></i> Free</h1>

            <p>Unlike other sites that charge upwards of $30 per squares pool, SqMGR is 100% free. <strong>No
                gimicks</strong>. <strong>No intrusive ads</strong>. Just customize your squares pool and go!</p>
        </div>
        <div class="customizable">
            <h1><i class="fas fa-cogs"></i> Customizable</h1>

            <p>Easily change settings for your squares pool. You can specify different types of grids to use, lock
                dates, and more! Each individual game can be customized as well with its own teams, colors, and
                dates.</p>
        </div>
        <div class="persistence">
            <h1><i class="fas fa-calendar-alt"></i> Season/Playoff Persistence</h1>

            <p>Want to setup a pool for an entire season or the playoffs? You can re-use the same claimed squares with
                new numbers drawn for each week!</p>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Home",
    }
</script>

<style lang="scss" scoped>
    @import '../variables.scss';

    h1 {
        font-size: 1.6em;
    }

    section.index {
        display:               grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap:              $standard-spacing;
        max-width:             1200px;
        position:              relative;
        left:                  50%;
        transform:             translateX(-50%);
    }

    @media(max-width: 800px) {
        section.index {
            display:   block;
            position:  static;
            left:      0;
            transform: none;
        }
    }
</style>