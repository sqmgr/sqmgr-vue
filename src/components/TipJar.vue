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
                    <p>Payments for squares should be sent directly to your pool administrator. Tips sent here support the hosting and development of the SqMGR platform.</p>
                </div>
            </div>

            <div class="card tip-card">
                <div class="card-body">
                    <h3>Support the Site</h3>
                    <p>If you enjoy using SqMGR, please consider chipping in. Your contributions help cover server costs and keep the site 100% ad-free.</p>
                </div>
                <div class="action-area">
                    <a href="https://venmo.com/?txn=pay&audience=public&recipients=thomaspeters&amount=5&note=Thanks for SqMGR!" class="venmo-button">
                        <span class="venmo-logo">V</span>
                        <span>Tip via Venmo</span>
                    </a>
                </div>
            </div>

            <div class="card code-card">
                <div class="card-body">
                    <h3>Open Source</h3>
                    <p>SqMGR is open-source! If you're a developer, you can contribute by helping with the code or reporting issues.</p>
                </div>
                <div class="action-area">
                    <a href="https://github.com/sqmgr/sqmgr" class="github-link">
                        View on GitHub <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "Donate",
}
</script>

<style scoped lang="scss">
@use '../variables.scss' as *;

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
        background: #fff;
        border-radius: 12px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--light-gray);
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

        @media (max-width: 600px) {
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
        border-radius: 8px;
        font-weight: 700;
        text-decoration: none;
        transition: background-color 0.2s;
        gap: 10px;

        &:hover {
            background-color: #2d85be;
            text-decoration: none;
        }

        .venmo-logo {
            background: white;
            color: #3d95ce;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1rem;
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
