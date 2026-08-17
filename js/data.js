/* =========================================================
   Kindred — dummy data
   Stands in for real API responses across every page.
   ========================================================= */

const date = new Date();
const today = date.toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});

const DEVOTIONAL_TODAY = {
  date: today,
  title: "Rest for the Weary",
  passage: "Matthew 11:28–30",
  excerpt: "Come to me, all you who are weary and burdened, and I will give you rest. Today's devotional sits with what it actually means to lay a burden down.",
};

const ARTICLES = [
  { id: 1, slug: "walking-with-god-in-the-wilderness", title: "Walking With God in the Wilderness", excerpt: "What forty years of desert wandering can teach us about seasons that don't make sense yet.", author: "Amara Nwosu", authorSlug: "amara-nwosu", date: "Aug 12, 2026", readTime: 6, topic: "Faith & Doubt", status: "published" },
  { id: 2, slug: "the-discipline-of-showing-up", title: "The Discipline of Showing Up", excerpt: "Consistency isn't glamorous, but it's where most spiritual growth actually happens.", author: "David Chen", authorSlug: "david-chen", date: "Aug 10, 2026", readTime: 4, topic: "Spiritual Habits", status: "published" },
  { id: 3, slug: "grace-for-the-anxious-mind", title: "Grace for the Anxious Mind", excerpt: "Is it wrong to be anxious? A gentler look at what Scripture actually says about worry.", author: "Amara Nwosu", authorSlug: "amara-nwosu", date: "Aug 8, 2026", readTime: 5, topic: "Mental Health", status: "published" },
  { id: 4, slug: "reading-romans-slowly", title: "Reading Romans Slowly", excerpt: "A case for spending a whole year in one letter instead of racing through the whole Bible.", author: "Pastor Samuel Okoro", authorSlug: "samuel-okoro", date: "Aug 6, 2026", readTime: 8, topic: "Bible Study", status: "published" },
  { id: 5, slug: "what-community-actually-costs", title: "What Community Actually Costs", excerpt: "Belonging to a church means showing up for people on their worst days, not just the good ones.", author: "Rebecca Hall", authorSlug: "rebecca-hall", date: "Aug 4, 2026", readTime: 5, topic: "Community", status: "published" },
  { id: 6, slug: "prayer-when-words-run-out", title: "Prayer When the Words Run Out", excerpt: "Some seasons don't have language for them. That's allowed.", author: "David Chen", authorSlug: "david-chen", date: "Aug 1, 2026", readTime: 4, topic: "Prayer", status: "published" },
];

// A writer's own articles, in varying stages of the workflow
const WRITER_ARTICLES = [
  { id: 101, title: "Finding Hope in Difficult Seasons", topic: "Faith & Doubt", status: "in_review", updated: "2 days ago" },
  { id: 102, title: "Letters to My Younger Christian Self", topic: "Testimony", status: "draft", updated: "Yesterday" },
  { id: 3, title: "Grace for the Anxious Mind", topic: "Mental Health", status: "published", updated: "Aug 8, 2026" },
  { id: 103, title: "On Doubting Well", topic: "Faith & Doubt", status: "changes_requested", updated: "5 days ago" },
  { id: 104, title: "A Short Theology of Rest", topic: "Spiritual Habits", status: "rejected", updated: "1 week ago" },
];

// Articles waiting in the editor's review queue
const REVIEW_QUEUE = [
  { id: 201, title: "Finding Hope in Difficult Seasons", writer: "John Ade", topic: "Faith & Doubt", submitted: "2 days ago", age: "high" },
  { id: 202, title: "Walking in Love, Even When It's Hard", writer: "Sarah Paul", topic: "Relationships", submitted: "6 hours ago", age: "low" },
  { id: 203, title: "Understanding Grace", writer: "Peter Mark", topic: "Bible Study", submitted: "4 days ago", age: "high" },
  { id: 204, title: "Why We Sing", writer: "Amara Nwosu", topic: "Worship", submitted: "1 day ago", age: "medium" },
];

const REVIEW_ARTICLE_DETAIL = {
  title: "Finding Hope in Difficult Seasons",
  writer: "John Ade",
  topic: "Christian Living",
  submitted: "August 11, 2026",
  body: [
    "There's a particular kind of silence that settles over a hard season — not the peaceful kind, but the kind where you've run out of things to say to God and aren't sure what's left.",
    "Scripture doesn't rush past this. The Psalms spend more time in complaint and confusion than they do in triumphant praise. Lament is not a failure of faith; it's one of faith's most honest forms.",
    "If you're in a season like this, the invitation isn't to perform hope you don't feel yet. It's to stay in the room with God even when you have nothing polished to bring.",
  ],
};

function findArticle(slug) {
  return ARTICLES.find(a => a.slug === slug) || ARTICLES[0];
}

function relatedArticles(current, count = 3) {
  return ARTICLES.filter(a => a.slug !== current.slug).slice(0, count);
}
