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
    <section class="tipjar">
        <div class="header-content">
            <h1>SqMGR Tip Jar</h1>
            <p class="subtitle">Keeping football squares free and fun since 2019.</p>
        </div>

        <div class="content-grid">
            <div class="card warning-card">
                <div class="card-icon">⚠️</div>
                <div class="card-body">
                    <h3>Important Reminder</h3>
                    <p><strong>Do not pay for your squares here!</strong></p>
                    <p>Payments for squares should be sent directly to your pool manager. Tips sent here go toward the hosting and development of the site.</p>
                </div>
            </div>

            <div class="card tip-card">
                <div class="card-body">
                    <h3>Support the Project</h3>
                    <p>SqMGR is a labor of love maintained by a single developer. If you enjoy using the site, please consider chipping in to help cover server costs.</p>
                </div>
                <div class="action-area">
                    <a :href="venmoLink" class="venmo-button">
                        Tip via Venmo
                    </a>
                </div>
            </div>

            <div class="card code-card">
                <div class="card-body">
                    <h3>Open Source</h3>
                    <p>SqMGR is open-source! If you're a developer, you can contribute by helping with the code or reporting issues.</p>
                </div>
                <div class="action-area">
                    <a href="https://github.com/sqmgr" class="github-link">
                        View on GitHub <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref, onMounted} from "vue"

const recip = "thomaspeters"
const amount = 5
const note = "Thanks%20for%20SqMGR!"

const venmoLink = ref(`https://venmo.com/${recip}?txn=pay&amount=${amount}&note=${note}`)
onMounted(() => {
    if (/Android|iPad|iPhone|iPod/.test(navigator.userAgent)) {
        venmoLink.value = `venmo://paycharge?txn=pay&recipients=${recip}&amount=${amount}&note=${note}`
    }
})
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.tipjar {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;

    .header-content {
        text-align: center;
        margin-bottom: 40px;

        h1 {
            margin-bottom: 8px;
            color: $text-color;
        }

        .subtitle {
            font-size: 1.2rem;
            color: var(--dark-gray);
            font-weight: 400;
        }
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;

        @media (min-width: 750px) {
            grid-template-columns: 1fr 1fr;

            .warning-card {
                grid-column: 1 / -1;
            }
        }
    }

    .card {
        background: $surface-elevated;
        border-radius: $radius-xl;
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: $shadow-card;
        border: 1px solid $light-gray;
        transition: transform 0.2s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h3 {
            margin-bottom: 16px;
            color: $text-color;
        }

        p {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 16px;
        }
    }

    .warning-card {
        background: #fffbeb;
        border: 1px solid #fef3c7;
        flex-direction: row;
        align-items: flex-start;
        gap: 24px;

        @include mobile {
            flex-direction: column;
            text-align: center;
            align-items: center;
        }

        .card-icon {
            font-size: 2.5rem;
            line-height: 1;
        }

        h3 {
            color: $text-color;
            margin-bottom: 8px;
        }

        strong {
            color: var(--red);
        }
    }

    .venmo-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #3d95ce;
        color: white;
        padding: 12px 24px;
        border-radius: $radius-lg;
        font-weight: 700;
        text-decoration: none;
        transition: background-color 0.2s;

        &:hover {
            background-color: #2d85be;
            text-decoration: none;
        }
    }

    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--primary);
        font-weight: 700;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
