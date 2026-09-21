/* ============================================================
   Portfolio site logic
   Loads all editable content from data.json and renders it
   into the page. Edit data.json to change any content on the
   site — no need to touch this file for normal content updates.
   ============================================================ */

// Contact icon (inline SVG so no external asset dependency)
const CONTACT_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       class="w-8 h-8 shrink-0">
    <circle cx="12" cy="12" r="12" fill="#1E2A4A"/>
    <path d="M8.5 8.2c-.3 0-.6.1-.8.3-.6.6-1 1.9-.6 3.4.4 1.6 1.5 3.4 3 5 1.6 1.5 3.4 2.6 5 3 1.5.4 2.8 0 3.4-.6.2-.2.3-.5.3-.8v-1.3c0-.3-.2-.5-.4-.6l-2.1-.8c-.3-.1-.6 0-.7.2l-.5.7c-.1.2-.4.3-.6.2-1-.4-1.9-1-2.6-1.7-.7-.7-1.3-1.6-1.7-2.6-.1-.2 0-.5.2-.6l.7-.5c.2-.1.3-.4.2-.7l-.8-2.1c-.1-.2-.3-.4-.6-.4H8.5Z"
          fill="white"/>
  </svg>`;

// Small external-link icon used on certification cards
const LINK_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       class="w-4 h-4 inline-block ml-1 -mt-0.5">
    <path d="M14 5h5v5M19 5l-8 8M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

// Small badge/ribbon icon used as placeholder for missing Credly badges
const BADGE_PLACEHOLDER_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       class="w-6 h-6 text-slate-400">
    <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM8.21 13.89 7 22l5-3 5 3-1.21-8.11"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

async function loadData() {
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    console.error(
      "Could not load data.json via fetch (likely opened as a local file).",
      err,
    );
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="bg-red-600 text-white text-sm text-center py-2 px-4">
        Could not load data.json (browsers block fetch() on file://).
        Please serve this folder with a local server, e.g.
        <code class="bg-red-800 px-1 rounded">python -m http.server</code>
        or <code class="bg-red-800 px-1 rounded">npx serve</code>, then open localhost in your browser.
      </div>`,
    );
    return null;
  }
}

function renderNav(nav) {
  const container = document.getElementById("nav-links");
  container.innerHTML = nav
    .map(
      (item) => `
    <a href="#${item.target}"
       class="nav-link px-5 py-2 rounded-md bg-navy hover:bg-navy-dark text-white text-xs md:text-sm font-semibold tracking-wide transition-colors">
      ${escapeHtml(item.label).toUpperCase()}
    </a>
  `,
    )
    .join("");
}

function renderSite(site) {
  document.title = site.pageTitle || document.title;
  document.getElementById("brand-name").textContent = site.brandName || "";
  document.getElementById("brand-sub").textContent = site.brandSub || "";
  if (site.logo) document.getElementById("logo-img").src = site.logo;
}

function renderHero(hero) {
  if (hero.photo) document.getElementById("hero-photo").src = hero.photo;

  document.getElementById("hero-title").textContent =
    `${hero.name} – ${hero.title}`;

  document.getElementById("hero-bio").innerHTML = hero.bio
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  const c = hero.contact;
  document.getElementById("hero-contact").innerHTML = `
    ${CONTACT_ICON}
    <p class="text-lg">
      <span class="font-bold">${escapeHtml(c.label)}:</span>
      ${escapeHtml(c.phone)} –
      <a href="mailto:${escapeHtml(c.email)}" class="underline decoration-navy/40 hover:text-navy">${escapeHtml(c.email)}</a>
    </p>`;
}

// Renders each skill as an actual brand logo:
//  - type "simple-icon": pulls the real, colored SVG logo from the Simple Icons
//    CDN (https://cdn.simpleicons.org/<slug>/<color>) — requires internet access
//    in the visitor's browser (works on any normal web host).
//  - type "image": uses a local file from /assets (e.g. for brands not available
//    on Simple Icons, such as Microsoft Fabric).
function renderSkills(skills) {
  document.getElementById("skills-strip").innerHTML = skills
    .map((s) => {
      const iconSrc =
        s.type === "simple-icon"
          ? `https://cdn.simpleicons.org/${encodeURIComponent(s.slug)}/${encodeURIComponent(s.color || "")}`
          : s.src;
      return `
      <div class="flex flex-col items-center gap-2" title="${escapeAttr(s.name)}">
        <div class="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white shadow-md flex items-center justify-center p-3">
          <img src="${escapeAttr(iconSrc)}" alt="${escapeAttr(s.name)} logo" class="max-w-full max-h-full object-contain" loading="lazy" />
        </div>
        <span class="text-[11px] md:text-xs font-semibold text-slate-600 text-center leading-tight">${escapeHtml(s.name)}</span>
      </div>
    `;
    })
    .join("");
}

// Renders the introductory video section.
//
// Supports two providers:
//   - "youtube": embeds a standard YouTube video OR a YouTube Short via the
//     official https://www.youtube.com/embed/<VIDEO_ID> iframe format (this
//     works identically for Shorts — YouTube just serves it in its normal
//     player). Because Shorts are filmed vertically (9:16) rather than the
//     usual 16:9, the wrapper switches to a tall, centered portrait frame
//     when `isShort` is true, instead of stretching a vertical video into a
//     wide box.
//   - "google-drive": kept for backwards compatibility, embeds a Drive file
//     via its /preview iframe URL (requires "Anyone with the link" sharing).
function renderVideoIntro(video) {
  if (!video) return;

  document.getElementById("video-heading").textContent =
    video.heading || "Introductory Video";
  document.getElementById("video-description").textContent =
    video.description || "";

  let embedUrl = video.embedUrl;
  if (video.provider === "youtube" && video.youtubeVideoId) {
    embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(video.youtubeVideoId)}`;
  } else if (video.provider === "google-drive" && video.driveFileId) {
    embedUrl = `https://drive.google.com/file/d/${encodeURIComponent(video.driveFileId)}/preview`;
  }

  const wrapper = document.getElementById("video-embed-wrapper");

  // Reset aspect-ratio classes, then apply the right one for this video
  wrapper.classList.remove(
    "video-aspect-landscape",
    "video-aspect-portrait",
    "max-w-md",
    "max-w-3xl",
  );
  if (video.isShort) {
    // Vertical Shorts video: tall, centered, capped width so it isn't stretched full-page-wide
    wrapper.classList.add("video-aspect-portrait", "max-w-md");
  } else {
    wrapper.classList.add("video-aspect-landscape", "max-w-3xl");
  }

  wrapper.innerHTML = `
    <iframe
      src="${escapeAttr(embedUrl)}"
      class="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowfullscreen
      loading="lazy"
      title="${escapeAttr(video.heading || "Introductory video")}">
    </iframe>
  `;

  const fallback = document.getElementById("video-fallback-link");
  if (fallback) fallback.href = video.shareLink || embedUrl;
}

function renderEducation(list) {
  document.getElementById("education-list").innerHTML = list
    .map(
      (e) => `
    <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
      <h3 class="font-bold text-lg text-navy-dark">${escapeHtml(e.qualification)}</h3>
      ${
        e.institution || e.period
          ? `
        <p class="text-sm text-slate-500 font-medium mb-2">
          ${[e.institution, e.period].filter(Boolean).map(escapeHtml).join(" · ")}
        </p>`
          : ""
      }
      ${e.details ? `<p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(e.details)}</p>` : ""}
    </div>
  `,
    )
    .join("");
}

// Renders each certification card with:
//  1. Name / issuer / date
//  2. A "View reference" link (official course/certification page)
//  3. A Credly badge slot:
//     - If `credlyBadgeId` is filled in data.json, embeds the OFFICIAL Credly
//       badge widget (the same embed Credly gives you from your badge's
//       "Share" > "Embed" option), which shows the live badge image.
//     - If left empty, shows a placeholder so it's obvious where to add it.
function renderCertifications(list) {
  document.getElementById("certifications-list").innerHTML = list
    .map(
      (c) => `
    <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
      <h3 class="font-bold text-lg text-navy-dark mb-1">${escapeHtml(c.name)}</h3>
      <p class="text-sm text-slate-500 font-medium mb-4">
        ${[c.issuer, c.date].filter(Boolean).map(escapeHtml).join(" · ")}
      </p>

      <div class="flex items-center justify-center mb-4 min-h-[110px]">
        ${
          c.credlyBadgeId
            ? `<div data-iframe-width="120" data-iframe-height="150" data-share-badge-id="${escapeAttr(c.credlyBadgeId)}" data-share-badge-host="https://www.credly.com"></div>`
            : `<div class="flex flex-col items-center gap-1 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg px-4 py-3">
               ${BADGE_PLACEHOLDER_ICON}
               <span class="text-[11px] text-center leading-tight">Credly badge<br/>not yet added</span>
             </div>`
        }
      </div>

      <a href="${escapeAttr(c.link)}" target="_blank" rel="noopener noreferrer"
         class="mt-auto inline-flex items-center justify-center text-navy font-semibold text-sm hover:text-navy-dark hover:underline">
        View reference ${LINK_ICON}
      </a>
    </div>
  `,
    )
    .join("");

  // (Re)load the official Credly embed script so it scans the DOM and turns
  // every data-share-badge-id div above into a live badge. Credly's script
  // only auto-initializes badges present at the time it loads, so we insert
  // a fresh <script> tag each time this function runs.
  const existing = document.getElementById("credly-embed-script");
  if (existing) existing.remove();
  if (list.some((c) => c.credlyBadgeId)) {
    const script = document.createElement("script");
    script.id = "credly-embed-script";
    script.async = true;
    script.src = "https://cdn.credly.com/assets/utilities/embed.js";
    document.body.appendChild(script);
  }
}

function renderExperience(list) {
  document.getElementById("experience-list").innerHTML = list
    .map(
      (x) => `
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h3 class="font-bold text-lg text-navy-dark">${escapeHtml(x.role)}</h3>
        <span class="text-sm text-slate-500 font-medium">${escapeHtml(x.period)}</span>
      </div>
      <p class="text-navy font-semibold mb-3">${escapeHtml(x.company)}</p>
      <ul class="list-disc list-inside space-y-1 text-slate-600 text-sm leading-relaxed">
        ${x.responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}
      </ul>
    </div>
  `,
    )
    .join("");
}

function renderProjects(list) {
  document.getElementById("projects-list").innerHTML = list
    .map(
      (p) => `
    <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
      <h3 class="font-bold text-lg text-navy-dark mb-2">${escapeHtml(p.name)}</h3>
      <p class="text-slate-600 text-sm leading-relaxed mb-4 flex-1">${escapeHtml(p.description)}</p>
      <div class="flex flex-wrap gap-2">
        ${p.tags.map((t) => `<span class="text-xs font-semibold px-2 py-1 rounded bg-navy/10 text-navy-dark">${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

function renderAbout(about) {
  document.getElementById("about-heading").textContent =
    about.heading || "About Me";
  document.getElementById("about-content").innerHTML = about.paragraphs
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

function renderFooter(footer) {
  document.getElementById("footer-text").textContent = footer.text || "";
}

// Highlight the nav link matching the section currently in view
function setupScrollSpy(nav) {
  const sections = nav
    .map((n) => document.getElementById(n.target))
    .filter(Boolean);
  const links = () => Array.from(document.querySelectorAll(".nav-link"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links().forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((s) => observer.observe(s));
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

async function init() {
  const data = await loadData();
  if (!data) return;

  renderSite(data.site);
  renderNav(data.nav);
  renderHero(data.hero);
  renderSkills(data.skills);
  renderVideoIntro(data.videoIntro);
  renderEducation(data.education);
  renderCertifications(data.certifications);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderAbout(data.about);
  renderFooter(data.footer);
  setupScrollSpy(data.nav);
}

document.addEventListener("DOMContentLoaded", init);
