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
                gimmicks</strong>. <strong>No intrusive ads</strong>. Just customize your squares pool and go!</p>
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
        <div class="grid-image">
            <img srcset="../assets/grid.png,
                         ../assets/grid@2x.png 2x,
                         ../assets/grid@3x.png 3x"
                 src="../assets/grid.png"
                 alt="Football Squares Grid Example" />
        </div>
    </section>
</template>

<script>
    export default {
        name: "Home",
    }
</script>

<style lang="scss" scoped>
    @use '../variables.scss' as *;

    section.index {
        display:               grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap:              $standard-spacing * 2;
        max-width:             1200px;
        margin:                0 auto;
        padding:               $standard-spacing 0;

        & > div:not(.grid-image) {
            text-align: center;
            padding:    $standard-spacing;
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
            }

            h1 {
                font-size:     1.4em;
                margin-bottom: $standard-spacing;
                color:         $text-color;

                i {
                    display:       block;
                    font-size:     3em;
                    color:         $primary;
                    margin-bottom: $standard-spacing / 2;
                    filter:        drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.1));
                }
            }

            p {
                color:       $dark-gray;
                line-height: 1.6;
                font-size:   1.1em;
            }
        }

        div.grid-image {
            grid-column: 1 / -1;
            text-align:  center;
            perspective: 1000px;

            img {
                max-width:     100%;
                width:         800px;
                transform:     rotateX(10deg) rotateY(-5deg) rotateZ(2deg);
                box-shadow:    0 20px 50px rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                border: 12px solid white;
                transition:    transform 0.5s ease;

                &:hover {
                    transform: rotateX(0) rotateY(0) rotateZ(0) scale(1.02);
                }
            }
        }
    }

    @media(max-width: 900px) {
        section.index {
            display: block;

            & > div {
                margin-bottom: $standard-spacing * 2;
            }

            div.grid-image {
                margin: $standard-spacing 0;

                img {
                    transform: none;
                    width: 100%;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
            }
        }
    }
</style>