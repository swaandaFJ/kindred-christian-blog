# Kindred — Front-End Specification
**A Christian devotional & article platform · No-code thinking exercise, structured for a junior front-end engineer**

---

## How this document is organized

This follows the 8-part structure of the assignment: User Journey → Screen Map → Component Tree → State Diagram → API Calls → Edge Cases → QA Checklist → Unit Test Ideas.

It doesn't cover every single feature Kindred could ever have — it covers a **representative core** that shows the full shape of the app: reading content, searching, bookmarking, an account area, a writer submitting an article, an editor reviewing it, and a donation flow. Once you understand how these are specified, the same pattern repeats for anything else in the app (podcasts, sermons, reading plans, etc.) — you'd just build the same 8 sections for that feature.

Before the 8 sections, a quick recap of what Kindred *is*, so the rest of the document makes sense on its own.

---

## 0. Quick recap: what is Kindred?

Kindred is a website where people read Christian articles and daily devotionals, follow Bible reading plans, and (if invited) write articles that go through an editor before publishing. There's also a simple donation page.

**Who uses it:**
- **Readers** — just browse, read, maybe make a free account to bookmark things.
- **Writers** — invited contributors who draft articles and submit them for review.
- **Editors** — approve, reject, or ask for changes before anything goes live.
- **Donors** — give one-off or monthly gifts.

**Look & feel, in short:**
- Colors: warm clay/terracotta as the main brand color, a muted indigo for secondary accents, warm off-white/cream backgrounds (not stark white or gray).
- Fonts: a clean sans-serif (e.g. Manrope) for buttons/menus/forms, and a serif (e.g. Source Serif) for article titles — so reading content *feels* different from clicking around the app.
- Rounded corners on cards and buttons, soft shadows, lots of white space. Nothing flashy — the article is always the star of the page, not the UI around it.

That's all the design-system detail you need to build from. Now the 8 sections.

---

## 1. User Journey — the happy path

The "happy path" is: assume nothing goes wrong, what does a successful trip through the app look like?

### 1a. A reader discovers and saves an article
1. Lands on the homepage (from a Google search or a shared link).
2. Sees today's devotional at the top, and a grid of recent articles below it.
3. Clicks into an article.
4. Reads it. Scrolls to the bottom and sees 3 related articles.
5. Clicks the bookmark icon on the article.
6. Since they're not logged in, a small "sign up to save this" box pops up right there (not a new page).
7. Signs up with email + password.
8. The article is bookmarked automatically — no need to click bookmark again.
9. Later, goes to "My Bookmarks" and finds it there.

### 1b. A writer submits an article
1. Logs into the Writer Dashboard.
2. Clicks "New Article."
3. Writes the article in a simple text editor (title, body, cover image, pick a topic).
4. The draft autosaves as they type.
5. Clicks "Submit for Review."
6. Sees the article's status change to "In Review" on their dashboard.
7. A few days later, gets an email: "Your article was approved and published!"
8. Clicks through and sees it live on the site.

### 1c. An editor reviews an article
1. Logs into the Admin/Editor dashboard.
2. Sees a "Pending Review" queue with a list of submitted articles.
3. Opens one, reads the full article.
4. Goes through a short checklist (is it on-topic, is it well-written, are Bible references accurate).
5. Clicks "Approve & Publish."
6. The article goes live immediately, and the writer gets notified.

### 1d. A donor gives
1. Finishes reading an article, sees a small "Support Kindred" prompt at the bottom (not a popup).
2. Clicks it, lands on the Give page.
3. Picks "$25/month," enters card details.
4. Confirms. Sees a thank-you page and gets an email receipt.
5. Later, manages or cancels the gift from their account — no need to email anyone.

---

## 2. Screen Map — every screen in the app

A simple list of every screen, grouped by area of the app.

```
PUBLIC SITE (anyone can see)
├── Home
├── Article (single article page)
├── Today's Devotional
├── Devotional Archive
├── Category / Topic page (list of articles in a topic)
├── Search Results
├── Author page (a writer's public profile)
├── About / Guidelines / Privacy / Terms (static pages)
├── Give (donation page)
│   └── Thank You (after donating)
├── Login
├── Sign Up
└── Forgot Password

READER ACCOUNT (logged-in readers)
├── My Account (overview)
├── My Bookmarks
├── My Reading History
├── Profile Settings
├── Notification Settings
└── Manage My Donations

WRITER DASHBOARD (invited writers)
├── Dashboard (my drafts / submitted / published, at a glance)
├── New Article (editor)
├── Edit Draft (same editor, existing article)
└── My Profile (writer bio)

EDITOR / ADMIN DASHBOARD (staff only)
├── Dashboard (pending review count, recent activity)
├── Review Queue (list of articles waiting for review)
├── Review an Article (read + approve/reject/request changes)
├── All Content (every article, any status, searchable)
├── Manage Topics/Categories
├── Manage Users (promote a reader to writer, etc.)
└── Donation Reports
```

That's ~25 screens. Every one of them will get its own Component Tree, State Diagram, and API Calls list when it's actually built — below, we go deep on a handful of the most important ones as examples.

---

## 3. Component Tree — reusable pieces per screen

The goal here is to spot what components get reused across screens *before* you build anything, so you don't build the same card five different ways.

### Home
```
HomePage
├── NavBar (used on every public page)
│   ├── Logo
│   ├── NavLinks
│   └── SearchIcon
├── DevotionalHero (today's devotional, big card at the top)
├── ArticleGrid
│   └── ArticleCard × N   ← reused on Search, Category, Author pages too
├── SupportBanner ("Support Kindred" prompt)
└── Footer (used on every public page)
```

### Article page
```
ArticlePage
├── NavBar
├── ArticleHeader
│   ├── Title
│   ├── AuthorByline (links to author page)
│   └── PublishDate
├── ArticleBody (the actual text/images)
├── BookmarkButton  ← reused on ArticleCard too
├── ShareButtons
├── RelatedArticles
│   └── ArticleCard × 3
├── SupportBanner
└── Footer
```

### Writer Dashboard
```
WriterDashboard
├── SideNav (Dashboard / New Article / Profile)
├── StatsRow (Total / Published / Pending — 3 small number cards)
└── ArticlesTable
    └── ArticleRow × N
        ├── Title
        ├── StatusBadge  ← this is the same component the Editor dashboard uses
        └── ActionButton ("Edit" or "View")
```

### Article Editor (used for both New Article and Edit Draft)
```
ArticleEditor
├── TitleInput
├── RichTextArea (the body)
├── CoverImageUpload
├── TopicPicker
├── SaveStatusIndicator ("Saving..." / "Saved")
└── SubmitButton
```

### Review Queue (Editor)
```
ReviewQueuePage
├── SideNav
├── QueueFilters (sort by date, filter by topic)
└── QueueTable
    └── QueueRow × N
        ├── Title, Writer name, Submitted date
        └── "Review →" link
```

### Review an Article (Editor)
```
ReviewArticlePage
├── ArticleBody (same component as the public Article page — the editor should preview it exactly as readers will see it)
├── ReviewChecklist (a few checkboxes)
├── FeedbackTextArea
└── ActionButtons (Approve / Request Changes / Reject)
```

**Notice the pattern:** `ArticleCard`, `StatusBadge`, `ArticleBody`, `NavBar`, `Footer`, and `BookmarkButton` each show up on 2+ screens. Building those five components well, once, covers most of the app.

---

## 4. State Diagram — what states things can be in

Two kinds of state to think about: **screen state** (is this screen loading, empty, showing data, or broken?) and **content state** (where is this article in its lifecycle?).

### 4a. Screen states (applies to almost every screen that loads data)

```
        ┌─────────┐
        │ Loading │ ← show a skeleton, not a blank page
        └────┬────┘
             │
   ┌─────────┼─────────┐
   ▼         ▼          ▼
┌───────┐ ┌───────┐  ┌───────┐
│ Empty │ │ Ready │  │ Error │
└───────┘ └───────┘  └───────┘
"No           shows       "Something went wrong.
articles      the data    Try again." + retry button
yet"
```

Every list-type screen (Home, Search Results, Bookmarks, Review Queue, Writer Dashboard) needs to design for all four of these — not just the happy "Ready" one. That's a very common thing junior engineers forget until QA finds it.

### 4b. Article lifecycle (content state)

This is the most important state diagram in the whole app, because it controls what a reader can and can't see, and what buttons a writer/editor sees.

```
Draft ──(writer clicks Submit)──> In Review
                                      │
                    ┌─────────────────┼──────────────────┐
                    ▼                 ▼                  ▼
             Changes Requested    Rejected            Approved
                    │                                      │
              (writer edits,                       (editor clicks
               resubmits)                            Publish)
                    │                                      │
                    └──────────> In Review                 ▼
                                                        Published
                                                             │
                                                    (editor unpublishes,
                                                     or archives it)
                                                             ▼
                                                        Archived
```

Rules worth stating plainly:
- Only **Published** articles are visible to regular readers. Everything else (Draft, In Review, Changes Requested, Rejected, Archived) is hidden from the public site.
- A writer can see their own article in any state. An editor can see everything.
- A writer **cannot** approve their own article — that button just doesn't exist for them, even if they're also an editor on a different article.

### 4c. Button states

Small, but matters everywhere there's a form (Submit Article, Login, Donate):

```
Default → (user clicks) → Loading (button shows a spinner, is disabled)
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                Success              Error
        (brief checkmark,      (button re-enables,
         then navigate away)    error message shows)
```

The important rule: **the button is disabled while loading**, so a slow connection doesn't let someone click "Submit" three times and create three articles.

---

## 5. API Calls — what conversations happen between the screen and the server

Think of each screen as having a short conversation with the backend. Here's that conversation for the key screens, in plain terms (this is what you'd hand to a backend developer as a starting point, or turn into an actual API contract later).

### Home page
- "Give me today's devotional." → `GET /devotional/today`
- "Give me the 12 most recent articles." → `GET /articles?sort=recent&limit=12`

### Article page
- "Give me the article with this URL slug." → `GET /articles/{slug}`
- "Give me 3 articles related to this one." → `GET /articles/{slug}/related`
- If logged in: "Is this article already bookmarked by me?" → `GET /me/bookmarks/{articleId}`

### Bookmarking
- "Save this article to my bookmarks." → `POST /me/bookmarks { articleId }`
- "Remove this bookmark." → `DELETE /me/bookmarks/{articleId}`

### Search
- "Give me articles matching this search term, page 1." → `GET /search?q={term}&page=1`

### Sign up / Login
- "Create an account with this email and password." → `POST /auth/signup`
- "Log me in." → `POST /auth/login`
- "Am I still logged in?" → `GET /auth/me` (checked when the app loads)

### Writer Dashboard
- "Give me all articles I've written, with their current status." → `GET /me/articles`

### Article Editor
- "Save this draft." → `POST /articles` (new) or `PATCH /articles/{id}` (existing) — called automatically every ~20 seconds while typing
- "Submit this draft for review." → `PATCH /articles/{id}/submit`

### Review Queue (editor)
- "Give me all articles currently In Review, oldest first." → `GET /admin/articles?status=in_review&sort=oldest`

### Review an Article (editor)
- "Approve and publish this article." → `PATCH /admin/articles/{id}/approve`
- "Reject this article, here's why." → `PATCH /admin/articles/{id}/reject { reason }`
- "Send it back with requested changes, here's why." → `PATCH /admin/articles/{id}/request-changes { reason }`

### Donation
- "Here's the amount, frequency, and payment info — process this gift." → `POST /donations` (in practice, the actual card number goes straight to a payment provider like Stripe, and Kindred's server just gets back a confirmation token — Kindred's own servers should never see raw card numbers)
- "Give me this donor's current recurring gift, so they can change or cancel it." → `GET /me/donations` and `PATCH /me/donations/{id}` / `DELETE /me/donations/{id}`

---

## 6. Edge Cases — what can go wrong

This is the "what if...?" list. Going through this before building saves a lot of bug reports later.

**Reading & browsing**
- The article slug in the URL doesn't exist (typo, or it was deleted) → show a friendly "Article not found" page, not a blank screen or a crash.
- Someone shares a link to an article that's since been archived → the article should still load, but with a small "This article has been archived" note.
- Slow/flaky connection while loading images → show a placeholder/skeleton, don't let the layout jump around once the image loads in.

**Bookmarking**
- User double-clicks the bookmark button fast → should not create two bookmarks or toggle back and forth incorrectly; disable the button briefly after a click.
- User bookmarks something, then their session expires mid-action → show a clear "please log in again" message, don't silently fail.

**Search**
- Search term returns zero results → show a helpful message ("No results for 'xyz' — try a broader term") instead of a blank page.
- User types very fast → don't fire a search request on every keystroke; wait until they pause (debounce).

**Writer submission**
- Writer tries to submit with no title or empty body → block submission, show which field is missing, don't let it silently fail.
- Writer's browser crashes mid-draft → autosave should mean they lose at most ~20 seconds of work, not the whole draft.
- Two browser tabs open, editing the same draft → at minimum, warn the writer; ideally, block the second tab from overwriting the first's changes.
- Writer tries to edit an article that's already been published → this should create a *new* pending revision, not change the live version instantly.

**Editor review**
- Editor tries to reject or request changes with no reason typed in → block the action, require at least a short explanation (the writer needs to know what to fix).
- Editor tries to approve their own submitted article → this action should not be available to them at all, regardless of role.
- Two editors open the same review at the same time → whoever acts first should "win"; the second editor should see a message that it's already been decided, not be allowed to also approve/reject it.

**Donations**
- Card is declined → show the actual reason if the payment provider gives one ("card declined"), not a generic error, and don't lose the amount/frequency the donor already selected.
- Donor closes the tab right after payment succeeds but before the confirmation page loads → the donation should still be recorded and a receipt still emailed, since payment confirmation happens server-side, not just on that screen.
- Donor tries to donate a $0 or negative amount → block it before it ever reaches the payment step.

---

## 7. QA Checklist — how to test this end-to-end

A practical run-through a QA person (or you, before shipping) would do by hand.

**Reading experience**
- [ ] Homepage loads with today's devotional and a recent-articles grid.
- [ ] Clicking an article opens it with title, author, date, and full body visible.
- [ ] Related articles at the bottom actually relate to the topic.
- [ ] Page works and looks right on a phone-sized screen, not just desktop.

**Auth & bookmarking**
- [ ] Can sign up with a new email + password.
- [ ] Can log in with that same email + password.
- [ ] Bookmarking an article while logged out prompts sign-up, and completes the bookmark automatically after.
- [ ] Bookmarked article appears on the "My Bookmarks" page.
- [ ] Un-bookmarking removes it from that page.

**Search**
- [ ] Searching a real word returns relevant articles.
- [ ] Searching gibberish shows the "no results" state, not a crash.

**Writer flow**
- [ ] Can create a new draft and see it autosave (check the "Saved" indicator updates).
- [ ] Can submit a complete draft for review.
- [ ] Cannot submit a draft missing a title or body.
- [ ] Submitted article shows as "In Review" on the writer's dashboard.

**Editor flow**
- [ ] Submitted article appears in the Review Queue.
- [ ] Approving it makes it visible on the live public site within a few seconds.
- [ ] Rejecting or requesting changes without typing a reason is blocked.
- [ ] Rejecting or requesting changes with a reason notifies the writer (check the email/notification actually goes out).
- [ ] A writer cannot approve their own article.

**Donations**
- [ ] Can complete a one-off donation with a test card and reach the thank-you page.
- [ ] A receipt email arrives.
- [ ] Can set up a monthly donation and later cancel it from account settings.
- [ ] An invalid/declined test card shows a clear error and doesn't lose the entered amount.

**General**
- [ ] Every button that submits something shows a loading state and can't be double-clicked into duplicate submissions.
- [ ] Every list screen has been checked in all four states: loading, empty, has-data, and error (e.g., turn off wifi and see what happens).
- [ ] Keyboard-only navigation works on the main flows (tab through a form, hit enter to submit).

---

## 8. Unit Test Ideas — behavior to test per component

These are the kind of tests you'd actually write in code later (e.g. with Jest + React Testing Library) — described here as plain behavior, no code.

**ArticleCard**
- Renders the title, author, and date it's given.
- Shows a "read time" estimate if one is passed in, and hides that line if it's not.
- Clicking the card navigates to the right article URL.
- Bookmark icon shows as "filled" when `isBookmarked` is true, "outline" when false.

**BookmarkButton**
- Clicking it while logged in calls the bookmark API and flips the icon state immediately (before the API even responds — this is called "optimistic update").
- If the API call fails, the icon flips back and an error toast shows.
- Clicking it while logged out opens the sign-up panel instead of calling the bookmark API.
- Button is disabled for ~1 second after a click, to prevent double-clicks.

**StatusBadge**
- Given "in_review", renders the label "In Review" with the warning color.
- Given "published", renders "Published" with the success color.
- Given an unrecognized status, doesn't crash — falls back to a neutral "Unknown" badge.

**SearchBar**
- Typing doesn't fire a search request until ~300ms after the user stops typing.
- Clearing the input clears the results.
- Pressing Enter fires the search immediately, without waiting for the debounce.

**ArticleEditor**
- Typing in the body triggers an autosave call after the configured interval, not on every keystroke.
- "Submit for Review" button is disabled if title or body is empty.
- Clicking "Submit" while required fields are filled calls the submit API exactly once.
- Shows an "unsaved changes" warning if the user tries to navigate away right after typing (before autosave fires).

**ReviewActionButtons (Approve / Reject / Request Changes)**
- "Reject" and "Request Changes" are disabled until the feedback text field has at least a few characters.
- Clicking "Approve" calls the approve API and does not require the feedback field.
- These buttons don't render at all if the current user is the article's own author.

**DonationForm**
- Selecting a preset amount fills the amount field; typing a custom amount overrides the preset selection.
- Submitting with an amount of 0 (or blank) is blocked client-side, before any API call.
- Toggling "cover processing fees" updates the displayed total.
- Shows the payment provider's specific error message when a test payment is declined.

**EmptyState / ErrorState**
- Renders the correct message and call-to-action for each of: no bookmarks yet, no search results, no articles in review, failed to load.
- The "Try Again" button on an ErrorState actually re-triggers the original data fetch.

---

## Appendix: keeping the earlier design work

Everything from the previous version of this spec still applies — it's just not repeated in full detail here to keep this document focused on the 8 assignment sections:
- **Brand name:** Kindred.
- **Colors, fonts, spacing, button/card styling:** see the "Quick recap" in §0 above for the short version; the full token list (exact hex codes, spacing scale, border radius, shadows) from the earlier draft is still valid and can be pulled back in whenever you're ready to actually build the UI.
- **Full screen list across the whole platform** (podcasts, sermons, reading plans, events, etc.): the earlier draft's sitemap covers all of these — §2 above is a trimmed version scoped to the flows this assignment focuses on.
