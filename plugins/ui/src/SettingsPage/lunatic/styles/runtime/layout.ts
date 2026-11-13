export const lunaticLayoutCss = String.raw`

@layer lunatic-stable-tint, solo-plugin-store-fix;

@layer solo-plugin-store-fix {
  [data-solo-plugin-card="true"] {display: flex !important;flex-direction: column !important;align-items: stretch !important;justify-content: flex-start !important;width: 100% !important;height: 100% !important;min-width: 0 !important;padding: 14px 20px 18px !important;opacity: 1 !important;visibility: visible !important;transform: none !important;translate: none !important;scale: 1 !important;overflow: visible !important;cursor: default !important;}

  [data-solo-plugin-card="true"]:is(:hover,:focus,:focus-visible,:active) {display: flex !important;flex-direction: column !important;align-items: stretch !important;justify-content: flex-start !important;padding: 14px 20px 18px !important;opacity: 1 !important;visibility: visible !important;transform: none !important;translate: none !important;scale: 1 !important;}

  /* Plugin Store layout now lives here rather than in the standalone theme. */
  [data-solo-plugin-store="true"] {box-sizing: border-box !important;padding: 22px 28px 26px !important;}

  [data-solo-plugin-store-header="true"] {display: block !important;width: 100% !important;min-width: 0 !important;margin: 0 0 10px !important;padding: 0 !important;overflow: visible !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root {width: 100% !important;min-width: 0 !important;}

  /* LunaPluginHeader renders store action buttons immediately after the
     title and only then inserts its flex-grow spacer. Reorder those children
     so reload/remove live on the far right instead of hugging the title. */
  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > h6.MuiTypography-h6 {order: 0 !important;min-width: 0 !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > .MuiBox-root {order: 1 !important;flex-grow: 1 !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > [author] {order: 2 !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root {order: 3 !important;flex: 0 0 auto !important;}



  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root.Mui-disabled,
  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root:disabled {opacity: 1 !important;}



  [data-solo-plugin-store-grid="true"] {width: 100% !important;margin: 0 !important;box-sizing: border-box !important;align-items: stretch !important;}

  [data-solo-plugin-store-controls="true"] {display: grid !important;grid-template-columns: repeat(2, minmax(0,1fr)) !important;gap: 16px !important;width: 100% !important;min-width: 0 !important;margin: 0 0 16px !important;}

  /* Search and Install-from-URL deliberately use one synthetic visual-label
     model. MUI's generated InputLabel classes are hidden and used only as a
     text source for the dynamic install status. */
  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root {display: grid !important;grid-template-columns: minmax(0,1fr) !important;grid-template-rows: 16px 40px !important;row-gap: 5px !important;align-content: start !important;width: 100% !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;}

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root::before {content: attr(data-solo-field-label) !important;grid-column: 1 !important;grid-row: 1 !important;display: block !important;align-self: start !important;width: max-content !important;max-width: 100% !important;height: 16px !important;margin: 0 !important;padding: 0 !important;line-height: 16px !important;-webkit-text-fill-color: rgba(255,255,255,.62) !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;pointer-events: none !important;}

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    > .MuiInputLabel-root {display: none !important;}

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    > .MuiOutlinedInput-root {grid-column: 1 !important;grid-row: 2 !important;width: 100% !important;height: 40px !important;min-height: 40px !important;margin: 0 !important;padding-top: 0 !important;padding-bottom: 0 !important;}

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    .MuiOutlinedInput-notchedOutline > legend {max-width: 0 !important;}

  [data-solo-plugin-store-controls="true"] .MuiInputBase-input {box-sizing: border-box !important;}

  @media (max-width: 800px) {
    [data-solo-plugin-store-controls="true"] {grid-template-columns: minmax(0,1fr) !important;}
  }

  /* Grid item becomes the containing block for our genuine sibling button. */
  [data-solo-plugin-grid-item="true"] {display: flex !important;position: relative !important;align-items: stretch !important;min-width: 0 !important;}

  .MuiGrid-root.MuiGrid-container:has(> [data-solo-plugin-grid-item="true"]) {align-items: stretch !important;}

  [data-solo-plugin-grid-item="true"] > [data-solo-plugin-card="true"] {align-self: stretch !important;width: 100% !important;height: 100% !important;padding-bottom: 56px !important;}

  /* Luna's original decorative Install/Uninstall label is NOT an action.
     The source component explicitly gives it pointer-events:none. Keep it only
     in DOM as a state/label source and hide it visually. */
















  [data-solo-plugin-card="true"] > .MuiBox-root:first-child,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child {display: block !important;position: relative !important;width: 100% !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;opacity: 1 !important;visibility: visible !important;transform: none !important;translate: none !important;}

  [data-solo-plugin-card="true"] > .MuiBox-root:first-child > *,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child > * {opacity: 1 !important;visibility: visible !important;transform: none !important;translate: none !important;}

  [data-solo-plugin-header="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) !important;grid-template-rows: 28px 16px !important;row-gap: 3px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;height: 47px !important;min-height: 47px !important;max-height: 47px !important;margin: 0 !important;padding: 0 !important;overflow: visible !important;}

  [data-solo-plugin-title="true"] {grid-row: 1 !important;display: block !important;width: 100% !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;white-space: nowrap !important;text-overflow: ellipsis !important;}

  [data-solo-plugin-title="true"] > a {display: inline !important;position: static !important;}

  [data-solo-plugin-title="true"] > a ~ * {display: inline !important;position: static !important;width: auto !important;height: auto !important;margin: 0 0 0 6px !important;padding: 0 !important;vertical-align: baseline !important;line-height: inherit !important;opacity: .62 !important;transform: none !important;translate: none !important;}

  [data-solo-plugin-author="true"] {grid-row: 2 !important;display: block !important;position: static !important;width: 100% !important;min-width: 0 !important;height: 16px !important;min-height: 16px !important;max-height: 16px !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;white-space: nowrap !important;text-overflow: ellipsis !important;line-height: 16px !important;transform: none !important;translate: none !important;}

  [data-solo-plugin-author="true"] > p[name] {display: block !important;position: static !important;width: 100% !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;white-space: nowrap !important;text-overflow: ellipsis !important;line-height: 16px !important;}

  [data-solo-plugin-author="true"] .MuiAvatar-root {display: none !important;visibility: hidden !important;opacity: 0 !important;pointer-events: none !important;}

  .solo-plugin-generated-author {opacity: .86 !important;}

  [data-solo-plugin-description="true"] {display: -webkit-box !important;-webkit-box-orient: vertical !important;-webkit-line-clamp: 3 !important;position: static !important;width: 100% !important;min-width: 0 !important;height: 57.7px !important;min-height: 57.7px !important;max-height: 57.7px !important;margin: 10px 0 0 !important;padding: 0 !important;overflow: hidden !important;white-space: normal !important;overflow-wrap: anywhere !important;opacity: 1 !important;visibility: visible !important;transform: none !important;translate: none !important;cursor: help !important;}

  #solo-plugin-store-description-popover {position: fixed !important;z-index: 2147483000 !important;box-sizing: border-box !important;max-height: 250px !important;overflow-x: hidden !important;overflow-y: auto !important;padding: 9px 11px !important;font: inherit !important;line-height: 19.23px !important;text-align: left !important;white-space: normal !important;overflow-wrap: anywhere !important;pointer-events: auto !important;}
}

  /* =========================================================
     LUNATIC 0.7.3 — conservative fixes on top of stable 0.7.2
     ========================================================= */

  /* 1. Flat settings/theme/plugin cards: remove the occasional MUI shadow
        instead of adding elevation everywhere. */


  /* 2. Plugin Store top fields: keep the existing geometry, only make the
        field surface and outline readable against the page background. */






  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root:focus-within
    .MuiOutlinedInput-notchedOutline {border-width: 1px !important;}

  /* 3. Store author: hide only the avatar; reserve a fixed-width author slot
        so every 'by Author' begins at the same x-position. Keep the existing
        flex ordering and action buttons untouched. */
  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] {display: flex !important;align-items: center !important;justify-content: flex-start !important;margin-left: 0 !important;overflow: hidden !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author]
    .MuiAvatar-root {display: none !important;width: 0 !important;height: 0 !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] p[name] {display: block !important;width: 100% !important;min-width: 0 !important;margin: 0 !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  /* 4. Installed Plugins: restore a stable stock-like single-row header.
        Title/version stay together on the left, controls keep fixed geometry,
        author occupies a fixed slot at the right. */
  [data-lunatic-installed-plugin-header-stack="true"] {flex-direction: row !important;flex-wrap: nowrap !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiBox-root {flex: 1 1 0 !important;min-width: 8px !important;}

  [data-lunatic-installed-plugin-header-stack="true"] .MuiIconButton-root {position: static !important;flex: 0 0 40px !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform-origin: center center !important;}

  [data-lunatic-installed-plugin-header-stack="true"] .MuiSwitch-root {flex: 0 0 auto !important;margin: 0 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root:not(.Mui-disabled) {opacity: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root.Mui-disabled,
  [data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root:disabled {opacity: 1 !important;}

  /* Keep plugin description safely below the header; old hash-based theme
     rules must not pull it upward into title/version/author. */

  /* =========================================================
     LUNATIC 0.7.4 — structural author/plugin-header fixes
     ========================================================= */

  [data-lunatic-store-author="true"] .MuiAvatar-root {width: 0 !important;height: 0 !important;min-width: 0 !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-store-author="true"] p[name],
  [data-lunatic-store-author="true"] > p {overflow: hidden !important;text-overflow: ellipsis !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] {flex-basis: 126px !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiSwitch-root,
  [data-lunatic-installed-plugin-header-stack="true"] > span:has(.MuiSwitch-root),
  [data-lunatic-installed-plugin-header-stack="true"] > button.MuiIconButton-root {order: 1 !important;position: static !important;flex-shrink: 0 !important;margin-left: 0 !important;transform-origin: center center !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiSwitch-root,
  [data-lunatic-installed-plugin-header-stack="true"] > span:has(.MuiSwitch-root) {flex: 0 0 auto !important;margin: 0 !important;}

  /* =========================================================
     LUNATIC 0.7.5 — source-accurate LunaPluginHeader layout
     ========================================================= */

  /* STORE CATEGORY HEADER
     Row 1: title left + actions right
     Row 2: author
     Description remains the next child of LunaPluginHeader below the Stack. */
  [data-solo-plugin-store-header="true"] > .MuiStack-root {flex-flow: row wrap !important;justify-content: flex-start !important;gap: 0 8px !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > h6.MuiTypography-h6 {order: 0 !important;flex: 1 1 240px !important;}

  [data-lunatic-store-action="true"] {order: 1 !important;flex: 0 0 40px !important;margin-left: 0 !important;}

  [data-lunatic-store-spacer="true"] {flex: 0 0 0 !important;width: 0 !important;min-width: 0 !important;height: 0 !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-store-author="true"] {order: 2 !important;flex: 0 0 100% !important;display: flex !important;align-items: center !important;justify-content: flex-start !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: 18px !important;min-height: 18px !important;margin: 2px 0 0 !important;padding: 0 !important;overflow: hidden !important;}

  [data-lunatic-store-author="true"] .MuiAvatar-root {display: none !important;}

  [data-lunatic-store-author="true"] p[name],
  [data-lunatic-store-author="true"] > p {display: block !important;width: auto !important;min-width: 0 !important;height: 18px !important;margin: 0 !important;padding: 0 !important;line-height: 18px !important;white-space: nowrap !important;}

  /* Kill the old fixed-width author rules from 0.7.3/0.7.4. */
  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] {flex: 0 0 100% !important;width: 100% !important;min-width: 0 !important;max-width: none !important;}

  /* INSTALLED PLUGINS
     Same source-accurate LunaPluginHeader pattern:
     title/version + controls, then author, then description. */
  [data-lunatic-installed-plugin-header-stack="true"] {flex-flow: row wrap !important;justify-content: flex-start !important;gap: 0 8px !important;}

  [data-lunatic-installed-plugin-title="true"] {order: 0 !important;flex: 1 1 260px !important;}

  [data-lunatic-installed-plugin-title="true"] > .MuiTypography-caption {white-space: nowrap !important;}

  [data-lunatic-installed-plugin-spacer="true"] {flex: 0 0 0 !important;width: 0 !important;min-width: 0 !important;height: 0 !important;margin: 0 !important;padding: 0 !important;}

  /* Controls keep DOM order and fixed geometry.
     IMPORTANT: Switch stays relative, because MUI positions its thumb inside
     that containing block. position:static was the cause of the flying dots. */
  [data-lunatic-installed-plugin-header-stack="true"] > button.MuiIconButton-root {order: 1 !important;flex: 0 0 40px !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiSwitch-root,
  [data-lunatic-installed-plugin-header-stack="true"] > span:has(> .MuiSwitch-root) {order: 1 !important;position: relative !important;flex: 0 0 auto !important;margin: 0 !important;}

  [data-lunatic-installed-plugin-header-stack="true"] .MuiSwitch-root {position: relative !important;}

  [data-lunatic-installed-plugin-author="true"] {order: 2 !important;flex: 0 0 100% !important;}

  [data-lunatic-installed-plugin-author="true"] .MuiAvatar-root {display: none !important;}

  [data-lunatic-installed-plugin-author="true"] p[name],
  [data-lunatic-installed-plugin-author="true"] > p {display: block !important;position: static !important;width: auto !important;height: 18px !important;margin: 0 !important;padding: 0 !important;line-height: 18px !important;white-space: nowrap !important;}

  /* Keep active icon colors readable without flattening Luna's orange/green/
     red semantics. */
  [data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root:not(.Mui-disabled) {opacity: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root.Mui-disabled,
  [data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root:disabled {opacity: .42 !important;}

  /* =========================================================
     LUNATIC 0.7.6 — deterministic headers from captured DOM
     ========================================================= */

  /* STORE: exact grid. Actions can never wrap under title/author. */
  [data-solo-plugin-store-header="true"] > .MuiStack-root {display: grid !important;grid-template-columns: minmax(0,1fr) 40px 40px !important;grid-template-rows: auto auto !important;column-gap: 8px !important;row-gap: 2px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;height: auto !important;overflow: visible !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > h6.MuiTypography-h6 {grid-column: 1 !important;grid-row: 1 !important;display: block !important;position: static !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 !important;transform: none !important;translate: none !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > [data-lunatic-store-action="true"]:nth-of-type(1) {grid-column: 2 !important;grid-row: 1 !important;}

  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > [data-lunatic-store-action="true"]:nth-of-type(2) {grid-column: 3 !important;grid-row: 1 !important;}

  [data-lunatic-store-action="true"] {position: relative !important;align-self: center !important;justify-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;inset: auto !important;transform: none !important;}

  [data-lunatic-store-spacer="true"] {display: none !important;}

  [data-lunatic-store-author="true"],
  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] {grid-column: 1 !important;grid-row: 2 !important;display: flex !important;position: static !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;height: 18px !important;min-height: 18px !important;margin: 0 !important;padding: 0 !important;align-items: center !important;justify-content: flex-start !important;overflow: hidden !important;}

  [data-lunatic-store-author="true"] .MuiAvatar-root,
  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] .MuiAvatar-root {display: none !important;}

  [data-lunatic-store-author="true"] p[name],
  [data-lunatic-store-author="true"] > p,
  [data-solo-plugin-store-header="true"] > .MuiStack-root > [author] p[name] {display: block !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;height: 18px !important;margin: 0 !important;padding: 0 !important;line-height: 18px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  /* INSTALLED PLUGINS: the captured DOM is:
     title | switch | reload | live reload | settings | uninstall | spacer | author
     Lock every item to its own grid cell. */
  [data-lunatic-installed-plugin-header-stack="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) 56px repeat(4,40px) !important;grid-template-rows: 40px 18px !important;column-gap: 8px !important;row-gap: 2px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;height: auto !important;min-height: 60px !important;max-height: none !important;margin: 0 !important;padding: 0 !important;overflow: visible !important;}

  [data-lunatic-installed-plugin-title="true"] {grid-column: 1 !important;grid-row: 1 !important;align-self: center !important;display: block !important;position: static !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;height: 24px !important;min-height: 24px !important;max-height: 24px !important;margin: 0 !important;padding: 0 !important;inset: auto !important;transform: none !important;translate: none !important;line-height: 24px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  [data-lunatic-installed-plugin-title="true"] > a,
  [data-lunatic-installed-plugin-title="true"] > .MuiTypography-caption {display: inline !important;position: static !important;width: auto !important;height: auto !important;margin-top: 0 !important;margin-bottom: 0 !important;inset: auto !important;transform: none !important;translate: none !important;vertical-align: baseline !important;line-height: 24px !important;white-space: nowrap !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiSwitch-root {grid-column: 2 !important;grid-row: 1 !important;position: relative !important;align-self: center !important;justify-self: center !important;width: 56px !important;min-width: 56px !important;max-width: 56px !important;margin: 0 !important;inset: auto !important;transform: none !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root:nth-of-type(1) {grid-column: 3 !important;grid-row: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root:nth-of-type(2) {grid-column: 4 !important;grid-row: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root:nth-of-type(3) {grid-column: 5 !important;grid-row: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root:nth-of-type(4) {grid-column: 6 !important;grid-row: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root {position: relative !important;align-self: center !important;justify-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;margin-left: 0 !important;padding: 8px !important;inset: auto !important;top: auto !important;right: auto !important;bottom: auto !important;left: auto !important;transform: none !important;translate: none !important;}

  /* The state-dependent success class on Live Reload may change, but geometry
     cannot: same cell, same 40x40 box, same alignment. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button[aria-label="Enable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button[aria-label="Disable live reloading"] {align-self: center !important;justify-self: center !important;width: 40px !important;height: 40px !important;margin: 0 !important;inset: auto !important;transform: none !important;}

  [data-lunatic-installed-plugin-spacer="true"] {display: none !important;}

  [data-lunatic-installed-plugin-author="true"] {grid-column: 1 !important;grid-row: 2 !important;display: flex !important;position: static !important;align-items: center !important;justify-content: flex-start !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;height: 18px !important;min-height: 18px !important;max-height: 18px !important;margin: 0 !important;padding: 0 !important;inset: auto !important;transform: none !important;translate: none !important;overflow: hidden !important;}

  [data-lunatic-installed-plugin-author="true"] p[name] {display: block !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;height: 18px !important;margin: 0 !important;padding: 0 !important;line-height: 18px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  [data-lunatic-installed-plugin-header="true"] > .MuiTypography-subtitle2 {display: block !important;position: static !important;width: 100% !important;height: auto !important;min-height: 0 !important;max-height: none !important;margin: 12px 0 0 !important;padding: 0 !important;inset: auto !important;transform: none !important;translate: none !important;overflow: visible !important;}

  /* =========================================================
     LUNATIC 0.7.7 — final Plugins-tab stabilization
     ========================================================= */

  /* Live Reload swaps Emotion classes when state changes. Neutralize every
     geometry-affecting property on BOTH states and on the icon itself. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Enable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] {grid-column: 4 !important;grid-row: 1 !important;position: relative !important;top: 0 !important;right: auto !important;bottom: auto !important;left: 0 !important;align-self: center !important;justify-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;scale: 1 !important;vertical-align: middle !important;line-height: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Enable live reloading"]
    > .MuiSvgIcon-root,
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"]
    > .MuiSvgIcon-root {display: block !important;position: static !important;width: 24px !important;height: 24px !important;min-width: 24px !important;min-height: 24px !important;margin: 0 !important;padding: 0 !important;transform: none !important;translate: none !important;scale: 1 !important;vertical-align: middle !important;}

  /* The version is presentation metadata, not part of the hoverable plugin
     name. Keep it physically inline after the anchor. */
  [data-lunatic-installed-plugin-title="true"]
    > .MuiTypography-caption {display: inline !important;position: static !important;margin-left: 7px !important;vertical-align: baseline !important;line-height: inherit !important;transform: none !important;translate: none !important;pointer-events: none !important;}

  [data-lunatic-installed-plugin-name="true"] {display: inline !important;position: static !important;vertical-align: baseline !important;}

  /* =========================================================
     LUNATIC 0.7.8 — Plugins / Feature Flags / core plugins
     ========================================================= */

  /* Live Reload intentionally has a built-in vibrate animation while fetching.
     In a compact header that reads as the button jumping between rows. Disable
     geometry animation but preserve the state color/icon. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] {transition-property: color, background-color, opacity !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] *,
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] * {animation: none !important;transform: none !important;translate: none !important;}

  /* Version is always visible inline after the plugin name. The popover is
     bound to the anchor only, so the caption is no longer part of hover text. */
  [data-lunatic-installed-plugin-title="true"]
    > span.MuiTypography-caption {display: inline !important;visibility: visible !important;opacity: .7 !important;position: static !important;width: auto !important;max-width: none !important;height: auto !important;margin-left: 7px !important;-webkit-text-fill-color: currentColor !important;vertical-align: baseline !important;line-height: inherit !important;white-space: nowrap !important;overflow: visible !important;clip: auto !important;transform: none !important;translate: none !important;}

  /* Feature Flags: undo the old generated-class plugin-row rules and restore
     a real two-column settings grid with one horizontal setting per card. */

  /* Core Luna plugins are not ordinary user plugins. They have no enable
     switch/uninstall action, so give them a dedicated 2-column card grid. */

  /* =========================================================
     LUNATIC 0.7.9 — Settings cleanup
     ========================================================= */

  /* 1. Live Reload: off-state aria-label includes
        "(for development)". Match by prefix so both states share geometry. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] {grid-column: 4 !important;grid-row: 1 !important;position: relative !important;inset: auto !important;top: 0 !important;left: 0 !important;align-self: center !important;justify-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] > svg,
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] > svg {display: block !important;position: static !important;width: 24px !important;height: 24px !important;min-width: 24px !important;min-height: 24px !important;margin: 0 !important;padding: 0 !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  /* 2. FEATURE FLAGS
        Four equal columns across the full available width. */

  /* 3. LUNA CORE PLUGINS
        One column, full-width cards, same structural hierarchy as Plugins:
        title + controls, author below, description below that, settings full-width. */

  /* Core-plugin settings/content opened below the header get the whole card. */

@layer solo-plugin-store-fix {
  /* =========================================================
     LUNATIC 0.7.10 — true final overrides
     Important declarations are deliberately inside the original named layer.
     ========================================================= */

  /* PLUGINS: version must remain visible immediately after the package name. */
  [data-lunatic-installed-plugin-title="true"] {overflow: visible !important;text-overflow: clip !important;}

  [data-lunatic-installed-plugin-title="true"]
    > .MuiTypography-caption {display: inline !important;visibility: visible !important;opacity: .7 !important;position: static !important;inset: auto !important;width: auto !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 0 !important;max-height: none !important;margin: 0 0 0 7px !important;padding: 0 !important;transform: none !important;translate: none !important;scale: 1 !important;line-height: 24px !important;vertical-align: baseline !important;white-space: nowrap !important;pointer-events: none !important;}

  /* Live Reload: both actual labels, same exact cell and geometry.
     The named layer is important here because older layered rules were
     surviving all later unlayered patches. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] {grid-column: 4 !important;grid-row: 1 !important;position: relative !important;inset: auto !important;top: 0 !important;right: auto !important;bottom: auto !important;left: 0 !important;place-self: center !important;align-self: center !important;justify-self: center !important;box-sizing: border-box !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;transition-property: color, background-color, opacity !important;vertical-align: middle !important;line-height: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"] *,
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] * {animation: none !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"]
    > .MuiSvgIcon-root,
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"]
    > .MuiSvgIcon-root {display: block !important;position: static !important;box-sizing: border-box !important;width: 24px !important;min-width: 24px !important;max-width: 24px !important;height: 24px !important;min-height: 24px !important;max-height: 24px !important;margin: 0 !important;padding: 0 !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  /* FEATURE FLAGS: the previous grid itself was correct, but its ancestors
     retained an old ~50% width. Stretch the complete feature-flags subtree. */

  /* CORE PLUGINS: force the whole section and each card to one full-width
     vertical flow. No residual MUI half-width grid is allowed. */

  /* Row 1: title left + controls right. Row 2: author. */

  /* Any opened settings underneath the header are a vertical full-width flow. */

}

@layer solo-plugin-store-fix {
  /* =========================================================
     LUNATIC 0.7.11
     ========================================================= */

  /* 1. Plugins: move Live Reload back one slot while keeping both states fixed.
        Current layout places switch at col2, reload at col3, live reload at col4.
        We want live reload visually where it originally sat: immediately after
        reload but without the state-dependent jump. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Reload plugin"] {grid-column: 3 !important;grid-row: 1 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] {grid-column: 4 !important;grid-row: 1 !important;position: relative !important;inset: auto !important;place-self: center !important;width: 40px !important;height: 40px !important;min-width: 40px !important;min-height: 40px !important;max-width: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  /* Version inline with the name; author owns row 2. */
  [data-lunatic-installed-plugin-title="true"] {grid-column: 1 !important;grid-row: 1 !important;display: block !important;position: static !important;min-width: 0 !important;width: auto !important;height: 24px !important;min-height: 24px !important;max-height: 24px !important;line-height: 24px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  [data-lunatic-installed-plugin-title="true"] > a {display: inline !important;vertical-align: baseline !important;}

  [data-lunatic-installed-plugin-title="true"] > .MuiTypography-caption {display: inline !important;visibility: visible !important;opacity: .7 !important;position: static !important;width: auto !important;height: auto !important;margin: 0 0 0 7px !important;padding: 0 !important;line-height: 24px !important;vertical-align: baseline !important;white-space: nowrap !important;transform: none !important;translate: none !important;pointer-events: none !important;}

  [data-lunatic-installed-plugin-author="true"] {grid-column: 1 / -1 !important;grid-row: 2 !important;display: flex !important;align-items: center !important;width: 100% !important;min-width: 0 !important;height: 18px !important;margin: 0 !important;padding: 0 !important;}

  /* 2. THEMES */
  [data-lunatic-themes-install-row="true"] {display: block !important;width: 100% !important;min-width: 0 !important;max-width: none !important;}

  [data-lunatic-themes-install-field="true"] {width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;}







  [data-lunatic-themes-install-field="true"]:focus-within .MuiOutlinedInput-notchedOutline {border-width: 1px !important;}

  [data-lunatic-theme-row="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) auto auto !important;align-items: center !important;column-gap: 10px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;box-sizing: border-box !important;margin: 0 !important;padding: 12px 14px !important;overflow: hidden !important;}

  [data-lunatic-theme-url="true"] {grid-column: 1 !important;display: block !important;min-width: 0 !important;max-width: 100% !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-lunatic-theme-switch="true"] {grid-column: 2 !important;position: relative !important;margin: 0 !important;flex: 0 0 auto !important;}

  [data-lunatic-theme-action="true"] {grid-column: 3 !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;position: relative !important;transform: none !important;translate: none !important;}

  /* 3. Core plugins: normal active/disabled icon palette + full-width settings. */

}

@layer solo-plugin-store-fix {
  /* =========================================================
     LUNATIC 0.7.12 — narrow fixes only
     ========================================================= */

  /* PLUGINS
     Keep Reload / Live Reload in the first row, but stop forcing their
     vertical placement through stale grid alignment. */
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Reload plugin"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] {grid-row: 1 !important;top: auto !important;bottom: auto !important;place-self: center !important;align-self: center !important;justify-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;animation: none !important;}

  /* THEMES — exact same input surface language as Plugin Store. */
  [data-lunatic-themes-install-field="true"] {display: grid !important;grid-template-rows: 16px 40px !important;row-gap: 5px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-themes-install-field="true"] > .MuiInputLabel-root {grid-row: 1 !important;position: static !important;transform: none !important;display: block !important;width: max-content !important;max-width: 100% !important;height: 16px !important;margin: 0 !important;padding: 0 !important;line-height: 16px !important;-webkit-text-fill-color: rgba(255,255,255,.62) !important;}

  [data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root {grid-row: 2 !important;width: 100% !important;height: 40px !important;min-height: 40px !important;margin: 0 !important;}



  [data-lunatic-theme-row="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) auto 40px !important;align-items: center !important;column-gap: 10px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;}

  [data-lunatic-theme-url="true"] {grid-column: 1 !important;min-width: 0 !important;max-width: 100% !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-lunatic-theme-switch="true"] {grid-column: 2 !important;position: relative !important;margin: 0 !important;}

  [data-lunatic-theme-delete="true"] {grid-column: 3 !important;grid-row: 1 !important;position: relative !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;}

  /* Themes do not need a separate reload action. Hide it rather than letting
     it stack underneath the delete icon. */
  [data-lunatic-theme-reload="true"] {display: none !important;}

  /* CORE PLUGINS — explicit semantic icon colors. */

  /* Core settings/content: direct children after the header get the entire
     card width. Flatten nested MUI grid sizing that used to push content out. */

}

@layer solo-plugin-store-fix {
  /* =========================================================
     LUNATIC 0.7.13 — DOM-grounded fixes
     ========================================================= */

  /* ---------- INSTALLED PLUGINS ----------
     Header DOM:
       title, switch, reload, live, settings, uninstall, spacer, author
     Controls should be vertically centered across title + author together. */
  [data-lunatic-installed-plugin-header-stack="true"] {display: grid !important;grid-template-columns:
      minmax(0,1fr)
      56px
      40px
      40px
      40px
      40px !important;grid-template-rows: 24px 18px !important;column-gap: 8px !important;row-gap: 2px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;max-width: none !important;}

  [data-lunatic-installed-plugin-title="true"] {grid-column: 1 !important;grid-row: 1 !important;display: block !important;position: static !important;width: auto !important;min-width: 0 !important;height: 24px !important;min-height: 24px !important;max-height: 24px !important;margin: 0 !important;padding: 0 !important;line-height: 24px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;}

  [data-lunatic-installed-plugin-title="true"] > a,
  [data-lunatic-installed-plugin-title="true"] > .MuiTypography-caption {display: inline !important;position: static !important;vertical-align: baseline !important;transform: none !important;translate: none !important;}

  [data-lunatic-installed-plugin-title="true"] > .MuiTypography-caption {visibility: visible !important;opacity: .7 !important;width: auto !important;height: auto !important;margin: 0 0 0 7px !important;padding: 0 !important;line-height: 24px !important;white-space: nowrap !important;pointer-events: none !important;}

  [data-lunatic-installed-plugin-author="true"] {grid-column: 1 !important;grid-row: 2 !important;display: flex !important;position: static !important;align-items: center !important;justify-content: flex-start !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: 18px !important;min-height: 18px !important;max-height: 18px !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-installed-plugin-header-stack="true"] > .MuiSwitch-root {grid-column: 2 !important;grid-row: 1 / span 2 !important;position: relative !important;place-self: center !important;margin: 0 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Reload plugin"] {grid-column: 3 !important;grid-row: 1 / span 2 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Disable live reloading"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label^="Enable live reloading"] {grid-column: 4 !important;grid-row: 1 / span 2 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Hide settings"],
  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Show settings"] {grid-column: 5 !important;grid-row: 1 / span 2 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root[aria-label="Uninstall plugin"] {grid-column: 6 !important;grid-row: 1 / span 2 !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root {position: relative !important;place-self: center !important;box-sizing: border-box !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;top: auto !important;right: auto !important;bottom: auto !important;left: auto !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  [data-lunatic-installed-plugin-header-stack="true"]
    > button.MuiIconButton-root > .MuiSvgIcon-root {display: block !important;position: static !important;width: 24px !important;height: 24px !important;margin: 0 !important;padding: 0 !important;transform: none !important;translate: none !important;scale: 1 !important;animation: none !important;}

  [data-lunatic-installed-plugin-spacer="true"] {display: none !important;}

  /* ---------- THEMES ----------
     Theme rows are no longer treated as installed Plugins. */
  [data-lunatic-themes-install-field="true"] {display: grid !important;grid-template-rows: 16px 40px !important;row-gap: 5px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-themes-install-field="true"] > .MuiInputLabel-root {grid-row: 1 !important;position: static !important;transform: none !important;display: block !important;width: max-content !important;height: 16px !important;margin: 0 !important;padding: 0 !important;line-height: 16px !important;-webkit-text-fill-color: rgba(255,255,255,.62) !important;}

  [data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root {grid-row: 2 !important;width: 100% !important;height: 40px !important;min-height: 40px !important;margin: 0 !important;}





  [data-lunatic-themes-install-field="true"]:focus-within .MuiOutlinedInput-notchedOutline {border-width: 1px !important;}

  [data-lunatic-theme-row="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) 56px 40px 40px !important;grid-template-rows: 40px !important;column-gap: 8px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;max-width: none !important;box-sizing: border-box !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;}

  [data-lunatic-theme-row="true"] > h6.MuiTypography-h6 {grid-column: 1 !important;grid-row: 1 !important;display: block !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-lunatic-theme-url="true"] {display: block !important;min-width: 0 !important;max-width: 100% !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-lunatic-theme-switch="true"] {grid-column: 2 !important;grid-row: 1 !important;position: relative !important;place-self: center !important;margin: 0 !important;}

  [data-lunatic-theme-reload="true"] {display: inline-flex !important;grid-column: 3 !important;grid-row: 1 !important;position: relative !important;place-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;}

  [data-lunatic-theme-delete="true"] {grid-column: 4 !important;grid-row: 1 !important;position: relative !important;place-self: center !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;}

  [data-lunatic-theme-spacer="true"] {display: none !important;}

  /* ---------- CORE PLUGINS ----------
     Header colors use the same semantics as normal Plugins. */

  /* Each content section is full width. */

@media (max-width: 760px) {
    [data-lunatic-installed-plugin-header-stack="true"] {grid-template-columns: minmax(0,1fr) 52px 36px 36px 36px 36px !important;column-gap: 5px !important;}

  }
}

@layer solo-plugin-store-fix {
  /* =========================================================
     LUNATIC 0.7.14
     ========================================================= */

  /* THEMES: neutral icon palette, same as the rest of Lunatic. */
  [data-lunatic-theme-reload="true"],
  [data-lunatic-theme-delete="true"],
  [data-lunatic-theme-action="true"] {opacity: 1 !important;}



  [data-lunatic-theme-reload="true"].Mui-disabled,
  [data-lunatic-theme-delete="true"].Mui-disabled,
  [data-lunatic-theme-action="true"].Mui-disabled,
  [data-lunatic-theme-reload="true"]:disabled,
  [data-lunatic-theme-delete="true"]:disabled,
  [data-lunatic-theme-action="true"]:disabled {opacity: 1 !important;}



  /* PLUGIN STORE: restore the preferred two-column top controls. */
  [data-solo-plugin-store-controls="true"] {display: grid !important;grid-template-columns: repeat(2, minmax(0,1fr)) !important;gap: 16px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 0 16px !important;}

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root {width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;}

  @media (max-width: 760px) {
    [data-solo-plugin-store-controls="true"] {grid-template-columns: minmax(0,1fr) !important;}
  }

  /* CORE PLUGINS: neutral icon palette instead of warning/success/error hues. */

}



@layer solo-plugin-store-fix {
  /* =========================================================
     SUPPORTERS — canonical exact implementation
     Replaces historical 0.7.23–0.7.29 patch train.
     ========================================================= */

  [data-lunatic-exact-supporter-section="sponsors"],
  [data-lunatic-exact-supporter-section="contributors"],
  [data-lunatic-exact-supporter-section="stargazers"],
  [data-lunatic-exact-supporter-stack="sponsors"],
  [data-lunatic-exact-supporter-stack="contributors"],
  [data-lunatic-exact-supporter-stack="stargazers"] {box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;overflow: visible !important;}

  [data-lunatic-exact-supporter-stack="sponsors"],
  [data-lunatic-exact-supporter-stack="contributors"],
  [data-lunatic-exact-supporter-stack="stargazers"] {display: block !important;}

  [data-lunatic-exact-supporter-grid="sponsors"],
  [data-lunatic-exact-supporter-grid="contributors"],
  [data-lunatic-exact-supporter-grid="stargazers"] {display: grid !important;grid-template-columns: repeat(4, minmax(0,1fr)) !important;gap: 14px 22px !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 16px 18px !important;overflow: hidden !important;}

  [data-lunatic-exact-supporter-item="true"] {display: flex !important;align-items: center !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: 100% !important;min-height: 58px !important;margin: 0 !important;padding: 10px 12px !important;flex: none !important;flex-basis: auto !important;}

  [data-lunatic-exact-supporter-item="true"] .MuiStack-root[author] {display: grid !important;grid-template-columns: minmax(0,1fr) auto !important;align-items: center !important;column-gap: 10px !important;width: 100% !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-exact-supporter-item="true"] .MuiStack-root[author] > p[name] {grid-column: 1 !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;text-overflow: ellipsis !important;white-space: nowrap !important;}

  [data-lunatic-exact-supporter-item="true"]
    .MuiStack-root[author] > .MuiAvatar-root {grid-column: 2 !important;justify-self: end !important;margin: 0 !important;flex: 0 0 auto !important;}

  [data-lunatic-exact-supporter-section="contributors"],
  [data-lunatic-exact-supporter-section="stargazers"] {margin-top: 26px !important;}

  @media (max-width: 1100px) {
    [data-lunatic-exact-supporter-grid="sponsors"],
    [data-lunatic-exact-supporter-grid="contributors"],
    [data-lunatic-exact-supporter-grid="stargazers"] {grid-template-columns: repeat(3, minmax(0,1fr)) !important;}
  }

  @media (max-width: 820px) {
    [data-lunatic-exact-supporter-grid="sponsors"],
    [data-lunatic-exact-supporter-grid="contributors"],
    [data-lunatic-exact-supporter-grid="stargazers"] {grid-template-columns: repeat(2, minmax(0,1fr)) !important;}
  }

  @media (max-width: 560px) {
    [data-lunatic-exact-supporter-grid="sponsors"],
    [data-lunatic-exact-supporter-grid="contributors"],
    [data-lunatic-exact-supporter-grid="stargazers"] {grid-template-columns: minmax(0,1fr) !important;}
  }
}


@layer solo-plugin-store-fix {
  /* =========================================================
     SETTINGS — canonical implementation
     Collapses historical 0.8.3 → 0.9.2 overrides.
     ========================================================= */



  /* ---------- Installed plugins ---------- */
  [data-lunatic-installed-plugin="true"] {margin-bottom: 14px !important;}

  [data-lunatic-installed-plugin="true"]:last-child {margin-bottom: 0 !important;}

  [data-lunatic-installed-plugin="true"]
    > :not([data-lunatic-installed-plugin-header="true"]) {box-sizing: border-box !important;margin-top: 12px !important;}

  /* ---------- Unified inputs ---------- */


  [data-lunatic-unified-input="true"]
    > .MuiOutlinedInput-notchedOutline {border-width: 1px !important;}



  /* ---------- Themes ---------- */




  /* ---------- Settings hierarchy ---------- */




  [data-lunatic-client-updates-shell="true"],
  [data-lunatic-backup-settings-shell="true"],
  [data-lunatic-feature-flags-shell="true"],
  [data-lunatic-core-plugins-grid="true"] {box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin-bottom: 18px !important;padding: 18px 20px !important;}

  /* ---------- Feature Flags ---------- */
  [data-lunatic-feature-flags-grid="true"] {width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;}



  /* ---------- Client Updates / backup ---------- */
  [data-lunatic-client-updates-shell="true"] > *,
  [data-lunatic-backup-settings-shell="true"] > * {max-width: 100% !important;}



  [data-lunatic-client-update-controls="true"] {box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;margin-top: 10px !important;padding: 12px 14px !important;}



  [data-lunatic-client-version-select="true"]
    > .MuiOutlinedInput-notchedOutline {border-width: 1px !important;}

  [data-lunatic-client-version-select="true"]
    > .MuiSelect-select {padding-left: 14px !important;padding-right: 38px !important;}



  /* ---------- Core plugins collection ---------- */
  [data-lunatic-core-plugins-grid="true"] {display: flex !important;flex-direction: column !important;gap: 14px !important;}

  [data-lunatic-core-plugins-grid="true"]
    > [data-lunatic-core-plugin="true"] {margin: 0 !important;}

  [data-lunatic-core-plugin="true"] {padding: 16px 20px !important;}



  /* ---------- Core settings section ---------- */
  .MuiBox-root[data-lunatic-core-plugin-content="true"] {display: block !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 0 !important;max-height: none !important;margin: 14px 0 0 !important;padding: 18px 20px 16px !important;overflow: visible !important;}

  /* Title/description inset. */
  [data-lunatic-core-settings-title="true"] {box-sizing: border-box !important;display: block !important;width: 100% !important;min-width: 0 !important;margin: 0 0 8px !important;padding: 8px 12px 12px !important;}

  [data-lunatic-core-settings-title="true"]
    > .MuiTypography-h7 {display: block !important;margin: 0 0 5px !important;padding: 0 !important;}

  [data-lunatic-core-settings-title="true"]
    > .MuiTypography-subtitle2 {margin: 0 !important;padding: 0 !important;}

  [data-lunatic-core-settings-title="true"] + div[style*="height: 8px"] {height: 4px !important;}

  /* One LunaSettings group, no nested card fills. */
  .MuiBox-root[data-lunatic-core-plugin-content="true"]
    > .MuiStack-root[display="flex"],
  [data-lunatic-core-plugin-content="true"]
    .MuiStack-root[display="flex"] {display: flex !important;flex-direction: column !important;align-items: stretch !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 0 !important;max-height: none !important;gap: 0 !important;margin: 0 !important;padding: 0 !important;}

  /* Exact direct row stack gets the final horizontal gutter from 0.9.2. */
  .MuiBox-root[data-lunatic-core-plugin-content="true"]
    > .MuiStack-root[display="flex"] {padding: 0 6px !important;}

  /* Real setting row: text left, controls right. */
  [data-lunatic-core-plugin-content="true"]
    .MuiStack-root[alignitems="center"] {display: grid !important;grid-template-columns: minmax(0,1fr) minmax(220px, 40%) !important;align-items: center !important;column-gap: 18px !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 68px !important;max-height: none !important;margin: 0 !important;padding: 12px !important;overflow: visible !important;}



  [data-lunatic-core-plugin-content="true"]
    .MuiStack-root[alignitems="center"]
    > .MuiBox-root:first-child {grid-column: 1 !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 8px 0 0 !important;}

  [data-lunatic-core-plugin-content="true"]
    .MuiStack-root[alignitems="center"]
    > .MuiBox-root[display="flex"] {grid-column: 2 !important;display: flex !important;flex-direction: row !important;align-items: center !important;justify-content: flex-end !important;width: 100% !important;min-width: 0 !important;max-width: none !important;gap: 10px !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-core-plugin-content="true"] .MuiTextField-root {flex: 1 1 auto !important;width: auto !important;min-width: 170px !important;max-width: 320px !important;margin: 0 !important;}

  [data-lunatic-core-plugin-content="true"] .MuiSwitch-root {flex: 0 0 auto !important;margin: 0 !important;}

  [data-lunatic-core-plugin-content="true"] .MuiButton-root {flex: 0 0 auto !important;min-width: 190px !important;max-width: 260px !important;margin: 0 !important;}

  @media (max-width: 820px) {
    [data-lunatic-core-plugin-content="true"]
      .MuiStack-root[alignitems="center"] {grid-template-columns: minmax(0,1fr) !important;row-gap: 10px !important;}

    [data-lunatic-core-plugin-content="true"]
      .MuiStack-root[alignitems="center"]
      > .MuiBox-root[display="flex"] {grid-column: 1 !important;justify-content: flex-start !important;}
  }
}

/* ===== RADIANT / ADAPTIVE MATERIAL ===== */

@layer solo-plugin-store-fix {
  /* =========================================================
     FEATURE FLAGS / CORE PLUGINS — canonical structural guards
     Historical foundation rules removed in 0.12.7.
     ========================================================= */

  /* Feature Flags own the full available width. */
  [data-lunatic-feature-flags-outer="true"],
  [data-lunatic-feature-flags-shell="true"],
  [data-lunatic-feature-flags-grid="true"] {display: block !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;flex: 1 1 100% !important;margin-left: 0 !important;margin-right: 0 !important;transform: none !important;translate: none !important;}

  [data-lunatic-feature-flags-grid="true"] {display: grid !important;grid-template-columns: repeat(4, minmax(0,1fr)) !important;gap: 12px 16px !important;padding: 0 !important;align-items: stretch !important;}

  [data-lunatic-feature-flag="true"] {display: flex !important;align-items: center !important;justify-content: space-between !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;min-height: 58px !important;margin: 0 !important;padding: 10px 12px !important;overflow: hidden !important;flex-basis: auto !important;}

  [data-lunatic-feature-flag-setting="true"] {display: flex !important;flex-direction: row !important;align-items: center !important;justify-content: space-between !important;width: 100% !important;min-width: 0 !important;min-height: 42px !important;margin: 0 !important;padding: 0 !important;gap: 12px !important;overflow: visible !important;}

  [data-lunatic-feature-flag-setting="true"] > .MuiBox-root:first-child {flex: 1 1 auto !important;min-width: 0 !important;margin: 0 !important;}

  [data-lunatic-feature-flag-setting="true"] > .MuiBox-root:last-child,
  [data-lunatic-feature-flag="true"] .MuiSwitch-root {flex: 0 0 auto !important;position: relative !important;margin: 0 !important;}

  [data-lunatic-feature-flag="true"] .MuiTypography-root {min-width: 0 !important;margin-right: 10px !important;}

  @media (max-width: 1180px) {
    [data-lunatic-feature-flags-grid="true"] {grid-template-columns: repeat(2, minmax(0,1fr)) !important;}
  }

  @media (max-width: 700px) {
    [data-lunatic-feature-flags-grid="true"] {grid-template-columns: minmax(0,1fr) !important;}
  }

  /* Core Plugins are one full-width vertical flow. */
  [data-lunatic-core-plugins-shell="true"],
  [data-lunatic-core-plugins-grid="true"] {box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;transform: none !important;translate: none !important;}

  [data-lunatic-core-plugins-grid="true"] {display: flex !important;flex-direction: column !important;gap: 14px !important;}

  [data-lunatic-core-plugin="true"] {display: block !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 0 !important;max-height: none !important;overflow: visible !important;}

  [data-lunatic-core-plugin-header="true"] {display: flex !important;flex-direction: column !important;align-items: stretch !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: auto !important;min-height: 0 !important;margin: 0 !important;padding: 0 !important;overflow: visible !important;}

  [data-lunatic-core-plugin-header-stack="true"] {display: grid !important;grid-template-columns: minmax(0,1fr) repeat(3,40px) !important;grid-template-rows: 40px 18px !important;column-gap: 8px !important;row-gap: 2px !important;align-items: center !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;overflow: visible !important;}

  [data-lunatic-core-plugin-title="true"] {grid-column: 1 !important;grid-row: 1 !important;display: block !important;position: static !important;width: auto !important;min-width: 0 !important;max-width: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 24px !important;white-space: nowrap !important;overflow: hidden !important;text-overflow: ellipsis !important;transform: none !important;translate: none !important;}

  [data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root {grid-row: 1 !important;position: relative !important;place-self: center !important;box-sizing: border-box !important;width: 40px !important;min-width: 40px !important;max-width: 40px !important;height: 40px !important;min-height: 40px !important;max-height: 40px !important;margin: 0 !important;padding: 8px !important;transform: none !important;translate: none !important;}

  [data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root:nth-of-type(1) {grid-column: 2 !important;}
  [data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root:nth-of-type(2) {grid-column: 3 !important;}
  [data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root:nth-of-type(3) {grid-column: 4 !important;}

  [data-lunatic-core-plugin-spacer="true"] {display: none !important;}

  [data-lunatic-core-plugin-author="true"] {grid-column: 1 / -1 !important;grid-row: 2 !important;display: flex !important;align-items: center !important;justify-content: flex-start !important;width: 100% !important;min-width: 0 !important;max-width: none !important;height: 18px !important;min-height: 18px !important;max-height: 18px !important;margin: 0 !important;padding: 0 !important;overflow: hidden !important;}

  [data-lunatic-core-plugin-author="true"] .MuiAvatar-root {display: none !important;}

  [data-lunatic-core-plugin-author="true"] p[name],
  [data-lunatic-core-plugin-author="true"] > p {display: block !important;width: auto !important;height: 18px !important;margin: 0 !important;padding: 0 !important;line-height: 18px !important;white-space: nowrap !important;}

  [data-lunatic-core-plugin-header="true"] > .MuiTypography-subtitle2 {display: block !important;position: static !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 12px 0 0 !important;padding: 0 !important;overflow: visible !important;transform: none !important;translate: none !important;}

  /* Neutral icon palette. */
  [data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root:not(.Mui-disabled) {opacity: 1 !important;}



  [data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root.Mui-disabled,
  [data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root:disabled {opacity: 1 !important;}



  /* Opened settings and nested MUI grids must own the entire card width. */
  [data-lunatic-core-plugin="true"] > :not([data-lunatic-core-plugin-header="true"]) {display: block !important;box-sizing: border-box !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin-left: 0 !important;margin-right: 0 !important;overflow: visible !important;}

  [data-lunatic-core-plugin-content="true"] > * {box-sizing: border-box !important;min-width: 0 !important;max-width: 100% !important;}

  [data-lunatic-core-plugin-content="true"] .MuiGrid-root.MuiGrid-container,
  [data-lunatic-core-plugin="true"] .MuiGrid-root.MuiGrid-container {display: grid !important;grid-template-columns: minmax(0,1fr) !important;gap: 12px !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;}

  [data-lunatic-core-plugin-content="true"] .MuiGrid-root:not(.MuiGrid-container),
  [data-lunatic-core-plugin="true"] .MuiGrid-root:not(.MuiGrid-container) {display: block !important;width: 100% !important;min-width: 0 !important;max-width: none !important;margin: 0 !important;padding: 0 !important;flex: 0 0 100% !important;}
}


@layer solo-plugin-store-fix {
  /* Structural reset locks: these belong to layout/UX even though the CSS
     properties are normally visual. They neutralize MUI state geometry. */
  [data-solo-plugin-card="true"],
  [data-solo-plugin-card="true"]:is(:hover,:focus,:focus-visible,:active) {
    filter: none !important;
  }

  [data-solo-plugin-card="true"] > .MuiBox-root:first-child,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child,
  [data-solo-plugin-card="true"] > .MuiBox-root:first-child > *,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child > * {
    filter: none !important;
  }

  [data-lunatic-installed-plugin-header-stack="true"] .MuiIconButton-root,
  [data-lunatic-installed-plugin-header-stack="true"] .MuiIconButton-root svg,
  [data-lunatic-theme-reload="true"],
  [data-lunatic-theme-delete="true"],
  [data-lunatic-theme-action="true"],
  [data-lunatic-theme-reload="true"] svg,
  [data-lunatic-theme-delete="true"] svg,
  [data-lunatic-theme-action="true"] svg {
    transform: none !important;
  }
}

@layer solo-plugin-store-fix {
  /* =========================================================
     VISUAL-OFF STRUCTURAL GUARDS
     These are neutral resets, not Lunatic palette. They keep Luna/MUI's own
     fills and colours while preventing stock Paper/Card styling from changing
     the geometry that Layout & UX fixes establish.
     ========================================================= */

  [data-lunatic-installed-plugin="true"],
  [data-lunatic-installed-plugin-header="true"],
  [data-lunatic-installed-plugin-header-stack="true"],
  [data-lunatic-core-plugin="true"],
  [data-lunatic-core-plugin-header="true"],
  [data-lunatic-core-plugin-header-stack="true"] {
    box-sizing: border-box !important;
  }

  [data-lunatic-installed-plugin-header="true"],
  [data-lunatic-installed-plugin-header-stack="true"],
  [data-lunatic-core-plugin-header="true"],
  [data-lunatic-core-plugin-header-stack="true"] {
    min-width: 0 !important;
    max-width: none !important;
  }
}

@layer solo-plugin-store-fix {
  /* =========================================================
     INSTALLED PLUGIN SETTINGS — semantic layout
     Replaces old theme.ts rules tied to Emotion css-* hashes.
     ========================================================= */

  [data-lunatic-installed-plugin-settings-shell="true"] {
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    margin-top: 8px !important;
  }

  [data-lunatic-installed-plugin-settings="true"] {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0,1fr)) !important;
    gap: 10px 18px !important;
    align-items: stretch !important;
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  [data-lunatic-installed-plugin-setting="true"] {
    display: grid !important;
    grid-template-columns: minmax(0,1fr) 42px !important;
    grid-template-areas: "copy control" !important;
    align-items: center !important;
    column-gap: 14px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    min-height: 56px !important;
    margin: 0 !important;
    padding: 8px 12px !important;
    overflow: visible !important;
  }

  [data-lunatic-installed-plugin-setting-copy="true"] {
    grid-area: copy !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  [data-lunatic-installed-plugin-setting-control="true"] {
    grid-area: control !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-end !important;
    width: 42px !important;
    min-width: 42px !important;
    max-width: 42px !important;
    min-height: 32px !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  [data-lunatic-installed-plugin-setting-kind="switch"]
    [data-lunatic-installed-plugin-setting-control="true"] > .MuiSwitch-root {
    flex: 0 0 auto !important;
    margin: 0 !important;
  }

  [data-lunatic-installed-plugin-setting="true"]
    :is(.MuiTypography-h8,.MuiTypography-subtitle2) {
    display: block !important;
    min-width: 0 !important;
    overflow-wrap: anywhere !important;
  }

  [data-lunatic-installed-plugin-setting="true"] .MuiTypography-subtitle2 {
    margin: 3px 0 0 !important;
    white-space: normal !important;
  }

  /* Controls wider than a switch need the full second row. */
  [data-lunatic-installed-plugin-setting-kind="button"],
  [data-lunatic-installed-plugin-setting-kind="field"] {
    grid-column: 1 / -1 !important;
    grid-template-columns: minmax(0,1fr) !important;
    grid-template-areas:
      "copy"
      "control" !important;
    row-gap: 8px !important;
  }

  [data-lunatic-installed-plugin-setting-kind="button"]
    [data-lunatic-installed-plugin-setting-control="true"],
  [data-lunatic-installed-plugin-setting-kind="field"]
    [data-lunatic-installed-plugin-setting-control="true"] {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    justify-content: flex-start !important;
  }

  [data-lunatic-installed-plugin-setting-kind="field"] .MuiTextField-root {
    flex: 1 1 auto !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;
  }

  @media (max-width: 900px) {
    [data-lunatic-installed-plugin-settings="true"] {
      grid-template-columns: minmax(0,1fr) !important;
    }
  }
}

@layer solo-plugin-store-fix {
  /* =========================================================
     SETTINGS CONTENT SPACING / STOCK LUNA CORRECTIONS
     ========================================================= */

  /* LunaSettings renders title/description as the first child of the shell.
     Give that block breathing room so copy does not visually touch the card
     edge. This is geometry, not theme decoration. */
  [data-lunatic-installed-plugin-settings-shell="true"]
    > .MuiBox-root:first-child {
    box-sizing: border-box !important;
    width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding: 10px 12px 6px !important;
  }

  [data-lunatic-installed-plugin-settings-shell="true"]
    > .MuiBox-root:first-child
    > .MuiTypography-subtitle2 {
    margin-bottom: 0 !important;
  }

  /* Stock Luna can render outlined labels inside Core Plugin settings with
     a dark/black label while the surrounding text uses the inherited light
     foreground. Fix the broken inheritance without imposing Lunatic's palette. */
  [data-lunatic-core-plugin-content="true"]
    .MuiFormControl-root
    > .MuiInputLabel-root {
    color: inherit !important;
    -webkit-text-fill-color: currentColor !important;
  }

  [data-lunatic-core-plugin-content="true"]
    .MuiFormControl-root
    > .MuiInputLabel-root.Mui-focused,
  [data-lunatic-core-plugin-content="true"]
    .MuiFormControl-root
    > .MuiInputLabel-root.MuiFormLabel-filled {
    color: inherit !important;
    -webkit-text-fill-color: currentColor !important;
  }
}

`;
