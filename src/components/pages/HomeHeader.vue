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
    <div class="content">
        <section class="home-header">
            <div class="hero-content">
                <p class="credibility-badge">
                    <span class="trusted-by">Trusted by</span>
                    <span class="trusted-wrapper">
                    <Transition
                        name="slide-up"
                        mode="out-in"
                        @before-leave="onBeforeLeave"
                        @enter="onEnter"
                        @after-enter="onAfterEnter"
                    >
                        <span :key="trustedBy" class="trusted-item">{{ trustedBy }}</span>
                    </Transition>
                </span>
                </p>
                <h2>The <span class="highlight">Easiest Way</span> to Run Your Football and Basketball Squares Pool</h2>
                <p class="subtitle">Create professional pools in minutes. Share with friends. No spreadsheets required.</p>

                <div class="cta-container">
                    <router-link class="btn cta-primary" to="/create">Create Your Pool</router-link>
                    <router-link class="btn cta-secondary" to="/how-it-works">See How It Works</router-link>
                </div>

                <p class="social-proof">100% Free - Always</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue"

const trustedByList = [
    "Pool Managers Everywhere",
    "Football Fanatics Everywhere",
    "My Brother",
    "Almost All of My Friends",
    "Stat Nerds Everywhere",
    "Prop Bet Experts Everywhere",
    "Tailgate Legends Everywhere",
    "Scoreboard Watchers Everywhere",
    "Bandwagon Fans Everywhere",
    "My Mom and Dad",
    "Your One Friend From High School",
    "That One Dude on Your Street",
    "Kim, You Don't Know Her",
    "Square Aficionados Everywhere",
    "That Actor Whose Name You Forgot",
    "People Who Still Call It \"The Big Game\"",
    "Guys Who Bet on the Coin Toss",
    "That Guy Who Always Claims the Same Square",
    "AI, at Least for Now",
    "9 out of 10 Dentists"
]
const trustedBy = ref(trustedByList[0])

let intervalId

onMounted(() => {
    intervalId = setInterval(() => {
        trustedBy.value = trustedByList[Math.floor(Math.random() * trustedByList.length)]
    }, 5000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})

const onBeforeLeave = (el) => {
    const wrapper = el.parentElement
    wrapper.style.width = `${el.offsetWidth}px`
    wrapper.style.height = `${el.offsetHeight}px`
}

const onEnter = (el) => {
    const wrapper = el.parentElement
    wrapper.style.width = `${el.offsetWidth}px`
    wrapper.style.height = `${el.offsetHeight}px`
}

const onAfterEnter = (el) => {
    const wrapper = el.parentElement
    wrapper.style.width = null
    wrapper.style.height = null
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../variables.scss' as *;

section.home-header {
    text-align: center;
    padding:    $space-16 0 $space-12;
    margin:     0 auto;
    position:   relative;

    &::before {
        content:    '';
        position:   absolute;
        inset:      0;
        pointer-events: none;
    }

    .hero-content {
        max-width: 720px;
        margin:    0 auto;
        position:  relative;
    }

    p.credibility-badge {
        display:         inline-flex;
        align-items:     center;
        gap:             $space-1;
        background:      rgba(255, 255, 255, 0.07);
        color:           rgba(255, 255, 255, 0.8);
        padding:         $space-2 $space-5;
        border-radius:   $radius-full;
        font-size:       0.8em;
        font-weight:     500;
        letter-spacing:  0.03em;
        margin-bottom:   $space-6;
        border:          1px solid rgba(255, 255, 255, 0.08);

        .trusted-by {
            white-space: nowrap;
        }
        .trusted-wrapper {
            display:        inline-block;
            position:       relative;
            vertical-align: bottom;
            transition:     width 0.5s ease;
            white-space:    nowrap;
        }

        .trusted-item {
            display:     inline-block;
            white-space: nowrap;
        }
    }

    h2 {
        font-size:     3em;
        margin-bottom: $space-5;
        font-weight:   400;
        letter-spacing: -0.025em;
        line-height: 1.4;
        font-family:   'Anton', sans-serif;

        .highlight {
            color:    $accent;
            position: relative;
            display:  inline-block;

            &::after {
                content:       '';
                position:      absolute;
                bottom:        2px;
                left:          -2px;
                right:         -2px;
                height:        6px;
                background:    rgba($accent, 0.3);
                border-radius: 3px;
                transform:     skewX(-3deg);
            }
        }
    }

    p.subtitle {
        font-size:     1.2em;
        color:         rgba(255, 255, 255, 0.7);
        margin: $space-6 auto;
        font-weight:   400;
        line-height:   1.6;
        max-width:     560px;
    }

    .cta-container {
        display:         flex;
        justify-content: center;
        gap:             $space-4;
        margin-bottom:   $space-6;
    }

    .btn {
        font-family:    'Outfit', sans-serif;
        padding:        $space-4 $space-8;
        border-radius:  $radius-full;
        border:         none;
        font-weight:    700;
        transition:     all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size:      0.875em;
        display: flex;
        align-items: center;
        justify-content: center;

        &.cta-primary {
            background: $accent;
            color:      #1a1d23;
            box-shadow: 0 2px 8px rgba($accent, 0.3), 0 1px 0 rgba(255, 255, 255, 0.15) inset;

            &:hover {
                transform:       translateY(-2px);
                box-shadow:      0 8px 24px rgba($accent, 0.35), 0 1px 0 rgba(255, 255, 255, 0.2) inset;
                background:      color.adjust($accent, $lightness: 6%);
                text-decoration: none;
            }

            &:active {
                transform:  translateY(0);
                box-shadow: 0 2px 6px rgba($accent, 0.25);
            }
        }

        &.cta-secondary {
            background:  rgba(255, 255, 255, 0.06);
            border:      1.5px solid rgba(255, 255, 255, 0.2);
            color:       rgba(255, 255, 255, 0.9);

            &:hover {
                background:      rgba(255, 255, 255, 0.12);
                border-color:    rgba(255, 255, 255, 0.35);
                transform:       translateY(-2px);
                text-decoration: none;
            }
        }
    }

    p.social-proof {
        font-size:      0.8em;
        color:          rgba(255, 255, 255, 0.4);
        margin:         0;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight:    500;
    }
}

@include tablet {
    section.home-header {
        padding: $space-4 0 $space-8;

        p.credibility-badge {
            font-size:     0.75em;
            margin-bottom: $space-4;
        }

        h2 {
            font-size: 2em;
        }

        p.subtitle {
            font-size:     1.05em;
        }

        .cta-container {
            flex-direction: column;
            align-items:    center;
            gap:            $space-3;
        }

        .btn {
            width:     100%;
            max-width: 300px;
            padding:   $space-4 $space-6;
        }

        p.social-proof {
            font-size: 0.75em;
        }
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.5s ease;
}

.slide-up-enter-from {
    opacity:   0;
    transform: translateY(8px);
}

.slide-up-leave-to {
    opacity:   0;
    transform: translateY(-8px);
}
</style>