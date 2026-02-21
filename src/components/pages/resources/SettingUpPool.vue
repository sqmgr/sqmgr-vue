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
    <article class="resource-article">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <ol>
                <li>
                    <router-link to="/">Home</router-link>
                </li>
                <li>
                    <router-link to="/resources">Resources</router-link>
                </li>
                <li aria-current="page">Setting Up a Pool on SqMGR</li>
            </ol>
        </nav>

        <div class="article-header">
            <h1>Setting Up a Football Squares Pool on SqMGR</h1>
            <p class="article-meta">By
                <router-link to="/about">Tom Peters</router-link> &middot; Updated February 2026
            </p>
            <p class="article-lead">SqMGR lets you run a football squares pool entirely online. No paper, no
                spreadsheets. This covers everything from creating your pool to drawing numbers.</p>
        </div>

        <div class="article-toc">
            <h2><i class="fas fa-list"></i> In This Article</h2>
            <ol>
                <li><a href="#create-account">Create an Account</a></li>
                <li><a href="#create-pool">Create Your Pool</a></li>
                <li><a href="#customize-pool">Customizing Your Pool</a></li>
                <li><a href="#share-link">Share the Pool Link</a></li>
                <li><a href="#claim-squares">How Participants Claim Squares</a></li>
                <li><a href="#draw-numbers">Drawing Numbers</a></li>
                <li><a href="#mark-winners">Marking Winners</a></li>
                <li><a href="#faq">Frequently Asked Questions</a></li>
            </ol>
        </div>

        <section id="create-account">
            <h2>Create an Account</h2>
            <p>To create and manage a pool, you'll need a free SqMGR account. Sign up with your email or a social login.
                Once logged in, you're ready to set up your first pool.</p>
            <p>Participants who join your pool <strong>do not need an account</strong>. They can claim squares as a
                guest using just the pool link you share with them.</p>
        </section>

        <section id="create-pool">
            <h2>Create Your Pool</h2>
            <p>From your account dashboard, click <strong>Create Pool</strong>. You'll be asked for:</p>
            <div class="steps-list">
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-body">
                        <h3>Pool Name</h3>
                        <p>Give your pool a name people will recognize like "Office Pool".</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-body">
                        <h3>Grid Type</h3>
                        <p>Choose from four grid types. See the <a href="#grid-types">Grid Types section</a> below for
                            details on each option.</p>
                    </div>
                </div>
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-body">
                        <h3>Password</h3>
                        <p>Set a password for your pool. You must set one when creating the pool, but you can choose not
                            to require it which allows participants to join without entering it. You can toggle whether
                            the password is required at any time after creation.</p>
                    </div>
                </div>
            </div>
            <p>Once you click Create, your pool is live.</p>
        </section>

        <section id="grid-types">
            <h3>Grid Types Explained</h3>
            <p>SqMGR supports four grid types. The right choice depends on how many people are in your pool and how you
                want to structure the game.</p>

            <h3>Standard 100-Square Grid (10×10)</h3>
            <p>This is the classic format. A 10×10 grid with 100 individual squares, each mapped to a unique combination
                of the last digit of each team's score. Each participant claims one or more specific squares.</p>
            <ul>
                <li>Best for groups of 10–100 participants</li>
                <li>Each square = one specific score combination (e.g., 7 vs 3)</li>
                <li>Random number draw assigns digits 0–9 to each axis after squares are claimed</li>
                <li>Most common format for office pools, friend groups, and large events</li>
            </ul>

            <h3>50-Square Grid (10×5)</h3>
            <p>A half-size grid where each square covers two score combinations instead of one. A good middle ground for
                medium-sized groups that can't quite fill all 100 squares.</p>
            <ul>
                <li>Best for medium-sized groups</li>
                <li>Each square covers 2 score digit combinations</li>
                <li>More coverage per participant than the standard grid</li>
            </ul>

            <h3>25-Square Grid (5×5)</h3>
            <p>A condensed 5×5 grid where each square covers a 2×2 block on the underlying 10×10 grid. Each square you
                claim corresponds to four possible score combinations, giving participants a better chance to win.</p>
            <ul>
                <li>Best for smaller groups</li>
                <li>Each square covers 4 score digit combinations</li>
                <li>Ideal when you can't fill all 100 squares in a standard grid</li>
                <li>Numbers are still drawn randomly and assigned to the underlying 10×10 axes</li>
            </ul>

            <h3>Rollover (10×10)</h3>
            <p>A multi-game format designed for playoff-style pools. Each participant claims two squares: a primary and
                a secondary. In earlier (rollover) rounds, only the primary square is active and if the winning score
                lands on an empty square, the payout rolls over to the next game. In the final game, everyone's
                secondary square comes into play as well.</p>
            <ul>
                <li>Best for multi-week playoff pools</li>
                <li>Each participant holds a primary and a secondary square</li>
                <li>Unclaimed winning squares roll over to keep the pot growing</li>
            </ul>

            <div class="tip-box">
                <h3><i class="fas fa-lightbulb"></i> Pro Tip</h3>
                <p>For a one-off game like the Super Bowl, the standard 100-square grid is the most familiar format. For
                    smaller gatherings, try the 50- or 25-square grid so everyone gets more coverage. Running a playoff
                    pool across multiple weeks? Rollover is built for that.</p>
            </div>
            <div class="article-img">
                <img src="/images/resources/side-by-side.png"
                     srcset="/images/resources/side-by-side.png 1x, /images/resources/side-by-side@2x.png 2x"
                     alt="100-square grid next to a 50-square and 25-square grid for comparison"
                     loading="lazy"
                     class="no-border">
            </div>
        </section>

        <section id="customize-pool">
            <h2>Customizing Your Pool</h2>
            <div class="section-img-right">
                <img src="/images/resources/customize.png"
                     srcset="/images/resources/customize.png 1x, /images/resources/customize@2x.png 2x"
                     alt="The pool customization settings page on SqMGR"
                     loading="lazy">
                <p>Each grid has a <strong>Customize</strong> button that lets you configure how it looks and behaves.
                    Tap it to set:</p>
                <ul>
                    <li><strong>Team names and colors:</strong> Enter the home and away team names, each with a primary
                        and secondary color. These are used to style the grid axes.</li>
                    <li><strong>Event name and date:</strong> Give the grid a label (e.g., "Super Bowl LX") and set the
                        date of the game.</li>
                    <li><strong>Notes to members:</strong> Add a short organizer note (up to 500 characters) that's
                        displayed on the grid page for all participants.</li>
                    <li><strong>Branding image:</strong> Optionally add an image URL to brand the grid, useful for
                        office pools or sponsored events.</li>
                </ul>
                <p>You can also link the grid to a live game so SqMGR automatically pulls in team names, colors, and
                    real-time scores. Live event linking is covered in detail in the
                    <router-link to="/resources/linking-live-events-and-payouts">next article</router-link>.</p>
            </div>
        </section>

        <section id="share-link">
            <h2>Share the Pool Link</h2>
            <div class="section-img-right">
                <img src="/images/resources/copy-link.png"
                     srcset="/images/resources/copy-link.png 1x, /images/resources/copy-link@2x.png 2x"
                     alt="The copy link button on a SqMGR pool page"
                     loading="lazy">
                <p>After creating your pool, SqMGR generates a unique join link for your pool. Share it via text, email,
                    Discord, group chat, etc.</p>
                <p>Anyone with the join link can join the pool without the password — they don't even need an account to
                    claim a square. Join links look like <code>https://sqmgr.com/pool/k3RmNpQ7/join?invite=p7RmXqP2nL</code>.</p>
                <p>If they land on your pool without the special join link (e.g., <code>https://sqmgr.com/pool/k3RmNpQ7</code>), they will be required to enter the password.</p>
                <p>You can also disable the need to use a password, but just be careful with who you share your pool with.</p>
            </div>
        </section>

        <section id="claim-squares">
            <h2>How Participants Claim Squares</h2>
            <p>When a participant opens your pool link, they'll see the grid. They click an empty square, enter their
                name, and submit.</p>
            <p>Participants can claim multiple squares. As the pool manager, you can see all claimed
                squares in real time from your admin view. You can also claim squares on behalf of other players
                directly from the grid.</p>
        </section>

        <section id="draw-numbers">
            <h2>Drawing Numbers</h2>
            <p>Once you're ready to assign numbers (typically just before kickoff), head to your pool's settings and
                trigger the draw. SqMGR offers two methods:</p>

            <h3>Random Draw</h3>
            <p>SqMGR randomly shuffles the digits 0–9 and assigns them to both axes of the grid. This is instant, fair,
                and verifiable by all participants. The numbers are revealed to everyone immediately after the draw.</p>

            <h3>Manual Draw</h3>
            <p>If you prefer the ceremony of a live draw you can enter the numbers manually into SqMGR after your live event. Enter each digit in order as it's drawn, and SqMGR assigns them to the grid.</p>

            <p>You have the option to automatically lock the squares after you draw the numbers this way participants cannot change their claimed square.</p>

            <div class="example-box">
                <h3><i class="fas fa-info-circle"></i> Note on Timing</h3>
                <p>Numbers should be drawn <strong>after</strong> all squares are claimed (or as close to kickoff as
                    possible). Drawing numbers before the grid is filled allows participants to strategically pick
                    squares knowing which digits are already assigned. This defeats the purpose of the random draw.</p>
            </div>
        </section>

        <section id="mark-winners">
            <h2>Marking Winners</h2>
            <p>After each quarter, check the score and find the winning square on your grid. From your pool's admin
                view, you can mark that square as a winner for that period. SqMGR tracks winners across all four payout
                periods (Q1, Halftime, Q3, Final).</p>
            <p>If you've
                <router-link to="/resources/linking-live-events-and-payouts">linked your grid to a live game
                </router-link>
                , SqMGR can display real-time scores directly on the grid, making it easy to see the current winning
                square at a glance without leaving the page.
            </p>
            <p>You can also track payment status for each square (unpaid, partially paid, paid in full) to keep things
                organized, especially for larger pools.</p>
        </section>

        <section id="faq" class="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div class="faq-item">
                <h3>Does SqMGR cost anything?</h3>
                <p>No. SqMGR is completely free to use for pool managers and participants alike. There are no premium
                    tiers, no hidden fees, and no ads tracking your participants. If you find it useful, you can support
                    the project via the
                    <router-link to="/tipjar">Tip Jar</router-link>
                    .
                </p>
            </div>

            <div class="faq-item">
                <h3>Do participants need to create an account?</h3>
                <p>No. Participants join as guests using the pool link. Only the pool manager (the person who creates
                    the pool) needs an account.</p>
            </div>

            <div class="faq-item">
                <h3>Can I change the grid type after creating a pool?</h3>
                <p>The grid type is set when you add a game to your pool. If you need a different format, you can add a
                    new game grid with a different type within the same pool.</p>
            </div>

            <div class="faq-item">
                <h3>Can I run multiple games in one pool?</h3>
                <p>Yes! SqMGR supports multiple game grids within a single pool. This is great for playoff pools or
                    weekly games. See our guide on
                    <router-link to="/resources/multiple-games-and-rollover">Multiple Games and the Rollover Mechanic
                    </router-link>
                    for details.
                </p>
            </div>

            <div class="faq-item">
                <h3>What happens to unclaimed squares?</h3>
                <p>Unclaimed squares remain empty. The pool manager can claim them manually, or you can use the rollover
                    feature to carry unclaimed squares into the next game in your pool.</p>
            </div>
        </section>

        <div class="article-cta">
            <p>Ready to get started?</p>
            <router-link to="/create" class="btn cta-primary">Create Your Pool Now</router-link>
        </div>

        <nav class="article-nav">
            <div class="article-nav-prev">
                <span>Previous: </span>
                <router-link to="/resources/how-squares-work"><i class="fas fa-arrow-left"></i> How Football Squares
                    Work
                </router-link>
            </div>
            <div class="article-nav-next">
                <span>Next: </span>
                <router-link to="/resources/linking-live-events-and-payouts">Linking Live Events &amp; Payouts <i
                    class="fas fa-arrow-right"></i></router-link>
            </div>
        </nav>
    </article>
</template>

<script>
export default {
    name: "SettingUpPool",
    mounted() {
        this._jsonLd = document.createElement('script')
        this._jsonLd.type = 'application/ld+json'
        this._jsonLd.text = JSON.stringify([
            {
                "@context": "https://schema.org",
                "@type": "Article",
                "@id": "https://sqmgr.com/resources/setting-up-a-pool",
                "headline": "Setting Up a Football Squares Pool on SqMGR",
                "description": "A step-by-step guide to creating a football squares pool on SqMGR, covering account setup, grid types (100-square, 50-square, 25-square, and rollover), sharing links, drawing numbers, and marking winners.",
                "url": "https://sqmgr.com/resources/setting-up-a-pool",
                "datePublished": "2026-02-20",
                "dateModified": "2026-02-20",
                "author": {
                    "@type": "Person",
                    "@id": "https://sqmgr.com/about#tom-peters",
                    "name": "Tom Peters",
                },
                "publisher": {
                    "@type": "Person",
                    "@id": "https://sqmgr.com/about#tom-peters",
                    "name": "Tom Peters",
                },
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sqmgr.com/"},
                    {"@type": "ListItem", "position": 2, "name": "Resources", "item": "https://sqmgr.com/resources"},
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Setting Up a Pool on SqMGR",
                        "item": "https://sqmgr.com/resources/setting-up-a-pool",
                    },
                ],
            },
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Does SqMGR cost anything?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. SqMGR is completely free to use for pool managers and participants alike. There are no premium tiers, no hidden fees.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Do participants need to create an account?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. Participants join as guests using the pool link. Only the pool manager needs an account.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What grid types does SqMGR support?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "SqMGR supports four grid types: the standard 100-square (10×10) grid, a 50-square (10×5) grid where each square covers two score combinations, a 25-square (5×5) grid where each square covers four combinations, and a Rollover format for multi-week playoff pools.",
                        },
                    },
                ],
            },
        ])
        document.head.appendChild(this._jsonLd)
    },
    unmounted() {
        if (this._jsonLd) {
            document.head.removeChild(this._jsonLd)
        }
    },
}
</script>

<style lang="scss" scoped>
@use './resource-article';
@use '../../../variables.scss' as *;

.section-img-right {
    overflow: hidden;

    img {
        float: right;
        max-width: 100%;
        margin: 0 0 1rem 2rem;
    }

    @include mobile {
        img {
            float: none;
            display: block;
            margin: 0 auto 1rem;
        }
    }
}

code {
    font-family:      monospace;
    font-size:        0.88em;
    background:       rgba($primary, 0.08);
    color:            $primary;
    padding:          1px 5px;
    border-radius:    $radius-sm;
}
</style>
