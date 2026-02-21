<!--
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
-->

<template>
    <section class="release-notes">
        <div class="intro">
            <h1>Release Notes</h1>
            <p class="lead">A history of everything new, improved, and fixed in SqMGR.</p>
        </div>

        <div class="timeline">
            <div class="version-block" v-for="release in releases" :key="release.version">
                <div class="version-marker">
                    <span class="version-badge" :class="{ major: release.major }">{{ release.version }}</span>
                    <span class="version-line"></span>
                </div>
                <div class="version-content">
                    <h2>{{ release.title }} <span class="release-date">{{ release.date }}</span></h2>
                    <ul>
                        <li v-for="(note, i) in release.notes" :key="i">
                            <span class="note-tag" :class="note.type">{{ note.type }}</span>
                            {{ note.text }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "ReleaseNotes",
    data() {
        return {
            releases: [
                {
                    version: "v2.6",
                    major: false,
                    date: "February 21, 2026",
                    title: "Resources & Real Data",
                    notes: [
                        { type: "new", text: "Resources section with six football squares guides covering rules, strategy, best numbers, Super Bowl squares, multi-game pools, and pool setup" },
                        { type: "new", text: "Best Numbers heatmap powered by real NFL scoring data from 2015–2025, including Super Bowl LX" },
                        { type: "improved", text: "About page now includes a developer bio, expanded technology section with SSE pipeline details, and a GitHub profile link" },
                        { type: "improved", text: "Added a no-wagering disclaimer to the site footer" },
                        { type: "improved", text: "Structured data (JSON-LD) added to the homepage, About page, and all resource articles for better search visibility" },
                        { type: "fixed", text: "Fixed event mode defaulting to \"live\" when editing a manually-configured grid" },
                        { type: "fixed", text: "Blocked selection of secondary squares in bulk edit mode for roll100 grids" },
                    ],
                },
                {
                    version: "v2.5",
                    major: false,
                    date: "February 20, 2026",
                    title: "Bulk Square Editing",
                    notes: [
                        { type: "new", text: "Bulk edit mode — select multiple squares to claim, unclaim, or update payment status at once" },
                        { type: "improved", text: "Mobile grid view now shows Admin Actions closer to the grid for easier access" },
                    ],
                },
                {
                    version: "v2.4",
                    major: false,
                    date: "February 18, 2026",
                    title: "Square Detail Polish",
                    notes: [
                        { type: "improved", text: "Redesigned event mode selection with descriptive option cards instead of radio buttons" },
                        { type: "improved", text: "Improved disabled field styling and locked teams in event mode" },
                        { type: "improved", text: "Aligned remove-claim button and refactored button and square styles" },
                        { type: "fixed", text: "Matched payment badge icons and colors between grid and square detail views" },
                        { type: "fixed", text: "Adjusted claimed state colors for better readability" },
                    ],
                },
                {
                    version: "v2.3",
                    major: false,
                    date: "February 14, 2026",
                    title: "NCAAB Support",
                    notes: [
                        { type: "improved", text: "Hides 1st, 2nd, 3rd, and Final options for NCAAB games in payout configuration" },
                        { type: "improved", text: "Updated grid screenshot" },
                    ],
                },
                {
                    version: "v2.2",
                    major: false,
                    date: "February 14, 2026",
                    title: "Visual Refresh",
                    notes: [
                        { type: "improved", text: "Replaced payment state indicators with toggleable badges" },
                        { type: "improved", text: "New loading indicator to match site rebrand" },
                        { type: "improved", text: "Updated font sizes for better readability" },
                    ],
                },
                {
                    version: "v2.0",
                    major: true,
                    date: "January 2026",
                    title: "Complete Redesign",
                    notes: [
                        { type: "new", text: "Complete visual redesign with new logo, branding, and color system" },
                        { type: "new", text: "Real-time pool updates — no more manual refreshing" },
                        { type: "new", text: "Live score syncing for linked events" },
                        { type: "new", text: "Custom branding images for pools" },
                        { type: "new", text: "Multi-set number support for grids" },
                        { type: "new", text: "Option to lock squares after drawing numbers" },
                        { type: "new", text: "Users can change number set configuration until the first game draws numbers" },
                        { type: "new", text: "\"Get Started\" call-to-action for new pools with a single uncustomized game" },
                        { type: "new", text: "\"How It Works\" page explaining pool setup and gameplay" },
                        { type: "improved", text: "Linked game section redesigned as a mini scoreboard card with event name and date" },
                        { type: "improved", text: "Event selection list redesigned with team color accents and card layout" },
                        { type: "improved", text: "Redesigned login page" },
                        { type: "improved", text: "Redesigned pool creation page with improved help text" },
                        { type: "improved", text: "Redesigned Your Account page" },
                        { type: "improved", text: "Redesigned Tip Jar page" },
                        { type: "improved", text: "Homepage now features a rotating \"Trusted By\" section" },
                        { type: "improved", text: "Broadened sport references beyond football" },
                        { type: "improved", text: "Better winning square messaging" },
                        { type: "improved", text: "Added NCAA team colors" },
                        { type: "improved", text: "Print legend included for multi-set grids" },
                        { type: "fixed", text: "Fixed NCAAB halftime score calculation for half-based sports" },
                        { type: "fixed", text: "Fixed printing on Safari" },
                        { type: "fixed", text: "Fixed grid expand not working on mobile" },
                        { type: "fixed", text: "Fixed occasional logouts" },
                        { type: "fixed", text: "Fixed event date display issue" },
                        { type: "fixed", text: "Fixed error when joining a pool via invite link" },
                    ],
                },
                {
                    version: "v1.11",
                    major: false,
                    date: "November 25, 2025",
                    title: "Tip Jar",
                    notes: [
                        { type: "improved", text: "Renamed \"Donate\" to \"Tip Jar\"" },
                    ],
                },
                {
                    version: "v1.10",
                    major: false,
                    date: "October 16, 2025",
                    title: "50 Squares",
                    notes: [
                        { type: "new", text: "Added support for 50-square grid pools" },
                        { type: "new", text: "Added option to create pools without requiring a password" },
                        { type: "improved", text: "Minor adjustments to print layout" },
                        { type: "fixed", text: "Fixed logout issues" },
                    ],
                },
                {
                    version: "v1.9",
                    major: false,
                    date: "January 22, 2025",
                    title: "Visibility & Colors",
                    notes: [
                        { type: "improved", text: "Updated team colors" },
                        { type: "improved", text: "Claimed squares are now visible to all pool members" },
                        { type: "improved", text: "Added square claim counts" },
                        { type: "fixed", text: "Fixed printing with white team colors" },
                        { type: "fixed", text: "Fixed invite link issues" },
                    ],
                },
                {
                    version: "v1.8",
                    major: false,
                    date: "February 20, 2020",
                    title: "Team Colors & PWA",
                    notes: [
                        { type: "improved", text: "Switched to a better source for team colors" },
                        { type: "improved", text: "Improved Progressive Web App support" },
                    ],
                },
                {
                    version: "v1.7",
                    major: false,
                    date: "January 29, 2020",
                    title: "Open Access",
                    notes: [
                        { type: "new", text: "Added full support for open access on locked pools" },
                        { type: "improved", text: "Updated the About page" },
                        { type: "improved", text: "Added sponsors section" },
                        { type: "improved", text: "Added donate link" },
                    ],
                },
                {
                    version: "v1.6",
                    major: false,
                    date: "January 24, 2020",
                    title: "Offline Support & Mobile",
                    notes: [
                        { type: "new", text: "Added service worker support using Workbox for offline capability" },
                        { type: "improved", text: "Significantly improved mobile experience for 10x10 grids" },
                        { type: "improved", text: "Better mobile layout and responsive styling" },
                        { type: "improved", text: "Increased annotation icon size for readability" },
                        { type: "improved", text: "Added annotation validation with error feedback" },
                        { type: "fixed", text: "Fixed full-screen sizing" },
                        { type: "fixed", text: "Fixed Safari-specific annotation styling" },
                    ],
                },
                {
                    version: "v1.5",
                    major: false,
                    date: "January 1, 2020",
                    title: "Annotation Icons",
                    notes: [
                        { type: "new", text: "Added support for annotation icons on squares" },
                    ],
                },
                {
                    version: "v1.4",
                    major: false,
                    date: "December 31, 2019",
                    title: "Grid Annotations",
                    notes: [
                        { type: "new", text: "Added grid annotations to mark and label individual squares" },
                        { type: "improved", text: "Minor style updates to print page" },
                    ],
                },
                {
                    version: "v1.3",
                    major: false,
                    date: "December 30, 2019",
                    title: "Grid Labels & Printing",
                    notes: [
                        { type: "new", text: "Added support for custom grid labels" },
                        { type: "new", text: "Added \"All Grids\" page for viewing all grids at once" },
                        { type: "improved", text: "Added page breaks for cleaner printing" },
                        { type: "improved", text: "Added AFC and NFC team colors" },
                        { type: "fixed", text: "Fixed roll100 printing" },
                    ],
                },
                {
                    version: "v1.2",
                    major: false,
                    date: "December 20, 2019",
                    title: "Rollover Pools & UX",
                    notes: [
                        { type: "new", text: "Initial support for rollover pools" },
                        { type: "new", text: "Added loading bar for page transitions" },
                        { type: "improved", text: "Better footer styles on mobile" },
                        { type: "improved", text: "Moved donate link into the footer" },
                        { type: "improved", text: "Redirect to account page after login" },
                        { type: "improved", text: "Updated the About page" },
                        { type: "fixed", text: "Fixed iOS select range issue" },
                        { type: "fixed", text: "Added grid shrink/expand for standard 100 squares" },
                    ],
                },
                {
                    version: "v1.1",
                    major: false,
                    date: "August 12, 2019",
                    title: "Manual Number Picking",
                    notes: [
                        { type: "new", text: "Users can now manually pick their own numbers" },
                        { type: "new", text: "Added grids-per-pool limits" },
                        { type: "improved", text: "Added grid image to the home page" },
                        { type: "fixed", text: "Fixed header links not updating for guest users joining their first pool" },
                        { type: "fixed", text: "Fixed Microsoft Edge compatibility issue" },
                    ],
                },
                {
                    version: "v1.0",
                    major: true,
                    date: "August 11, 2019",
                    title: "Initial Release",
                    notes: [
                        { type: "new", text: "Create and manage football squares pools online" },
                        { type: "new", text: "Support for 25-square and 100-square grid formats" },
                        { type: "new", text: "Automatic random number drawing" },
                        { type: "new", text: "Guest accounts for easy participant access" },
                        { type: "new", text: "Real-time grid updates" },
                        { type: "new", text: "Pool sharing via invite links" },
                        { type: "new", text: "Team color customization" },
                        { type: "new", text: "Print-friendly grid views" },
                    ],
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
@use '../../variables.scss' as *;

section.release-notes {
    max-width: 820px;
    margin: 0 auto;
    padding: $standard-spacing;
}

.intro {
    text-align: center;
    margin-bottom: $space-12;

    .lead {
        font-size: 1.15em;
        color: $dark-gray;
    }
}

.timeline {
    position: relative;
}

.version-block {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: $space-6;
    margin-bottom: $space-10;

    @include mobile {
        grid-template-columns: 1fr;
        gap: $space-3;
    }
}

.version-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    @include mobile {
        flex-direction: row;
        gap: $space-3;
    }
}

.version-badge {
    display: inline-block;
    padding: $space-1 $space-3;
    background: $surface-sunken;
    border: 1px solid $light-gray;
    border-radius: $radius-full;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $text-secondary;
    white-space: nowrap;

    &.major {
        background: $primary;
        border-color: $primary;
        color: #fff;
    }
}

.version-line {
    flex: 1;
    width: 2px;
    background: $light-gray;
    margin-top: $space-2;
    min-height: 20px;

    @include mobile {
        display: none;
    }
}

.version-content {
    h2 {
        font-size: 1.35em;
        color: $text-color;
        margin: 0 0 $space-4;
        display: flex;
        align-items: baseline;
        gap: $space-3;
        flex-wrap: wrap;
    }

    .release-date {
        font-size: 0.6em;
        font-weight: 400;
        color: $dark-gray;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: $space-3;
    }

    li {
        color: $text-color;
        line-height: 1.55;
        font-size: 0.9375rem;
        display: flex;
        align-items: baseline;
        gap: $space-3;
    }
}

.note-tag {
    display: inline-block;
    padding: 1px $space-2;
    border-radius: $radius-sm;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    flex-shrink: 0;
    min-width: 62px;
    text-align: center;

    &.new {
        background: rgba(46, 139, 62, 0.12);
        color: $primary-dark;
    }

    &.improved {
        background: rgba(33, 150, 243, 0.1);
        color: #1565c0;
    }

    &.fixed {
        background: rgba(245, 166, 35, 0.12);
        color: #e65100;
    }
}
</style>
