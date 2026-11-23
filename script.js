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

// Small external-link icon used on certification cards & links
const LINK_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       class="w-4 h-4 inline-block ml-1 -mt-0.5 shrink-0">
    <path d="M14 5h5v5M19 5l-8 8M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

// Certificate ribbon icon used for non-Credly platforms & fallbacks
const CERTIFICATE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       class="w-7 h-7 text-navy">
    <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM8.21 13.89 7 22l5-3 5 3-1.21-8.11"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

// Platform icons for project links (Jupyter, GitHub, Power BI, RPubs, Download, Preview)
const PROJECT_ICONS = {
  github: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>`,
  jupyter: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-4 h-4 shrink-0">
      <path d="M4.5 7.5C6.8 5 10.2 3.8 14 4.3c2.5.3 4.6 1.4 6 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M19.5 16.5C17.2 19 13.8 20.2 10 19.7c-2.5-.3-4.6-1.4-6-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="18.5" cy="4.5" r="1.5" fill="currentColor"/>
      <circle cx="5.5" cy="19.5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>`,
  powerbi: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 shrink-0">
      <rect x="4" y="13" width="3.5" height="7" rx="1"/>
      <rect x="10.25" y="9" width="3.5" height="11" rx="1"/>
      <rect x="16.5" y="4" width="3.5" height="16" rx="1"/>
    </svg>`,
  rpubs: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-4 h-4 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
      <path d="M9.5 16V8h3.2a2.3 2.3 0 0 1 0 4.6H9.5m3.3 0L15.2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  download: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-4 h-4 shrink-0">
      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  preview: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-4 h-4 shrink-0">
      <path d="M14 5h5v5M19 5l-8 8M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  default: LINK_ICON,
};

const PLATFORM_META = {
  jupyter: {
    label: "Jupyter Notebook",
    btnClass:
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  },
  github: {
    label: "GitHub",
    btnClass:
      "bg-slate-800 text-white border-slate-800 hover:bg-slate-700",
  },
  powerbi: {
    label: "Power BI",
    btnClass:
      "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
  rpubs: {
    label: "RPubs",
    btnClass:
      "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  },
  default: {
    label: "Project Link",
    btnClass: "bg-navy text-white border-navy hover:bg-navy-dark",
  },
};

// Known certification providers for automatic icon & badge detection
const CERT_PROVIDERS = [
  { match: /coursera/i, label: "Coursera", slug: "coursera", color: "0056D2" },
  { match: /microsoft|azure/i, label: "Microsoft", slug: "microsoft", color: "5E5E5E" },
  { match: /google/i, label: "Google", slug: "google", color: "4285F4" },
  { match: /\bibm\b/i, label: "IBM", slug: "ibm", color: "052FAD" },
  { match: /\bsap\b/i, label: "SAP", slug: "sap", color: "0FAAFF" },
  { match: /udemy/i, label: "Udemy", slug: "udemy", color: "A435F0" },
  { match: /linkedin/i, label: "LinkedIn Learning", slug: "linkedin", color: "0A66C2" },
  { match: /\baws\b|amazon/i, label: "AWS", slug: "amazonaws", color: "232F3E" },
  { match: /edx/i, label: "edX", slug: "edx", color: "02262B" },
  { match: /datacamp/i, label: "DataCamp", slug: "datacamp", color: "03EF62" },
  { match: /kaggle/i, label: "Kaggle", slug: "kaggle", color: "20BEFF" },
  { match: /hackerrank/i, label: "HackerRank", slug: "hackerrank", color: "00EA64" },
  { match: /cisco/i, label: "Cisco", slug: "cisco", color: "1BA0D7" },
  { match: /comptia/i, label: "CompTIA", slug: "comptia", color: "C8202F" },
  { match: /freecodecamp/i, label: "freeCodeCamp", slug: "freecodecamp", color: "0A0A23" },
];

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

// Renders skills as a seamless infinite horizontal marquee
function renderSkills(skills) {
  const track = document.getElementById("skills-strip");
  if (!track || !Array.isArray(skills) || skills.length === 0) return;

  const durationSeconds = Math.max(22, skills.length * 3.2);
  track.style.setProperty("--marquee-duration", `${durationSeconds}s`);

  const itemsHtml = skills
    .map((s) => {
      const iconSrc =
        s.type === "simple-icon"
          ? `https://cdn.simpleicons.org/${encodeURIComponent(s.slug)}/${encodeURIComponent(s.color || "")}`
          : sanitizeUrl(s.src);
      return `
      <div class="w-20 md:w-24 shrink-0 flex flex-col items-center gap-2" title="${escapeAttr(s.name)}">
        <div class="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-3">
          <img src="${escapeAttr(iconSrc)}" alt="${escapeAttr(s.name)} logo" class="max-w-full max-h-full object-contain" loading="lazy" />
        </div>
        <span class="text-[11px] md:text-xs font-semibold text-slate-600 text-center leading-tight">${escapeHtml(s.name)}</span>
      </div>
    `;
    })
    .join("");

  track.innerHTML = `
    <div class="skills-marquee-group">${itemsHtml}</div>
    <div class="skills-marquee-group" aria-hidden="true">${itemsHtml}</div>
  `;
}

function renderVideoIntro(video) {
  if (!video) return;

  const headingEl = document.getElementById("video-heading");
  const descEl = document.getElementById("video-description");
  const wrapper = document.getElementById("video-embed-wrapper");
  const fallback = document.getElementById("video-fallback-link");

  if (!headingEl || !descEl || !wrapper) return;

  headingEl.textContent = video.heading || "Introductory Video";
  descEl.textContent = video.description || "";

  let embedUrl = video.embedUrl;
  if (video.provider === "youtube" && video.youtubeVideoId) {
    embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(video.youtubeVideoId)}`;
  } else if (video.provider === "google-drive" && video.driveFileId) {
    embedUrl = `https://drive.google.com/file/d/${encodeURIComponent(video.driveFileId)}/preview`;
  }

  wrapper.classList.remove(
    "video-aspect-landscape",
    "video-aspect-portrait",
    "max-w-md",
    "max-w-3xl",
  );

  if (video.isShort) {
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

function resolveCertProvider(cert) {
  const haystack = `${cert.platform || ""} ${cert.issuer || ""} ${cert.link || ""}`;
  const detected = CERT_PROVIDERS.find((p) => p.match.test(haystack));

  return {
    label: cert.platform || detected?.label || "Verified Certificate",
    slug: cert.issuerIcon || detected?.slug || null,
    color: cert.issuerColor || detected?.color || "1E2A4A",
  };
}

function renderCertificationVisual(c) {
  if (c.credlyBadgeId) {
    return `<div data-iframe-width="120" data-iframe-height="150" data-share-badge-id="${escapeAttr(c.credlyBadgeId)}" data-share-badge-host="https://www.credly.com"></div>`;
  }

  if (c.badgeImage) {
    return `
      <div class="flex flex-col items-center gap-2">
        <img src="${escapeAttr(sanitizeUrl(c.badgeImage))}"
             alt="${escapeAttr(c.name)} badge"
             class="h-24 w-auto max-w-[160px] object-contain rounded-lg"
             loading="lazy" />
        ${
          c.credentialId
            ? `<span class="text-[11px] font-medium text-slate-400">ID: ${escapeHtml(c.credentialId)}</span>`
            : ""
        }
      </div>`;
  }

  const provider = resolveCertProvider(c);
  const iconHtml = provider.slug
    ? `<img src="https://cdn.simpleicons.org/${encodeURIComponent(provider.slug)}/${encodeURIComponent(provider.color)}"
            alt="${escapeAttr(provider.label)} logo"
            class="w-7 h-7 object-contain"
            loading="lazy" />`
    : CERTIFICATE_ICON;

  return `
    <div class="w-full max-w-[220px] flex flex-col items-center gap-2 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3.5 text-center">
      <div class="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
        ${iconHtml}
      </div>
      <span class="text-xs font-semibold text-navy-dark leading-tight">${escapeHtml(provider.label)}</span>
      ${
        c.credentialId
          ? `<span class="text-[11px] text-slate-500 leading-tight">ID: ${escapeHtml(c.credentialId)}</span>`
          : `<span class="text-[11px] text-slate-400 leading-tight">Verified Credential</span>`
      }
    </div>`;
}

function renderCertifications(list) {
  document.getElementById("certifications-list").innerHTML = list
    .map((c) => {
      const linkText =
        c.linkLabel ||
        (c.credlyBadgeId || c.credentialId
          ? "Verify credential"
          : "View certificate");

      return `
      <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
        <h3 class="font-bold text-lg text-navy-dark mb-1">${escapeHtml(c.name)}</h3>
        <p class="text-sm text-slate-500 font-medium mb-4">
          ${[c.issuer, c.date].filter(Boolean).map(escapeHtml).join(" · ")}
        </p>

        <div class="flex items-center justify-center mb-4 min-h-[110px] flex-1">
          ${renderCertificationVisual(c)}
        </div>

        ${
          c.link
            ? `<a href="${escapeAttr(sanitizeUrl(c.link))}" target="_blank" rel="noopener noreferrer"
                  class="mt-auto inline-flex items-center justify-center text-navy font-semibold text-sm hover:text-navy-dark hover:underline">
                 ${escapeHtml(linkText)} ${LINK_ICON}
               </a>`
            : ""
        }
      </div>
    `;
    })
    .join("");

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

function getNormalizedProjectLinks(project) {
  const links = Array.isArray(project.links)
    ? [...project.links]
    : [];

  // Support shorthand "pbixFile": "assets/report.pbix" directly on a project
  if (project.pbixFile) {
    links.unshift({
      type: "powerbi",
      label: project.pbixLabel || "Download .pbix",
      url: project.pbixFile,
      download: true,
    });
  }

  return links.filter((l) => l && l.url);
}

function getProjectCategory(project) {
  if (project.category) return project.category;
  const links = getNormalizedProjectLinks(project);
  const firstLinkType = links[0]?.type?.toLowerCase();
  if (firstLinkType && PLATFORM_META[firstLinkType]) {
    return PLATFORM_META[firstLinkType].label;
  }
  return null;
}

function isDownloadableFile(link) {
  if (typeof link.download === "boolean") return link.download;
  return /\.(pbix|pbit|ipynb|rmd|r|py|sql|xlsx|csv|pdf|zip)$/i.test(
    link.url || "",
  );
}

function getDownloadFilename(url) {
  const clean = String(url || "").split("?")[0].split("#")[0];
  const last = clean.split("/").pop() || "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

// Resolves a URL to open in a new tab when the user clicks "Preview"
function getPreviewUrl(link) {
  const customPreview = link.previewUrl || link.embedUrl;
  if (customPreview) return sanitizeUrl(customPreview);

  const type = (link.type || "").toLowerCase();
  const url = String(link.url || "").trim();

  if (type === "rpubs" && /^https?:\/\/(www\.)?rpubs\.com\//i.test(url)) {
    return sanitizeUrl(url);
  }

  if (
    type === "jupyter" &&
    /^https?:\/\/github\.com\/[^/]+\/[^/]+\/blob\/.+\.ipynb$/i.test(url)
  ) {
    return sanitizeUrl(
      url.replace(/^https?:\/\/github\.com\//i, "https://nbviewer.org/github/"),
    );
  }

  if (type === "powerbi" && /^https?:\/\/app\.powerbi\.com\//i.test(url)) {
    return sanitizeUrl(url);
  }

  return null;
}

function renderProjectLinks(project) {
  const links = getNormalizedProjectLinks(project);
  if (links.length === 0) return "";

  const baseBtnLayout =
    "flex-1 min-w-[calc(50%-0.25rem)] h-9 inline-flex items-center justify-center gap-2 px-3.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors";

  const buttonsHtml = links
    .map((link) => {
      const type = (link.type || "default").toLowerCase();
      const meta = PLATFORM_META[type] || PLATFORM_META.default;
      const icon = PROJECT_ICONS[type] || PROJECT_ICONS.default;
      const safeUrl = sanitizeUrl(link.url);
      const isDownload = isDownloadableFile(link);
      const downloadName = isDownload
        ? link.filename || getDownloadFilename(link.url)
        : "";
      const defaultLabel =
        isDownload && type === "powerbi" ? "Download .pbix" : meta.label;
      const label = link.label || defaultLabel;
      const previewUrl = getPreviewUrl(link);

      const mainLinkHtml = `
        <a href="${escapeAttr(safeUrl)}"
           ${
             isDownload
               ? `download="${escapeAttr(downloadName)}"`
               : 'target="_blank" rel="noopener noreferrer"'
           }
           class="${baseBtnLayout} ${meta.btnClass}">
          ${icon}
          <span>${escapeHtml(label)}</span>
          ${isDownload ? PROJECT_ICONS.download : ""}
        </a>`;

      const previewLinkHtml = previewUrl
        ? `
        <a href="${escapeAttr(previewUrl)}"
           target="_blank"
           rel="noopener noreferrer"
           class="${baseBtnLayout} border-navy/30 bg-white text-navy-dark hover:bg-navy hover:text-white hover:border-navy">
          ${PROJECT_ICONS.preview}
          <span>Preview</span>
        </a>`
        : "";

      return mainLinkHtml + previewLinkHtml;
    })
    .join("");

  return `
    <div class="border-t border-slate-100 pt-3.5 mt-4 flex flex-wrap items-center gap-2">
      ${buttonsHtml}
    </div>
  `;
}

function renderProjects(list) {
  const filtersContainer = document.getElementById("projects-filters");
  const listContainer = document.getElementById("projects-list");

  const categories = Array.from(
    new Set(list.map(getProjectCategory).filter(Boolean)),
  );

  let activeFilter = "All";

  function drawCards() {
    const filtered =
      activeFilter === "All"
        ? list
        : list.filter((p) => getProjectCategory(p) === activeFilter);

    listContainer.innerHTML = filtered
      .map((p) => {
        const category = getProjectCategory(p);
        return `
        <div class="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
          ${
            category
              ? `<div class="mb-2">
                   <span class="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                     ${escapeHtml(category)}
                   </span>
                 </div>`
              : ""
          }
          <h3 class="font-bold text-lg text-navy-dark mb-2">${escapeHtml(p.name)}</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4 flex-1">${escapeHtml(p.description)}</p>
          <div class="mt-auto">
            <div class="flex flex-wrap gap-2">
              ${(p.tags || []).map((t) => `<span class="text-xs font-semibold px-2 py-1 rounded bg-navy/10 text-navy-dark">${escapeHtml(t)}</span>`).join("")}
            </div>
            ${renderProjectLinks(p)}
          </div>
        </div>
      `;
      })
      .join("");
  }

  function drawFilters() {
    if (!filtersContainer) return;
    if (categories.length <= 1) {
      filtersContainer.innerHTML = "";
      return;
    }

    const tabs = ["All", ...categories];
    filtersContainer.innerHTML = tabs
      .map((tab) => {
        const isActive = tab === activeFilter;
        const btnStyle = isActive
          ? "bg-navy text-white border-navy"
          : "bg-white text-slate-700 border-slate-200 hover:border-navy hover:text-navy";
        return `
          <button type="button"
                  data-filter="${escapeAttr(tab)}"
                  class="project-filter-btn px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${btnStyle}">
            ${escapeHtml(tab)}
          </button>`;
      })
      .join("");

    filtersContainer.querySelectorAll(".project-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter");
        drawFilters();
        drawCards();
      });
    });
  }

  drawFilters();
  drawCards();
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

function sanitizeUrl(url) {
  const str = String(url || "").trim();
  if (!str) return "#";
  if (/^(javascript|data|vbscript):/i.test(str)) return "#";
  if (/^(https?:\/\/|mailto:|\/|\.\/)/i.test(str)) {
    return str.replace(/ /g, "%20");
  }
  if (/^[a-zA-Z0-9_\-./\s()&]+$/.test(str)) {
    return str.replace(/ /g, "%20");
  }
  return "#";
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