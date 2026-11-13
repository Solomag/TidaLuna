import { Tracer } from "@luna/core";
import { unloads } from "../../index.safe";
import { lunaUiAppearance, onLunaUiAppearanceChange } from "../../appearance";
import {
  lunaticLayoutCss,
  lunaticPluginStoreUxCss,
  lunaticVisualCss,
} from "./styles/runtime";

export const { trace } = Tracer("[Lunatic]");
const STYLE_ID = "solo-luna-ui-style";
const APPEARANCE_STYLE_ID = "luna-ui-appearance-vars";
const POPOVER_ID = "solo-plugin-store-description-popover";
const ACTION_CLASS = "solo-plugin-store-real-action";

const DESCRIPTION_SELECTOR =
  ':scope > .MuiBox-root:first-child > h6.MuiTypography-root.MuiTypography-subtitle2';
const ORIGINAL_ACTION_SELECTOR =
  ':scope > p.MuiTypography-root.MuiTypography-body1';

const abort = new AbortController();
const { signal } = abort;

let observer: MutationObserver | null = null;
let scanQueued = false;
let scanFrame: number | null = null;
let hideTimer: number | null = null;
let activeDescription: HTMLElement | null = null;

/* A synthetic card.click() is allowed only while the real action button is
   intentionally forwarding one activation to Luna's original React handler. */
const forwardedCards = new WeakSet<HTMLButtonElement>();


const BRAND_ID = "lunatic-app-brand";
const ATMOSPHERE_ID = "lunatic-atmosphere";
const VHS_ID = "lunatic-vhs-overlay";

function restoreHostBrandText() {}


function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function markPlayerMaterial(): void {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>("body *"));
  let best: HTMLElement | null = null;
  let bestScore = 0;
  for (const el of candidates) {
    const r = el.getBoundingClientRect();
    if (r.width < window.innerWidth * .65 || r.height < 48 || r.height > 110) continue;
    if (r.bottom < window.innerHeight - 20 || r.top < window.innerHeight * .72) continue;
    const style = getComputedStyle(el);
    if (style.position !== "fixed" && style.position !== "absolute") continue;
    const score = r.width + (style.backdropFilter !== "none" ? 200 : 0);
    if (score > bestScore) { best = el; bestScore = score; }
  }
  document.querySelectorAll("[data-lunatic-player-material='true']")
    .forEach((el) => el.removeAttribute("data-lunatic-player-material"));
  best?.setAttribute("data-lunatic-player-material","true");
}

function populateAtmosphere(atmosphere: HTMLElement) {
  atmosphere.replaceChildren();

  const random = mulberry32(0x18c0ffee);
  const count = 96;

  for (let i = 0; i < count; i += 1) {
    const dust = document.createElement("i");
    dust.className = "lunatic-dust-particle";

    const x = 1.2 + random() * 97.6;
    const y = 1.5 + random() * 96;
    const sizeRoll = random();
    const size = sizeRoll > .96 ? 1.75 : sizeRoll > .76 ? 1.08 : .70;
    const opacity = .08 + random() * .27;
    const drift = 72 + random() * 138;
    const twinkle = 8 + random() * 15;
    const delay = -(random() * 39);
    const dx = -20 + random() * 40;
    const dy = -24 + random() * 48;

    dust.style.setProperty("--dust-x", `${x.toFixed(2)}%`);
    dust.style.setProperty("--dust-y", `${y.toFixed(2)}%`);
    dust.style.setProperty("--dust-size", `${size.toFixed(2)}px`);
    dust.style.setProperty("--dust-o", opacity.toFixed(3));
    dust.style.setProperty("--dust-drift", `${drift.toFixed(1)}s`);
    dust.style.setProperty("--dust-twinkle", `${twinkle.toFixed(1)}s`);
    dust.style.setProperty("--dust-delay", `${delay.toFixed(1)}s`);
    dust.style.setProperty("--dust-dx", `${dx.toFixed(1)}px`);
    dust.style.setProperty("--dust-dy", `${dy.toFixed(1)}px`);

    if (random() > .91) {
      dust.classList.add("lunatic-dust-flare");
      dust.style.setProperty("--dust-flare", `${18 + random() * 18}s`);
    }

    atmosphere.appendChild(dust);
  }
}

function ensureLunaticAtmosphere() {
  document.getElementById(ATMOSPHERE_ID)?.remove();
  document.getElementById(VHS_ID)?.remove();
}

function ensureLunaticBrand() {
  document.getElementById(BRAND_ID)?.remove();
  restoreHostBrandText();
}

function appearanceCss() {
  const a = lunaUiAppearance;
  const opacity = Math.max(0, Math.min(100, Number(a.surfaceOpacity))) / 100;
  const pageImage = a.pageBackgroundImage ? `url("${a.pageBackgroundImage}")` : "none";
  const backgroundSize =
    a.backgroundZoom > 100
      ? (a.backgroundFit === "contain" ? `auto ${a.backgroundZoom}%` : `${a.backgroundZoom}% auto`)
      : a.backgroundFit;
  return `
:root {
  --luna-settings-page-background: ${a.pageBackground};
  --luna-settings-page-background-image: ${pageImage};
  --luna-settings-page-background-size: ${backgroundSize};
  --luna-settings-page-background-position: ${a.backgroundPositionX}% ${a.backgroundPositionY}%;
}
[data-luna-settings-page="true"] {
  --lunatic-luna-page: ${a.pageBackground};
  --lunatic-luna-shell: ${a.shellBackground};
  --lunatic-luna-card: ${a.cardBackground};
  --lunatic-luna-inner: ${a.innerBackground};
  --lunatic-luna-control: ${a.controlBackground};
  --lunatic-luna-edge: ${a.borderColor};
  --lunatic-luna-edge-strong: ${a.strongBorderColor};
  --lunatic-luna-text: ${a.textColor};
  --lunatic-luna-muted: ${a.mutedTextColor};
  --lunatic-luna-radius: ${Math.max(0, Number(a.borderRadius) || 0)}px;
  --lunatic-luna-opacity: ${opacity};
  background: var(--lunatic-luna-page) !important;
}
[data-luna-settings-page="true"] :is(
  [data-solo-plugin-store="true"],
  [data-solo-plugin-card="true"],
  [data-lunatic-installed-plugin="true"],
  [data-lunatic-theme-card="true"],
  [data-lunatic-core-plugin="true"],
  [data-lunatic-feature-flag="true"],
  [data-lunatic-exact-supporter-item="true"]
) {
  border-radius: var(--lunatic-luna-radius) !important;
}
[data-luna-settings-page="true"] :is(
  [data-solo-plugin-store="true"],
  [data-solo-plugin-card="true"],
  [data-lunatic-installed-plugin="true"],
  [data-lunatic-theme-card="true"],
  [data-lunatic-core-plugin="true"],
  [data-lunatic-feature-flags-shell="true"],
  [data-lunatic-client-updates-shell="true"],
  [data-lunatic-backup-settings-shell="true"],
  [data-lunatic-exact-supporter-grid="sponsors"],
  [data-lunatic-exact-supporter-grid="contributors"],
  [data-lunatic-exact-supporter-grid="stargazers"]
) {
  opacity: var(--lunatic-luna-opacity);
}
`;
}

function injectStyle() {
  ensureLunaticAtmosphere();
  ensureLunaticBrand();

  /* Visual CSS from 0.21+ is gated by this root marker.
     It was never being set, so those rules were present in the stylesheet
     but matched exactly nothing. Keep the gate explicit so Visual Theme OFF
     still restores stock styling cleanly. */

  if (true) {
    document.documentElement.dataset.lunaticVisual = "true";
  } else {
    delete document.documentElement.dataset.lunaticVisual;
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  /* One stylesheet, one deterministic cascade:
       1. the complete Solo Luna theme for all of TIDAL
       2. semantic Plugin Store overrides/runtime UI rules
     Keeping them in one node prevents the 0.7.0 bug where the second injector
     accidentally removed the first theme node. */
  const cssParts: string[] = [];

  if (true) {
    cssParts.push("/* ===== LUNATIC SETTINGS VISUAL THEME ===== */", lunaticVisualCss);
  }
  if (true) {
    cssParts.push(
      "/* ===== LUNATIC LAYOUT + UX FIXES ===== */",
      lunaticLayoutCss,
      lunaticPluginStoreUxCss,
    );
  }

  const combinedCss = cssParts.join("\n\n");

  if (style.textContent !== combinedCss) {
    style.textContent = combinedCss;
  }

  let appearanceStyle = document.getElementById(APPEARANCE_STYLE_ID) as HTMLStyleElement | null;
  if (!appearanceStyle) {
    appearanceStyle = document.createElement("style");
    appearanceStyle.id = APPEARANCE_STYLE_ID;
    document.head.appendChild(appearanceStyle);
  }
  const nextAppearanceCss = appearanceCss();
  if (appearanceStyle.textContent !== nextAppearanceCss) appearanceStyle.textContent = nextAppearanceCss;
}

function isPluginCard(button: HTMLButtonElement) {
  const content = button.firstElementChild;
  if (!(content instanceof HTMLElement) || !content.classList.contains("MuiBox-root")) return false;

  const description = button.querySelector<HTMLElement>(DESCRIPTION_SELECTOR);
  const action = button.querySelector<HTMLElement>(ORIGINAL_ACTION_SELECTOR);
  const title = content.querySelector<HTMLElement>("h6.MuiTypography-h6");

  return !!description && !!action && !!title;
}

function splitScopedLabel(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^@([^/]+)\/(.+)$/);
  if (!match) return null;

  return {
    full: trimmed,
    author: match[1],
    name: match[2],
  };
}

function normalizeScopedAnchor(anchor: HTMLAnchorElement) {
  const visible = anchor.textContent?.trim() || "";
  const source =
    anchor.dataset.soloOriginalScopedLabel ||
    (visible.startsWith("@") ? visible : "") ||
    anchor.getAttribute("aria-label") ||
    visible ||
    "";

  const parsed = splitScopedLabel(source);
  if (!parsed) return null;

  anchor.dataset.soloOriginalScopedLabel = parsed.full;
  anchor.title = parsed.full;

  if (anchor.textContent?.trim() !== parsed.name) {
    anchor.textContent = parsed.name;
  }

  return parsed;
}

/* Store/category headers and plugin titles are all LunaPluginHeader titles.
   Normalize every scoped h6 link instead of trying to infer a particular MUI
   Grid ancestry. This also survives DEV headers such as:
       @luna/template [DEV] -> template [DEV]
*/
function normalizeScopedHeadings() {
  document
    .querySelectorAll<HTMLAnchorElement>("h6.MuiTypography-h6 > a")
    .forEach((anchor) => {
      const visible = anchor.textContent?.trim() || "";
      const aria = anchor.getAttribute("aria-label") || "";
      const stored = anchor.dataset.soloOriginalScopedLabel || "";

      if (
        visible.startsWith("@") ||
        aria.startsWith("@") ||
        stored.startsWith("@")
      ) {
        normalizeScopedAnchor(anchor);
      }
    });
}

function normalizeStoreControls(
  controls: HTMLElement,
  search: HTMLInputElement,
) {
  controls.dataset.soloPluginStoreControls = "true";

  const fields = Array.from(
    controls.querySelectorAll<HTMLElement>(":scope > .MuiFormControl-root")
  );

  for (const field of fields) {
    const input = field.querySelector<HTMLInputElement>("input");
    if (!input) continue;

    if (input === search) {
      field.dataset.soloSearchField = "true";
      input.dataset.soloSearchInput = "true";

      if (input.placeholder !== "") input.placeholder = "";
      if (input.getAttribute("aria-label") !== "Search plugins") {
        input.setAttribute("aria-label", "Search plugins");
      }

      if (field.dataset.soloFieldLabel !== "Search plugins") {
        field.dataset.soloFieldLabel = "Search plugins";
      }
      continue;
    }

    /* InstallFromUrl owns a genuine dynamic MUI label. Preserve its state
       text (normal / success / error) but render it through the same visual
       label slot as Search. */
    const muiLabel = field.querySelector<HTMLElement>(":scope > .MuiInputLabel-root");
    const labelText = muiLabel?.textContent?.trim() || "Install from URL";

    if (field.dataset.soloFieldLabel !== labelText) {
      field.dataset.soloFieldLabel = labelText;
    }
  }
}

function markStoreStructure() {
  document
    .querySelectorAll<HTMLElement>(
      '.MuiGrid-root.MuiGrid-container:has([data-solo-plugin-grid-item="true"])'
    )
    .forEach((grid) => {
      grid.dataset.soloPluginStoreGrid = "true";

      const store = grid.parentElement;
      if (!(store instanceof HTMLElement)) return;

      store.dataset.soloPluginStore = "true";

      const header = Array.from(store.children).find(
        (child) =>
          child instanceof HTMLElement &&
          child !== grid &&
          child.classList.contains("MuiBox-root"),
      ) as HTMLElement | undefined;

      if (header) {
        header.dataset.soloPluginStoreHeader = "true";

        const storeTitle = header.querySelector<HTMLElement>(
          ":scope > .MuiStack-root > h6.MuiTypography-h6"
        );
        const storeDescription = header.querySelector<HTMLElement>(
          ":scope > h6.MuiTypography-subtitle2"
        );
        if (storeTitle) bindOverflowPopover(storeTitle);
        if (storeDescription) bindOverflowPopover(storeDescription);

        const headerStack = header.querySelector<HTMLElement>(
          ":scope > .MuiStack-root"
        );
        if (headerStack) {
          const children = Array.from(headerStack.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement
          );

          const last = children.at(-1);
          if (
            last &&
            !last.matches("button.MuiIconButton-root") &&
            !last.matches("h6.MuiTypography-h6")
          ) {
            last.dataset.lunaticStoreAuthor = "true";
            bindOverflowPopover(last);
          }

          children
            .filter((child) => child.matches("button.MuiIconButton-root"))
            .forEach((button) => {
              button.dataset.lunaticStoreAction = "true";
            });

          const boxes = children.filter((child) =>
            child.classList.contains("MuiBox-root")
          );
          if (boxes.length) {
            const spacer =
              last?.classList.contains("MuiBox-root") && boxes.at(-1) === last
                ? boxes.at(-2)
                : boxes.at(-1);
            if (spacer) spacer.dataset.lunaticStoreSpacer = "true";
          }
        }
      }
    });

  const search =
    document.querySelector<HTMLInputElement>(
      'input[placeholder="Search plugins..."]'
    ) ??
    document.querySelector<HTMLInputElement>(
      'input[data-solo-search-input="true"]'
    );

  if (search) {
    const controls = search.closest<HTMLElement>(".MuiStack-root");
    if (controls) normalizeStoreControls(controls, search);
  }
}

function parseScopedName(anchor: HTMLAnchorElement | null) {
  if (!anchor) return null;

  const source =
    anchor.dataset.soloOriginalPluginName ||
    anchor.dataset.soloOriginalScopedLabel ||
    anchor.getAttribute("aria-label") ||
    anchor.textContent?.trim() ||
    "";

  const parsed = splitScopedLabel(source);
  if (!parsed) return null;

  return {
    full: parsed.full,
    author: parsed.author,
    plugin: parsed.name,
  };
}

function normalizeTitle(title: HTMLElement) {
  title.dataset.soloPluginTitle = "true";

  const anchor = title.querySelector<HTMLAnchorElement>(":scope > a");
  const parsed = parseScopedName(anchor);

  if (anchor && parsed) {
    anchor.dataset.soloOriginalPluginName = parsed.full;
    normalizeScopedAnchor(anchor);
  }

  return parsed;
}

function githubUrl(author: string, repo?: string) {
  const owner = author.trim().replace(/^@/, "");
  if (!owner) return null;
  return repo
    ? `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
    : `https://github.com/${encodeURIComponent(owner)}`;
}

function markCardLinks(
  card: HTMLButtonElement,
  header: HTMLElement,
  parsed: ReturnType<typeof parseScopedName>,
) {
  const titleAnchor = header.querySelector<HTMLAnchorElement>(
    ':scope > h6.MuiTypography-h6 > a'
  );

  if (titleAnchor) {
    titleAnchor.dataset.soloPluginTitleLink = "true";

    /* LunaStorePlugin does not pass `link` to LunaPluginHeader. LunaLink then
       renders href="", and HTMLAnchorElement.href resolves that empty value to
       the current TIDAL page. Use the RAW attribute or we'd mistake TIDAL for
       a valid plugin URL and never reach the GitHub fallback. */
    const rawHref = titleAnchor.getAttribute("href")?.trim() || "";
    if (titleAnchor.dataset.soloOriginalHref === undefined) {
      titleAnchor.dataset.soloOriginalHref = rawHref;
    }

    const inferred =
      parsed && githubUrl(
        parsed.author,
        parsed.plugin.replace(/\s+\[DEV\]$/i, ""),
      );

    const target =
      /^https?:\/\//i.test(rawHref)
        ? rawHref
        : inferred;

    if (target) {
      titleAnchor.dataset.soloPluginUrl = target;
      titleAnchor.href = target;
      titleAnchor.target = "_blank";
      titleAnchor.rel = "noopener noreferrer";
      titleAnchor.style.setProperty("pointer-events", "auto", "important");
      titleAnchor.style.setProperty("cursor", "pointer", "important");

      if (titleAnchor.dataset.soloTitleClickBound !== "true") {
        titleAnchor.dataset.soloTitleClickBound = "true";
        titleAnchor.addEventListener("click", (event: MouseEvent) => {
          if (false) return;
          const url = titleAnchor.dataset.soloPluginUrl;
          if (!url) return;
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          window.open(url, "_blank", "noopener,noreferrer");
        }, { capture: true, signal });
      }
    }
  }

  const author = header.querySelector<HTMLElement>(":scope > [author]");
  if (author) {
    author.dataset.soloPluginAuthorLink = "true";

    const image = author.querySelector<HTMLImageElement>("img");
    let target: string | null = null;

    if (image?.src) {
      try {
        const u = new URL(image.src);
        if (u.hostname === "avatars.githubusercontent.com") {
          const owner = u.pathname.split("/").filter(Boolean)[0];
          if (owner) target = githubUrl(owner);
        }
      } catch {}
    }

    if (!target && parsed) target = githubUrl(parsed.author);

    const authorName =
      author.querySelector<HTMLElement>("p[name]")?.getAttribute("name") ||
      parsed?.author ||
      "";

    if (!target && authorName) target = githubUrl(authorName);

    if (target) {
      author.dataset.soloAuthorUrl = target;
      author.setAttribute("role", "link");
      author.tabIndex = 0;
      author.style.setProperty("pointer-events", "auto", "important");
      author.style.setProperty("cursor", "pointer", "important");
    }

    if (author.dataset.soloKeyboardBound !== "true") {
      author.dataset.soloKeyboardBound = "true";
      author.addEventListener("keydown", (event: KeyboardEvent) => {
        if (false) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        const url = author.dataset.soloAuthorUrl;
        if (!url) return;
        event.preventDefault();
        event.stopPropagation();
        window.open(url, "_blank", "noopener,noreferrer");
      }, { signal });
    }
  }
}

function ensureAuthor(header: HTMLElement, parsed: ReturnType<typeof parseScopedName>) {
  const existing = header.querySelector<HTMLElement>(":scope > [author]");

  if (existing) {
    existing.dataset.soloPluginAuthor = "true";
    return;
  }

  let generated = header.querySelector<HTMLElement>(":scope > .solo-plugin-generated-author");

  if (!parsed) {
    generated?.remove();
    return;
  }

  if (!generated) {
    generated = document.createElement("div");
    generated.className = "solo-plugin-generated-author";
    generated.dataset.soloPluginAuthor = "true";
    header.appendChild(generated);
  }

  const wanted = `by ${parsed.author}`;
  if (generated.textContent !== wanted) generated.textContent = wanted;
}

function elementIsTruncated(el: HTMLElement) {
  return (
    el.scrollHeight > el.clientHeight + 1 ||
    el.scrollWidth > el.clientWidth + 1
  );
}

function getPopover() {
  let el = document.getElementById(POPOVER_ID);
  if (el) return el;

  el = document.createElement("div");
  el.id = POPOVER_ID;
  el.hidden = true;
  document.body.appendChild(el);

  el.addEventListener("pointerenter", () => {
    if (hideTimer !== null) window.clearTimeout(hideTimer);
    hideTimer = null;
  }, { signal });

  el.addEventListener("pointerleave", scheduleHidePopover, { signal });
  return el;
}

function positionPopover(anchor: HTMLElement, popover: HTMLElement) {
  const container =
    anchor.closest<HTMLElement>('[data-solo-plugin-card="true"]') ??
    anchor.closest<HTMLElement>('[data-solo-plugin-store="true"]') ??
    anchor.closest<HTMLElement>('[data-lunatic-installed-plugin="true"]');

  const ar = anchor.getBoundingClientRect();
  const cr = container?.getBoundingClientRect() ?? ar;
  const pad = 12;
  const gap = 5;
  const available = Math.max(220, cr.width - 40);
  const width = Math.max(220, Math.min(available, window.innerWidth - pad * 2));
  const left = Math.max(pad, Math.min(ar.left, window.innerWidth - width - pad));

  popover.style.width = `${width}px`;
  popover.style.left = `${left}px`;
  popover.style.top = `${ar.bottom + gap}px`;

  const pr = popover.getBoundingClientRect();
  if (pr.bottom > window.innerHeight - pad) {
    popover.style.top = `${Math.max(pad, ar.top - gap - Math.min(pr.height, 250))}px`;
  }
}

function showPopover(description: HTMLElement) {
  if (!elementIsTruncated(description)) return;
  if (hideTimer !== null) window.clearTimeout(hideTimer);
  hideTimer = null;

  const text = description.textContent?.trim();
  if (!text) return;

  activeDescription = description;
  const popover = getPopover();
  popover.textContent = text;
  popover.hidden = false;
  requestAnimationFrame(() => {
    if (!popover.hidden && activeDescription === description) positionPopover(description, popover);
  });
}

function scheduleHidePopover() {
  if (hideTimer !== null) window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => {
    const popover = document.getElementById(POPOVER_ID);
    if (popover) popover.hidden = true;
    activeDescription = null;
    hideTimer = null;
  }, 120);
}

function bindOverflowPopover(element: HTMLElement) {
  if (element.dataset.lunaticOverflowBound === "true") return;
  element.dataset.lunaticOverflowBound = "true";
  element.addEventListener("pointerenter", () => showPopover(element), { signal });
  element.addEventListener("pointerleave", scheduleHidePopover, { signal });
}

function bindDescription(description: HTMLElement) {
  bindOverflowPopover(description);
}

function findGridItem(card: HTMLButtonElement) {
  const parent = card.parentElement;
  if (parent instanceof HTMLElement && parent.classList.contains("MuiGrid-root")) return parent;
  return null;
}

function hideOriginalAction(original: HTMLElement) {
  original.dataset.soloOriginalAction = "true";
  original.setAttribute("aria-hidden", "true");

  /* The user's theme contains older !important rules that deliberately make
     Luna's Typography action visible. A stylesheet rule in this plugin can
     therefore lose depending on cascade-layer order. Inline !important wins
     deterministically, so keep the original node only as Luna state source. */
  original.style.setProperty("display", "none", "important");
  original.style.setProperty("opacity", "0", "important");
  original.style.setProperty("visibility", "hidden", "important");
  original.style.setProperty("pointer-events", "none", "important");
  original.style.setProperty("position", "absolute", "important");
  original.style.setProperty("width", "0", "important");
  original.style.setProperty("height", "0", "important");
  original.style.setProperty("margin", "0", "important");
  original.style.setProperty("padding", "0", "important");
  original.style.setProperty("overflow", "hidden", "important");
}

function restoreOriginalAction(original: HTMLElement) {
  delete original.dataset.soloOriginalAction;
  original.removeAttribute("aria-hidden");
  [
    "display", "opacity", "visibility", "pointer-events", "position",
    "width", "height", "margin", "padding", "overflow",
  ].forEach((property) => original.style.removeProperty(property));
}

function clearPluginCardUx(card: HTMLButtonElement) {
  card.tabIndex = 0;

  const grid = findGridItem(card);
  grid?.querySelector<HTMLButtonElement>(`:scope > button.${ACTION_CLASS}`)?.remove();

  const original = card.querySelector<HTMLElement>(ORIGINAL_ACTION_SELECTOR);
  if (original) restoreOriginalAction(original);

  const titleAnchor = card.querySelector<HTMLAnchorElement>('[data-solo-plugin-title-link="true"]');
  if (titleAnchor) {
    const originalHref = titleAnchor.dataset.soloOriginalHref;
    if (originalHref !== undefined) titleAnchor.setAttribute("href", originalHref);
    titleAnchor.style.removeProperty("pointer-events");
    titleAnchor.style.removeProperty("cursor");
    delete titleAnchor.dataset.soloPluginTitleLink;
    delete titleAnchor.dataset.soloPluginUrl;
  }

  const author = card.querySelector<HTMLElement>('[data-solo-plugin-author-link="true"]');
  if (author) {
    author.removeAttribute("role");
    author.removeAttribute("tabindex");
    author.style.removeProperty("pointer-events");
    author.style.removeProperty("cursor");
    delete author.dataset.soloPluginAuthorLink;
    delete author.dataset.soloAuthorUrl;
  }
}

function actionKindFromLabel(label: string) {
  return label.toLowerCase().includes("uninstall") ? "uninstall" : "install";
}

function setRealActionState(
  real: HTMLButtonElement,
  kind: "install" | "uninstall",
  label = kind === "install" ? "Install" : "Uninstall",
) {
  if (real.dataset.soloActionKind !== kind) {
    real.dataset.soloActionKind = kind;
  }

  /* IMPORTANT:
     MutationObserver watches childList. Assigning textContent even when the
     string is unchanged replaces the text node and schedules another scan.
     That produced an infinite scan -> textContent -> scan loop in 0.6.0. */
  if (real.textContent !== label) {
    real.textContent = label;
  }

  if (real.getAttribute("aria-label") !== label) {
    real.setAttribute("aria-label", label);
  }

  if (real.title !== label) {
    real.title = label;
  }
}

function setOptimisticAction(real: HTMLButtonElement) {
  const current =
    real.dataset.soloActionKind === "uninstall" ? "uninstall" : "install";
  const next = current === "install" ? "uninstall" : "install";

  real.dataset.soloOptimisticKind = next;
  real.dataset.soloOptimisticUntil = String(Date.now() + 4500);
  setRealActionState(real, next);
}

function forceLunaCardRender(card: HTMLButtonElement) {
  /* LunaStorePlugin does not subscribe React state to plugin.installed.
     Its label often changes only when isHovered changes. Force that harmless
     state transition so Luna refreshes its own Typography while the pointer
     is still sitting on our action button. */
  card.dispatchEvent(new MouseEvent("mouseout", {
    bubbles: true,
    relatedTarget: document.body,
  }));
  card.dispatchEvent(new MouseEvent("mouseover", {
    bubbles: true,
    relatedTarget: document.body,
  }));
}

function syncActionLabel(card: HTMLButtonElement, real: HTMLButtonElement) {
  const original = card.querySelector<HTMLElement>(ORIGINAL_ACTION_SELECTOR);
  if (!original) return;

  const label = original.textContent?.trim() || "Install";
  const sourceKind = actionKindFromLabel(label);
  hideOriginalAction(original);

  const optimisticKind = real.dataset.soloOptimisticKind as
    | "install"
    | "uninstall"
    | undefined;
  const optimisticUntil = Number(real.dataset.soloOptimisticUntil || 0);

  if (optimisticKind) {
    if (sourceKind === optimisticKind) {
      delete real.dataset.soloOptimisticKind;
      delete real.dataset.soloOptimisticUntil;
      setRealActionState(real, sourceKind, label);
      return;
    }

    if (Date.now() < optimisticUntil) {
      setRealActionState(real, optimisticKind);
      return;
    }

    delete real.dataset.soloOptimisticKind;
    delete real.dataset.soloOptimisticUntil;
  }

  setRealActionState(real, sourceKind, label);
}

function ensureRealAction(card: HTMLButtonElement) {
  const grid = findGridItem(card);
  if (!grid) return;

  grid.dataset.soloPluginGridItem = "true";

  let real = grid.querySelector<HTMLButtonElement>(`:scope > button.${ACTION_CLASS}`);
  if (!real) {
    real = document.createElement("button");
    real.type = "button";
    real.className = ACTION_CLASS;
    grid.appendChild(real);

    real.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (real!.dataset.soloBusy === "true") return;

      /* Update our real action immediately. Luna's own Typography often does
         not rerender until its hover state changes. */
      setOptimisticAction(real!);

      /* Allow exactly this synthetic activation through our capture blocker. */
      forwardedCards.add(card);
      real!.dataset.soloBusy = "true";

      try {
        card.click();
      } finally {
        forwardedCards.delete(card);
      }

      /* Nudge Luna's own React component to reread plugin.installed while the
         pointer remains over the action. Retry because install() can be async. */
      [120, 350, 800, 1600, 3000].forEach((delay) => {
        window.setTimeout(() => {
          forceLunaCardRender(card);
          syncActionLabel(card, real!);
          queueScan();
        }, delay);
      });

      window.setTimeout(() => {
        real!.dataset.soloBusy = "false";
        syncActionLabel(card, real!);
        queueScan();
      }, 450);
    }, { signal });
  }

  syncActionLabel(card, real);
}

function processCard(card: HTMLButtonElement) {
  if (!isPluginCard(card)) return;

  card.dataset.soloPluginCard = "true";

  const content = card.firstElementChild as HTMLElement;
  const header = content.querySelector<HTMLElement>(":scope > .MuiStack-root");
  const description = card.querySelector<HTMLElement>(DESCRIPTION_SELECTOR);
  const originalAction = card.querySelector<HTMLElement>(ORIGINAL_ACTION_SELECTOR);
  if (!header || !description || !originalAction) return;

  header.dataset.soloPluginHeader = "true";
  const title = header.querySelector<HTMLElement>(":scope > h6.MuiTypography-h6");
  const parsed = title ? normalizeTitle(title) : null;
  ensureAuthor(header, parsed);

  description.dataset.soloPluginDescription = "true";
  bindDescription(description);

  if (false) {
    clearPluginCardUx(card);
    return;
  }

  card.tabIndex = -1;
  markCardLinks(card, header, parsed);
  hideOriginalAction(originalAction);
  ensureRealAction(card);
}


function clearInstalledPluginMarkers(row: HTMLElement, headerBox: HTMLElement, headerStack: HTMLElement, title: HTMLElement) {
  delete row.dataset.lunaticInstalledPlugin;
  delete headerBox.dataset.lunaticInstalledPluginHeader;
  delete headerStack.dataset.lunaticInstalledPluginHeaderStack;
  delete title.dataset.lunaticInstalledPluginTitle;

  headerStack.querySelectorAll<HTMLElement>(
    '[data-lunatic-installed-plugin-author="true"], [data-lunatic-installed-plugin-spacer="true"]'
  ).forEach((el) => {
    delete el.dataset.lunaticInstalledPluginAuthor;
    delete el.dataset.lunaticInstalledPluginSpacer;
  });
}

function markLunaticSettingsRows() {
  document.querySelectorAll<HTMLElement>(".MuiStack-root").forEach((row) => {
    const headerBox = row.querySelector<HTMLElement>(
      ":scope > .MuiBox-root:first-child"
    );
    if (!headerBox) return;

    const headerStack = headerBox.querySelector<HTMLElement>(
      ":scope > .MuiStack-root"
    );
    if (!headerStack) return;

    const title = headerStack.querySelector<HTMLElement>(
      ":scope > h6.MuiTypography-h6"
    );
    if (!title) return;

    const iconButtons = Array.from(
      headerStack.querySelectorAll<HTMLButtonElement>(
        ":scope > button.MuiIconButton-root"
      )
    );
    const enableSwitch = headerStack.querySelector<HTMLElement>(
      ":scope > .MuiSwitch-root"
    );
    const uninstallButton = headerStack.querySelector<HTMLButtonElement>(
      ':scope > button.MuiIconButton-root[aria-label="Uninstall plugin"]'
    );

    if (enableSwitch || iconButtons.length >= 2) {
      row.dataset.lunaticSettingsCard = "true";
    }

    /* Luna core plugins have Reload + Live Reload + Settings, but no enable
       switch and no uninstall action. Keep them out of the normal Plugins-tab
       layout and give them their own stable card/grid styling. */
    const isCorePlugin = iconButtons.length >= 3 && !enableSwitch && !uninstallButton;
    if (isCorePlugin) {
      clearInstalledPluginMarkers(row, headerBox, headerStack, title);
      row.dataset.lunaticCorePlugin = "true";
      headerBox.dataset.lunaticCorePluginHeader = "true";
      headerStack.dataset.lunaticCorePluginHeaderStack = "true";
      title.dataset.lunaticCorePluginTitle = "true";


      /* Clear stale/broad markers from previous scans first. */
      Array.from(row.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        delete child.dataset.lunaticCorePluginContent;
      });

      /* Only real LunaSettings section Boxes are core-plugin content.
         Do NOT mark the plugin description, <br> spacers, etc. */
      Array.from(row.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        if (child === headerBox) return;
        if (!child.classList.contains("MuiBox-root")) return;

        const settingsTitle = child.querySelector<HTMLElement>(
          ':scope > span.MuiTypography-h7, :scope > .MuiTypography-h7'
        );
        const settingsStack = child.querySelector<HTMLElement>(
          ':scope > .MuiStack-root[display="flex"]'
        );

        if (!settingsTitle && !settingsStack) return;

        child.dataset.lunaticCorePluginContent = "true";

        /* Runtime layout lock: old theme / Emotion rules must not collapse
           the gutter around the nested settings section. */
        child.style.setProperty("box-sizing", "border-box", "important");
        child.style.setProperty("width", "100%", "important");
        child.style.setProperty("min-width", "0", "important");
        child.style.setProperty("max-width", "none", "important");
        child.style.setProperty("margin", "14px 0 0", "important");
        child.style.setProperty("padding", "18px 20px 16px", "important");
        child.style.setProperty("overflow", "visible", "important");
      });

      const parent = row.parentElement;
      if (parent instanceof HTMLElement) {
        parent.dataset.lunaticCorePluginsGrid = "true";

        const shell = parent.parentElement;
        if (shell instanceof HTMLElement) {
          shell.dataset.lunaticCorePluginsShell = "true";
        }
      }

      const children = Array.from(headerStack.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement
      );
      const last = children.at(-1);
      if (
        last &&
        last !== title &&
        !last.matches("button.MuiIconButton-root")
      ) {
        last.dataset.lunaticCorePluginAuthor = "true";
      }
      const boxes = children.filter((child) => child.classList.contains("MuiBox-root"));
      if (boxes.length) {
        const spacer =
          last?.classList.contains("MuiBox-root") && boxes.at(-1) === last
            ? boxes.at(-2)
            : boxes.at(-1);
        if (spacer) spacer.dataset.lunaticCorePluginSpacer = "true";
      }
      return;
    }

    /* Normal installed plugins have the enable switch and uninstall action. */
    const isInstalledPlugin = !!enableSwitch && !!uninstallButton;
    if (!isInstalledPlugin) return;

    delete row.dataset.lunaticCorePlugin;
    delete headerBox.dataset.lunaticCorePluginHeader;
    delete headerStack.dataset.lunaticCorePluginHeaderStack;
    delete title.dataset.lunaticCorePluginTitle;

    row.dataset.lunaticInstalledPlugin = "true";
    headerBox.dataset.lunaticInstalledPluginHeader = "true";
    headerStack.dataset.lunaticInstalledPluginHeaderStack = "true";
    title.dataset.lunaticInstalledPluginTitle = "true";

    /* Mark expanded plugin settings semantically. Do not depend on Emotion
       hashes such as css-12qsudj / css-1xhj18k. */
    Array.from(row.children).forEach((child) => {
      if (!(child instanceof HTMLElement) || child === headerBox) return;

      delete child.dataset.lunaticInstalledPluginSettingsShell;

      const settingsStack = child.querySelector<HTMLElement>(
        ':scope > .MuiStack-root[display="flex"][variant="h7"]'
      );
      if (!settingsStack) return;

      child.dataset.lunaticInstalledPluginSettingsShell = "true";
      settingsStack.dataset.lunaticInstalledPluginSettings = "true";

      Array.from(settingsStack.children).forEach((setting) => {
        if (!(setting instanceof HTMLElement)) return;
        if (!setting.classList.contains("MuiStack-root")) return;
        if (setting.getAttribute("alignitems") !== "center") return;

        setting.dataset.lunaticInstalledPluginSetting = "true";

        const copy = setting.querySelector<HTMLElement>(
          ":scope > .MuiBox-root:first-child"
        );
        const control = setting.querySelector<HTMLElement>(
          ':scope > .MuiBox-root[display="flex"]'
        );

        if (copy) copy.dataset.lunaticInstalledPluginSettingCopy = "true";
        if (control) {
          control.dataset.lunaticInstalledPluginSettingControl = "true";

          if (control.querySelector(":scope > .MuiSwitch-root")) {
            setting.dataset.lunaticInstalledPluginSettingKind = "switch";
          } else if (control.querySelector(":scope .MuiButton-root")) {
            setting.dataset.lunaticInstalledPluginSettingKind = "button";
          } else if (control.querySelector(":scope .MuiTextField-root")) {
            setting.dataset.lunaticInstalledPluginSettingKind = "field";
          }
        }
      });
    });

    const titleAnchor = title.querySelector<HTMLAnchorElement>(":scope > a");
    if (titleAnchor) {
      titleAnchor.dataset.lunaticInstalledPluginName = "true";
      bindOverflowPopover(titleAnchor);
    }

    const pluginDescription = headerBox.querySelector<HTMLElement>(
      ":scope > h6.MuiTypography-subtitle2"
    );
    if (pluginDescription) bindOverflowPopover(pluginDescription);

    const children = Array.from(headerStack.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );

    const last = children.at(-1);
    if (
      last &&
      last !== title &&
      !last.matches("button.MuiIconButton-root") &&
      !last.classList.contains("MuiSwitch-root")
    ) {
      last.dataset.lunaticInstalledPluginAuthor = "true";
      bindOverflowPopover(last);
    }

    const boxes = children.filter((child) => child.classList.contains("MuiBox-root"));
    if (boxes.length) {
      const spacer =
        last?.classList.contains("MuiBox-root") && boxes.at(-1) === last
          ? boxes.at(-2)
          : boxes.at(-1);
      if (spacer) spacer.dataset.lunaticInstalledPluginSpacer = "true";
    }
  });
}

function markFeatureFlags() {
  document.querySelectorAll<HTMLElement>(".MuiGrid-root.MuiGrid-container").forEach((grid) => {
    const items = Array.from(grid.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child.classList.contains("MuiGrid-root")
    );
    if (items.length < 4) return;

    const switchItems = items.filter((item) => item.querySelector(":scope .MuiSwitch-root"));
    if (switchItems.length !== items.length) return;

    grid.dataset.lunaticFeatureFlagsGrid = "true";

    const shell = grid.parentElement;
    if (shell instanceof HTMLElement) {
      shell.dataset.lunaticFeatureFlagsShell = "true";
      const shellParent = shell.parentElement;
      if (shellParent instanceof HTMLElement) {
        shellParent.dataset.lunaticFeatureFlagsOuter = "true";
      }
    }

    items.forEach((item) => {
      item.dataset.lunaticFeatureFlag = "true";
      const setting = item.querySelector<HTMLElement>(":scope > .MuiStack-root");
      if (setting) setting.dataset.lunaticFeatureFlagSetting = "true";
    });
  });
}


function markLunaticThemesPage() {
  /* The Themes TextField has no placeholder/aria-label in current Luna.
     Identify it by its real MUI InputLabel text. */
  document.querySelectorAll<HTMLElement>(".MuiFormControl-root").forEach((field) => {
    const label = field.querySelector<HTMLElement>(":scope > .MuiInputLabel-root");
    if (label?.textContent?.trim().toLowerCase() !== "install from url") return;

    field.dataset.lunaticThemesInstallField = "true";

    const row = field.parentElement;
    if (row instanceof HTMLElement) row.dataset.lunaticThemesInstallRow = "true";
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (!/\.css(?:$|\?)/i.test(href) && !/raw\.githubusercontent\.com/i.test(href)) return;

    /* In Themes the anchor lives in LunaPluginHeader's direct Stack. */
    const headerStack = anchor.closest<HTMLElement>(".MuiStack-root");
    if (!headerStack) return;

    const headerBox = headerStack.parentElement;
    const outerRow = headerBox?.parentElement;
    const title = anchor.closest<HTMLElement>("h6.MuiTypography-h6");

    if (
      headerBox instanceof HTMLElement &&
      outerRow instanceof HTMLElement &&
      title instanceof HTMLElement
    ) {
      /* Critical: Themes were previously misclassified as installed Plugins
         because they have Switch + "Uninstall plugin". Remove those markers
         before applying Theme-specific layout. */
      clearInstalledPluginMarkers(outerRow, headerBox, headerStack, title);
      delete outerRow.dataset.lunaticInstalledPlugin;
      delete outerRow.dataset.lunaticSettingsCard;
      delete headerBox.dataset.lunaticInstalledPluginHeader;
      delete headerStack.dataset.lunaticInstalledPluginHeaderStack;
      delete title.dataset.lunaticInstalledPluginTitle;

      outerRow.dataset.lunaticThemeCard = "true";
      headerBox.dataset.lunaticThemeHeader = "true";
    }

    headerStack.dataset.lunaticThemeRow = "true";
    anchor.dataset.lunaticThemeUrl = "true";

    const sw = headerStack.querySelector<HTMLElement>(":scope > .MuiSwitch-root");
    if (sw) sw.dataset.lunaticThemeSwitch = "true";

    headerStack.querySelectorAll<HTMLButtonElement>(
      ":scope > button.MuiIconButton-root"
    ).forEach((button) => {
      const label = (button.getAttribute("aria-label") || "").toLowerCase();

      delete button.dataset.lunaticThemeAction;
      delete button.dataset.lunaticThemeReload;
      delete button.dataset.lunaticThemeDelete;

      if (label.includes("reload")) {
        button.dataset.lunaticThemeReload = "true";
      } else if (
        label.includes("remove") ||
        label.includes("delete") ||
        label.includes("uninstall")
      ) {
        button.dataset.lunaticThemeDelete = "true";
      } else {
        button.dataset.lunaticThemeAction = "true";
      }
    });

    /* Empty flex-grow Box in a theme row. */
    headerStack.querySelectorAll<HTMLElement>(":scope > .MuiBox-root").forEach((box) => {
      box.dataset.lunaticThemeSpacer = "true";
    });
  });
}


function markExactSupporterSections() {
  /* Exact current Luna DOM:
       section Box
         title Box
         spacer
         Stack[display="flex"]
           Grid.MuiGrid-container

     All three sections now receive the SAME exact markers. */
  document
    .querySelectorAll<HTMLElement>('.MuiStack-root[display="flex"]')
    .forEach((contentStack) => {
      const grid = contentStack.querySelector<HTMLElement>(
        ':scope > .MuiGrid-root.MuiGrid-container'
      );
      if (!grid) return;

      const section = contentStack.parentElement;
      if (!(section instanceof HTMLElement)) return;

      const title =
        section.querySelector<HTMLElement>(
          ':scope > .MuiBox-root:first-child .MuiTypography-h7'
        ) ??
        section.querySelector<HTMLElement>(
          ':scope > .MuiBox-root:first-child .MuiTypography-root'
        );

      const label = title?.textContent?.trim().toLowerCase() || "";

      const kind =
        label.startsWith("sponsors")
          ? "sponsors"
          : label.startsWith("contributors")
            ? "contributors"
            : label.startsWith("stargazers")
              ? "stargazers"
              : null;

      if (!kind) return;

      section.dataset.lunaticExactSupporterSection = kind;
      contentStack.dataset.lunaticExactSupporterStack = kind;
      grid.dataset.lunaticExactSupporterGrid = kind;

      Array.from(grid.children).forEach((item) => {
        if (!(item instanceof HTMLElement)) return;
        item.dataset.lunaticExactSupporterItem = "true";
      });
    });
}


function applyLunaticInputSurface() {
  const roots = new Set<HTMLElement>();

  document
    .querySelectorAll<HTMLElement>(
      [
        '[data-solo-plugin-store-controls="true"] .MuiOutlinedInput-root',
        '[data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root',
        '[data-lunatic-core-plugin-content="true"] .MuiOutlinedInput-root',
        '[data-lunatic-settings-card="true"] .MuiOutlinedInput-root'
      ].join(",")
    )
    .forEach((root) => roots.add(root));

  roots.forEach((root) => {
    /* Marker only. Visual Theme owns fill/border/shadow; Layout owns geometry. */
    root.dataset.lunaticUnifiedInput = "true";
  });
}


function markLunaticSettingsSections() {
  /* Client Updates shell: exact current Luna structure. */
  document
    .querySelectorAll<HTMLElement>('.MuiStack-root[display="flex"][variant="h7"]')
    .forEach((stack) => {
      const tidalIcon = stack.querySelector<HTMLImageElement>(
        ':scope > div:first-child img[alt="TIDAL Icon"]'
      );
      const hasClientUpdates = Array.from(
        stack.querySelectorAll<HTMLElement>(".MuiBox-root")
      ).some((box) => box.textContent?.trim().startsWith("Client Updates"));

      if (tidalIcon && hasClientUpdates) {
        stack.dataset.lunaticClientUpdatesShell = "true";
      }

      const desc = stack.getAttribute("desc") || "";
      if (
        desc.startsWith(
          "Exports installed plugins, plugin settings, themes, store URLs and feature flag overrides."
        )
      ) {
        stack.dataset.lunaticBackupSettingsShell = "true";
      }
    });

  /* Only actual marked Core settings sections participate here. */
  document
    .querySelectorAll<HTMLElement>('[data-lunatic-core-plugin-content="true"]')
    .forEach((content) => {
      const titleBox = Array.from(content.children).find(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.classList.contains("MuiBox-root") &&
          !!child.querySelector(
            ':scope > span.MuiTypography-h7, :scope > .MuiTypography-h7'
          )
      );

      if (!titleBox) return;

      titleBox.dataset.lunaticCoreSettingsTitle = "true";

      /* Hard runtime inset. This is deliberately inline !important because
         several historical theme rules target these generic MuiBox nodes. */
      titleBox.style.setProperty("box-sizing", "border-box", "important");
      titleBox.style.setProperty("display", "block", "important");
      titleBox.style.setProperty("width", "100%", "important");
      titleBox.style.setProperty("min-width", "0", "important");
      titleBox.style.setProperty("margin", "0 0 8px", "important");
      titleBox.style.setProperty("padding", "8px 12px 12px", "important");
      titleBox.style.setProperty("background", "transparent", "important");
      titleBox.style.setProperty("border", "0", "important");
      titleBox.style.setProperty("box-shadow", "none", "important");

      const heading = titleBox.querySelector<HTMLElement>(
        ':scope > span.MuiTypography-h7, :scope > .MuiTypography-h7'
      );
      if (heading) {
        heading.style.setProperty("display", "block", "important");
        heading.style.setProperty("margin", "0 0 5px", "important");
        heading.style.setProperty("padding", "0", "important");
      }

      const desc = titleBox.querySelector<HTMLElement>(
        ':scope > .MuiTypography-subtitle2'
      );
      if (desc) {
        desc.style.setProperty("margin", "0", "important");
        desc.style.setProperty("padding", "0", "important");
      }
    });
}

function markLunaticClientUpdateControls() {
  document
    .querySelectorAll<HTMLElement>('[data-lunatic-client-updates-shell="true"]')
    .forEach((shell) => {
      const controlRow = shell.querySelector<HTMLElement>(
        '.MuiStack-root[display="flex"][alignitems="center"][variant="h7"]'
      );
      if (!controlRow) return;

      controlRow.dataset.lunaticClientUpdateControls = "true";

      const selectRoot = controlRow.querySelector<HTMLElement>(
        ':scope > .MuiOutlinedInput-root.MuiSelect-root'
      );
      if (selectRoot) {
        selectRoot.dataset.lunaticClientVersionSelect = "true";
      }
    });
}




function scan() {
  scanQueued = false;
  ensureLunaticAtmosphere();
  ensureLunaticBrand();

  /* Most of this scan deliberately mutates data-* markers and inline styles.
     Do not let our own mutations recursively schedule more full-document
     scans while Luna is mounting/unmounting Settings tabs. */
  observer?.disconnect();

  try {
    document.querySelectorAll<HTMLButtonElement>("button.MuiButtonBase-root").forEach(processCard);
    markStoreStructure();
    normalizeScopedHeadings();
    markLunaticSettingsRows();
    markLunaticThemesPage();
    markExactSupporterSections();
    markFeatureFlags();
    applyLunaticInputSurface();
    markLunaticSettingsSections();
    markLunaticClientUpdateControls();

    document
      .querySelectorAll<HTMLElement>('[data-lunatic-installed-plugin-title="true"]')
      .forEach((title) => {
        title.removeAttribute("title");
      });
  } finally {
    observer?.observe(document.documentElement, { subtree: true, childList: true });
  }
}

function queueScan() {
  if (scanQueued) return;
  scanQueued = true;
  scanFrame = window.requestAnimationFrame(() => {
    scanFrame = null;
    scan();
  });
}

/* Users can never activate Luna's full-card handler directly.
   Only ensureRealAction() can forward one synthetic click. */
function blockDirectCardClick(event: MouseEvent) {
  if (false) return;
  const path = event.composedPath();
  const card = path.find((node): node is HTMLButtonElement =>
    node instanceof HTMLButtonElement && node.dataset.soloPluginCard === "true"
  );
  if (!card) return;

  if (forwardedCards.has(card)) {
    forwardedCards.delete(card);
    return;
  }

  const titleLink = path.find((node): node is HTMLAnchorElement =>
    node instanceof HTMLAnchorElement &&
    node.dataset.soloPluginTitleLink === "true"
  );

  if (titleLink) {
    const url = titleLink.dataset.soloPluginUrl || titleLink.href;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const authorLink = path.find((node): node is HTMLElement =>
    node instanceof HTMLElement &&
    node.dataset.soloPluginAuthorLink === "true"
  );

  if (authorLink) {
    const url = authorLink.dataset.soloAuthorUrl;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function blockDirectCardPress(event: Event) {
  if (false) return;
  const path = event.composedPath();
  const card = path.find((node): node is HTMLButtonElement =>
    node instanceof HTMLButtonElement && node.dataset.soloPluginCard === "true"
  );
  if (!card) return;

  /* Title/author have their own routed click behavior. Do not interfere with
     pointer press/focus feedback on those controls. */
  const interactive = path.some((node) =>
    node instanceof HTMLElement &&
    (
      node.dataset.soloPluginTitleLink === "true" ||
      node.dataset.soloPluginAuthorLink === "true"
    )
  );
  if (interactive) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function onViewportChange() {
  if (!activeDescription) return;
  const popover = document.getElementById(POPOVER_ID);
  if (!popover || popover.hidden) return;
  positionPopover(activeDescription, popover);
}

injectStyle();
getPopover();

document.addEventListener("click", blockDirectCardClick, { capture: true, signal });
document.addEventListener("pointerdown", blockDirectCardPress, { capture: true, signal });
document.addEventListener("mousedown", blockDirectCardPress, { capture: true, signal });

window.addEventListener("resize", onViewportChange, { signal });
window.addEventListener("scroll", onViewportChange, { capture: true, passive: true, signal });

observer = new MutationObserver(queueScan);
observer.observe(document.documentElement, { subtree: true, childList: true });
scan();


const unloadAppearanceListener = onLunaUiAppearanceChange(() => {
  const appearanceStyle = document.getElementById(APPEARANCE_STYLE_ID) as HTMLStyleElement | null;
  if (appearanceStyle) {
    const nextAppearanceCss = appearanceCss();
    if (appearanceStyle.textContent !== nextAppearanceCss) appearanceStyle.textContent = nextAppearanceCss;
  }
});
unloads.add(unloadAppearanceListener);

window.addEventListener("resize", () => queueScan(), { passive: true, signal });

unloads.add(() => {
  observer?.disconnect();
  observer = null;

  if (scanFrame !== null) {
    window.cancelAnimationFrame(scanFrame);
    scanFrame = null;
  }


  abort.abort();

  if (hideTimer !== null) window.clearTimeout(hideTimer);
  delete document.documentElement.dataset.lunaticVisual;
  document.getElementById(STYLE_ID)?.remove();
  document.getElementById(APPEARANCE_STYLE_ID)?.remove();
  document.getElementById(POPOVER_ID)?.remove();
    document.getElementById(BRAND_ID)?.remove();
    document.getElementById(ATMOSPHERE_ID)?.remove();
    document.getElementById(VHS_ID)?.remove();
    restoreHostBrandText();

  document.querySelectorAll<HTMLButtonElement>('[data-solo-plugin-card="true"]').forEach((card) => {
    clearPluginCardUx(card);
  });
  document.querySelectorAll(`.${ACTION_CLASS}`).forEach((el) => el.remove());

  document.querySelectorAll<HTMLElement>('[data-solo-plugin-grid-item="true"]').forEach((el) =>
    el.removeAttribute("data-solo-plugin-grid-item")
  );

  document.querySelectorAll<HTMLButtonElement>('[data-solo-plugin-card="true"]').forEach((card) => {
    card.removeAttribute("data-solo-plugin-card");
    card.tabIndex = 0;
  });


  trace.msg.log("Lunatic 0.28.0 unloaded");
});

trace.msg.log("Lunatic 0.28.0 Legacy Chrome Restore loaded");
