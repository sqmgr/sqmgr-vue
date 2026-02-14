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
    <section class="terms-of-service small">
        <article class="card">
            <div class="tos-content">
                <h1>SqMGR Terms of Service</h1>
                <p class="effective-date">Effective Date: January 16, 2026</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using sqmgr.com (the "Site"), you agree to be bound by these Terms of Service and all
                        applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                        from using or accessing this Site.</p>
                </section>

                <section>
                    <h2>2. Description of Service</h2>
                    <p>The Site provides digital tools and management services for online square pools, typically used for
                        sports entertainment and fundraising. The Site is a management tool only and does not facilitate or
                        process illegal gambling transactions.</p>
                </section>

                <section>
                    <h2>3. User Responsibilities</h2>
                    <ul>
                        <li><strong>Compliance:</strong> You are solely responsible for ensuring that your use of the Site,
                            including any pools created or managed, complies with all local, state, and federal laws.
                        </li>
                        <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of
                            your account information and for all activities that occur under your account.
                        </li>
                        <li><strong>Content:</strong> You agree not to use the Site for any unlawful or prohibited purpose.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>4. Payments and Contributions</h2>
                    <ul>
                        <li><strong>Voluntary Tips:</strong> The Site may offer a "Tip Jar" or similar feature. Any payments
                            made through these features are voluntary contributions to support the development and
                            maintenance of the Site and are non-refundable.
                        </li>
                        <li><strong>Third-Party Fees:</strong> Users are responsible for any transaction fees associated
                            with third-party payment processors used in conjunction with the Site.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>5. Intellectual Property</h2>
                    <p>The materials, software, and original content on this Site are the property of the Site operators and
                        are protected by applicable copyright and trademark law.</p>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>The Site and its services are provided on an "as-is" and "as-available" basis. In no event shall the
                        Site operators be liable for any damages (including, without limitation, damages for loss of data or
                        profit, or due to business interruption) arising out of the use or inability to use the materials on
                        the Site, even if notified of the possibility of such damage.</p>
                </section>

                <section>
                    <h2>7. Governing Law</h2>
                    <p>Any claim relating to the Site shall be governed by the laws of the State of New York without regard
                        to its conflict of law provisions.</p>
                </section>

                <section>
                    <h2>8. Modifications</h2>
                    <p>We reserve the right to revise these Terms of Service at any time without notice. By using this Site,
                        you are agreeing to be bound by the then-current version of these Terms of Service.</p>
                </section>

                <section>
                    <h2>9. Contact Information</h2>
                    <p>If you have any questions regarding these terms, please contact us through the support channels
                        provided on the Site.</p>
                </section>
            </div>
        </article>
    </section>
</template>

<script>
export default {
    name: "TermsOfService",
}
</script>

<style scoped lang="scss">
@use '../../variables.scss' as *;

.terms-of-service {
    padding: var(--spacing) 0;
}

.card {
    background: $surface-elevated;
    border-radius: $radius-lg;
    box-shadow: $shadow-card;
    border: 1px solid $border-color;
}

.tos-content {
    padding: calc(1.5 * var(--spacing));

    h1 {
        color: var(--midnight-gray);
        font-size: 2.2em;
        margin-bottom: var(--minimal-spacing);
    }

    .effective-date {
        color: var(--gray);
        font-style: italic;
        margin-bottom: calc(2 * var(--spacing));
        font-size: 0.9em;
    }

    section {
        margin-bottom: calc(2 * var(--spacing));

        &:last-child {
            margin-bottom: 0;
        }
    }

    h2 {
        color: var(--primary-darkest);
        border-bottom: 2px solid var(--light-gray);
        padding-bottom: var(--minimal-spacing);
        margin-bottom: var(--spacing);
        font-size: 1.4em;
    }

    p {
        line-height: 1.6;
        color: #444;
    }

    ul {
        list-style-type: none;
        padding-left: 0;
        margin-left: 0;

        li {
            position: relative;
            padding-left: 1.5em;
            margin-bottom: var(--spacing);
            line-height: 1.5;

            &:last-child {
                margin-bottom: 0;
            }

            &::before {
                content: '•';
                color: var(--primary);
                font-weight: bold;
                position: absolute;
                left: 0;
                font-size: 1.2em;
            }
        }
    }
}

@include mobile {
    .tos-content {
        padding: var(--spacing);

        h1 {
            font-size: 1.8em;
        }
    }
}
</style>