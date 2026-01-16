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
.terms-of-service {
    padding: var(--spacing) 0;
}

.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-color);
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

@media (max-width: 600px) {
    .tos-content {
        padding: var(--spacing);

        h1 {
            font-size: 1.8em;
        }
    }
}
</style>