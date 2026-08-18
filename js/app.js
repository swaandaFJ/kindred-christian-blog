/* =========================================================
   Kindred — shared app behavior
   ========================================================= */

// ---------- mobile nav ----------
document.addEventListener("DOMContentLoaded", () => {
	const burger = document.getElementById("navBurger");
	const links = document.querySelector(".nav-links");
	if (burger && links) {
		burger.addEventListener("click", () => links.classList.toggle("open"));
	}
	reflectAuthState();
});

// ---------- fake auth state (localStorage) ----------
function isLoggedIn() {
	return localStorage.getItem("kindred_logged_in") === "true";
}
function setLoggedIn(val) {
	localStorage.setItem("kindred_logged_in", val ? "true" : "false");
	reflectAuthState();
}
function reflectAuthState() {
	const authLink = document.getElementById("authLink");
	if (!authLink) return;
	if (isLoggedIn()) {
		authLink.textContent = "Account";
		authLink.href = "bookmarks.html";
	} else {
		authLink.textContent = "Log in";
		authLink.href = "login.html";
	}
}

// ---------- log out ----------
const logout = document.getElementById("signout");
(!isLoggedIn()) ? logout.classList.add("logged-out") : logout.classList.remove("logged-out");
logout.addEventListener("click", (event) => {
	if (!isLoggedIn()) return;
	setLoggedIn(false);
	showToast("Logged out!", "success");
	logout.classList.add("logged-out");
	setTimeout(() => (location.href = "index.html"), 500);
})

// ---------- bookmarks (localStorage) ----------
function getBookmarks() {
	return JSON.parse(localStorage.getItem("kindred_bookmarks") || "[]");
}
function isBookmarked(id) {
	return getBookmarks().includes(id);
}
function toggleBookmark(id) {
	let marks = getBookmarks();
	const wasBookmarked = marks.includes(id);
	marks = wasBookmarked ? marks.filter((x) => x !== id) : [...marks, id];
	localStorage.setItem("kindred_bookmarks", JSON.stringify(marks));
	return !wasBookmarked;
}

// wires up any [data-bookmark-id] button on the page
function wireBookmarkButtons(root = document) {
	root.querySelectorAll("[data-bookmark-id]").forEach((btn) => {
		const id = Number(btn.dataset.bookmarkId);
		syncBookmarkBtn(btn, id);
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (!isLoggedIn()) {
				openGuestBookmarkPrompt(id, btn);
				return;
			}
			const nowActive = toggleBookmark(id);
			syncBookmarkBtn(btn, id);
			showToast(
				nowActive ? "Saved to your bookmarks" : "Removed from bookmarks",
				"success",
			);
		});
	});
}
function syncBookmarkBtn(btn, id) {
	const active = isBookmarked(id);
	btn.classList.toggle("active", active);
	btn.textContent = active ? "★ Saved" : "☆ Save";
	btn.setAttribute("aria-pressed", active);
}

// guest -> registered pattern: bookmarking while logged out opens a
// lightweight inline panel instead of navigating away (spec section 4.1 / 1a)
function openGuestBookmarkPrompt(pendingId, triggerBtn) {
	const existing = document.getElementById("guestPromptOverlay");
	if (existing) existing.remove();

	const overlay = document.createElement("div");
	overlay.id = "guestPromptOverlay";
	overlay.style.cssText =
		"position:fixed;inset:0;background:rgba(34,31,29,.45);display:flex;align-items:center;justify-content:center;z-index:90;padding:16px;";
	overlay.innerHTML = `
    <div class="card card-pad" style="max-width:360px;width:100%;box-shadow:var(--shadow-lg)">
      <h3>Save this for later?</h3>
      <p class="text-muted">Create a free account and we'll bookmark it for you automatically.</p>
      <div class="field"><label for="gp-email">Email</label><input id="gp-email" type="email" placeholder="you@example.com"></div>
      <div class="field mb-0"><label for="gp-pass">Password</label><input id="gp-pass" type="password" placeholder="At least 10 characters"></div>
      <div class="flex gap-sm mt-lg">
        <button class="btn btn-primary btn-block" id="gp-submit">Create account &amp; save</button>
      </div>
      <button class="btn btn-outline btn-block mt-lg" id="gp-cancel">Cancel</button>
    </div>`;
	document.body.appendChild(overlay);

	document
		.getElementById("gp-cancel")
		.addEventListener("click", () => overlay.remove());
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) overlay.remove();
	});
	document.getElementById("gp-submit").addEventListener("click", () => {
		setLoggedIn(true);
		toggleBookmark(pendingId);
		overlay.remove();
		if (triggerBtn) syncBookmarkBtn(triggerBtn, pendingId);
		showToast("Account created — bookmarked!", "success");
	});
}

// ---------- toast ----------
function showToast(msg, type = "") {
	let toast = document.getElementById("toast");
	if (!toast) {
		toast = document.createElement("div");
		toast.id = "toast";
		document.body.appendChild(toast);
	}
	toast.textContent = msg;
	toast.className = type;
	requestAnimationFrame(() => toast.classList.add("show"));
	clearTimeout(toast._t);
	toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- status badge label ----------
const STATUS_LABELS = {
	draft: "Draft",
	in_review: "In Review",
	changes_requested: "Changes Requested",
	approved: "Approved",
	published: "Published",
	rejected: "Rejected",
	archived: "Archived",
};
function statusBadge(status) {
	const label = STATUS_LABELS[status] || "Unknown";
	return `<span class="badge badge-${status}">${label}</span>`;
}

// ---------- article card renderer (reused: home, search, author, related) ----------
function articleCardHTML(a) {
	const initial = a.topic ? a.topic[0] : "K";
	return `
  <div class="card card-hover article-card">
    <a href="article.html?slug=${a.slug}" style="color:inherit">
      <div class="cover"><span>${initial}</span></div>
    </a>
    <div class="body">
      <span class="badge badge-topic" style="align-self:flex-start">${a.topic}</span>
      <a href="article.html?slug=${a.slug}" style="color:inherit"><h3>${a.title}</h3></a>
      <p class="excerpt">${a.excerpt}</p>
      <div class="card-footer">
        <span class="meta">${a.author} · ${a.date}</span>
        <button class="bookmark-btn" data-bookmark-id="${a.id}" aria-label="Bookmark this article">☆</button>
      </div>
    </div>
  </div>`;
}

function skeletonCardsHTML(n = 6) {
	let out = "";
	for (let i = 0; i < n; i++) {
		out += `<div class="card skeleton skeleton-card"></div>`;
	}
	return out;
}

function emptyStateHTML(icon, title, msg, ctaLabel, ctaHref) {
	return `
  <div class="state-box">
    <div class="icon">${icon}</div>
    <h3>${title}</h3>
    <p>${msg}</p>
    ${ctaLabel ? `<a href="${ctaHref}" class="btn btn-primary mt-lg">${ctaLabel}</a>` : ""}
  </div>`;
}

function errorStateHTML(retryFnName) {
	return `
  <div class="state-box">
    <div class="icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p>We couldn't load this right now. Check your connection and try again.</p>
    <button class="btn btn-primary mt-lg" onclick="${retryFnName}()">Try again</button>
  </div>`;
}
