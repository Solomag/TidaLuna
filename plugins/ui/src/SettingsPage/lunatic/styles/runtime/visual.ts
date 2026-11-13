export const lunaticVisualCss = String.raw`
@layer lunatic-stable-tint, solo-plugin-store-fix;@layer solo-plugin-store-fix {[data-solo-plugin-card="true"] {filter: none !important;background: var(--lunatic-surface-2) !important;}[data-solo-plugin-card="true"]:is(:hover,:focus,:focus-visible,:active) {filter: none !important;background: var(--lunatic-surface-2) !important;}[data-solo-plugin-store="true"] {border-radius: 12px !important;background: #070709 !important;border: 1px solid rgba(255,255,255,.035) !important;}[data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root {color: rgba(255,255,255,.76) !important;}[data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root:hover {color: rgba(255,255,255,.96) !important;background: rgba(255,255,255,.07) !important;}[data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root.Mui-disabled,
  [data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root:disabled {color: rgba(255,255,255,.34) !important;}[data-solo-plugin-store-header="true"] > .MuiStack-root
    > button.MuiIconButton-root svg {color: inherit !important;fill: currentColor !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root::before {font-family: inherit !important;font-size: .78rem !important;font-weight: 400 !important;color: rgba(255,255,255,.62) !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    > .MuiOutlinedInput-root {background: var(--lunatic-surface-1) !important;}[data-solo-plugin-card="true"] > .MuiBox-root:first-child,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child {filter: none !important;}[data-solo-plugin-card="true"] > .MuiBox-root:first-child > *,
  [data-solo-plugin-card="true"]:hover > .MuiBox-root:first-child > * {filter: none !important;}[data-solo-plugin-title="true"] > a ~ * {font-size: 11px !important;}[data-solo-plugin-author="true"] {font-size: 12.48px !important;}[data-solo-plugin-author="true"] > p[name] {font-size: 12.48px !important;}.solo-plugin-generated-author {color: inherit !important;}#solo-plugin-store-description-popover {color: rgba(255,255,255,.92) !important;background: #151515 !important;border: 1px solid rgba(255,255,255,.11) !important;border-radius: 8px !important;box-shadow: 0 10px 28px rgba(0,0,0,.55) !important;font-size: 12.25px !important;}}[data-lunatic-settings-card="true"],
  [data-solo-plugin-store="true"],
  [data-solo-plugin-card="true"] {box-shadow: none !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    > .MuiOutlinedInput-root {background: var(--lunatic-surface-2) !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root
    .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.11) !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root:hover
    .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.18) !important;}[data-solo-plugin-store-controls="true"] > .MuiFormControl-root:focus-within
    .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.28) !important;}[data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root:not(.Mui-disabled) {color: rgba(255,255,255,.82) !important;}[data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root.Mui-disabled,
  [data-lunatic-installed-plugin-header-stack="true"]
    .MuiIconButton-root:disabled {color: rgba(255,255,255,.34) !important;}[data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root:not(.Mui-disabled) {filter: brightness(1.16) saturate(1.04) !important;}[data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root.Mui-disabled,
  [data-lunatic-installed-plugin-header-stack="true"]
    button.MuiIconButton-root:disabled {filter: none !important;}[data-lunatic-installed-plugin-title="true"]
    > span.MuiTypography-caption {color: inherit !important;}@layer solo-plugin-store-fix {[data-lunatic-installed-plugin-title="true"]
    > .MuiTypography-caption {font-size: .75rem !important;}}@layer solo-plugin-store-fix {[data-lunatic-themes-install-field="true"] .MuiOutlinedInput-root {background: var(--lunatic-surface-2) !important;}[data-lunatic-themes-install-field="true"] .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.11) !important;}[data-lunatic-themes-install-field="true"]:hover .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.18) !important;}[data-lunatic-themes-install-field="true"]:focus-within .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.28) !important;}[data-lunatic-theme-row="true"] {border-radius: 10px !important;background: var(--lunatic-surface-2) !important;box-shadow: none !important;}[data-lunatic-theme-url="true"] {color: inherit !important;}}@layer solo-plugin-store-fix {[data-lunatic-themes-install-field="true"] > .MuiInputLabel-root {font-size: .78rem !important;color: rgba(255,255,255,.62) !important;}[data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root {background: var(--lunatic-surface-2) !important;}[data-lunatic-themes-install-field="true"] .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.11) !important;}}@layer solo-plugin-store-fix {[data-lunatic-themes-install-field="true"] > .MuiInputLabel-root {font-size: .78rem !important;color: rgba(255,255,255,.62) !important;}[data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root {background: var(--lunatic-surface-2) !important;}[data-lunatic-themes-install-field="true"] .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.11) !important;}[data-lunatic-themes-install-field="true"]:hover .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.18) !important;}[data-lunatic-themes-install-field="true"]:focus-within .MuiOutlinedInput-notchedOutline {border-color: rgba(255,255,255,.28) !important;}[data-lunatic-theme-row="true"] {border: 0 !important;border-radius: 0 !important;background: transparent !important;box-shadow: none !important;}}@layer solo-plugin-store-fix {[data-lunatic-theme-reload="true"],
  [data-lunatic-theme-delete="true"],
  [data-lunatic-theme-action="true"] {color: rgba(255,255,255,.78) !important;filter: none !important;}[data-lunatic-theme-reload="true"]:hover,
  [data-lunatic-theme-delete="true"]:hover,
  [data-lunatic-theme-action="true"]:hover {color: rgba(255,255,255,.96) !important;background: rgba(255,255,255,.07) !important;}[data-lunatic-theme-reload="true"].Mui-disabled,
  [data-lunatic-theme-delete="true"].Mui-disabled,
  [data-lunatic-theme-action="true"].Mui-disabled,
  [data-lunatic-theme-reload="true"]:disabled,
  [data-lunatic-theme-delete="true"]:disabled,
  [data-lunatic-theme-action="true"]:disabled {color: rgba(255,255,255,.34) !important;}[data-lunatic-theme-reload="true"] svg,
  [data-lunatic-theme-delete="true"] svg,
  [data-lunatic-theme-action="true"] svg {color: inherit !important;fill: currentColor !important;}}@layer solo-plugin-store-fix {[data-lunatic-exact-supporter-section="sponsors"],
  [data-lunatic-exact-supporter-section="contributors"],
  [data-lunatic-exact-supporter-section="stargazers"],
  [data-lunatic-exact-supporter-stack="sponsors"],
  [data-lunatic-exact-supporter-stack="contributors"],
  [data-lunatic-exact-supporter-stack="stargazers"] {border: 0 !important;border-radius: 0 !important;background: transparent !important;box-shadow: none !important;}[data-lunatic-exact-supporter-grid="sponsors"],
  [data-lunatic-exact-supporter-grid="contributors"],
  [data-lunatic-exact-supporter-grid="stargazers"] {border: 1px solid rgba(255,255,255,.055) !important;border-radius: 10px !important;background: transparent !important;box-shadow: none !important;}[data-lunatic-exact-supporter-item="true"] {border: 1px solid rgba(255,255,255,.035) !important;border-radius: 8px !important;background: var(--lunatic-surface-2) !important;box-shadow: none !important;}}@layer solo-plugin-store-fix {:root {--lunatic-surface-0: var(--lunatic-glass-chrome, rgba(8,10,15,.74));--lunatic-surface-1: var(--lunatic-glass-surface, rgba(10,12,17,.54));--lunatic-surface-2: var(--lunatic-glass-control, rgba(11,13,18,.68));--lunatic-surface-3: rgba(255,255,255,.09);--lunatic-edge: rgba(255,255,255,.09);--lunatic-edge-strong: rgba(255,255,255,.14);}[data-lunatic-installed-plugin="true"] {background: var(--lunatic-surface-0) !important;border: 1px solid var(--lunatic-edge) !important;outline: 0 !important;box-shadow: none !important;}[data-lunatic-installed-plugin="true"]
    > :not([data-lunatic-installed-plugin-header="true"]) {border: 1px solid var(--lunatic-edge) !important;border-radius: 8px !important;background: var(--lunatic-surface-2) !important;box-shadow: none !important;}[data-lunatic-unified-input="true"] {background: var(--lunatic-surface-2) !important;box-shadow: none !important;}[data-lunatic-unified-input="true"]
    > .MuiOutlinedInput-notchedOutline {border-color: var(--lunatic-edge-strong) !important;box-shadow: none !important;}[data-lunatic-unified-input="true"].Mui-focused
    > .MuiOutlinedInput-notchedOutline {border-color: #3b4658 !important;}[data-lunatic-theme-card="true"] {background: var(--lunatic-surface-1) !important;border: 1px solid var(--lunatic-edge) !important;border-radius: 10px !important;box-shadow: none !important;}[data-lunatic-theme-header="true"],
  [data-lunatic-theme-row="true"] {background: transparent !important;}[data-lunatic-settings-card="true"],
  [data-lunatic-core-plugin="true"] {border: 1px solid var(--lunatic-edge) !important;box-shadow: none !important;}[data-lunatic-settings-card="true"]
    :is(
      [data-lunatic-feature-flag="true"],
      .MuiOutlinedInput-root,
      .MuiPaper-root
    ) {border-color: var(--lunatic-edge) !important;box-shadow: none !important;}[data-lunatic-client-updates-shell="true"],
  [data-lunatic-backup-settings-shell="true"],
  [data-lunatic-feature-flags-shell="true"],
  [data-lunatic-core-plugins-grid="true"] {border: 1px solid var(--lunatic-edge) !important;border-radius: 10px !important;background: transparent !important;box-shadow: none !important;}[data-lunatic-feature-flag="true"] {border: 1px solid var(--lunatic-edge) !important;box-shadow: none !important;}[data-lunatic-client-updates-shell="true"] .MuiOutlinedInput-root,
  [data-lunatic-backup-settings-shell="true"] .MuiOutlinedInput-root {background: var(--lunatic-surface-2) !important;}[data-lunatic-client-update-controls="true"] {border: 1px solid var(--lunatic-edge) !important;border-radius: 8px !important;background: var(--lunatic-surface-1) !important;box-shadow: none !important;}[data-lunatic-client-version-select="true"] {background: var(--lunatic-surface-3) !important;border-radius: 7px !important;box-shadow: none !important;}[data-lunatic-client-version-select="true"]
    > .MuiOutlinedInput-notchedOutline {border-color: var(--lunatic-edge-strong) !important;}[data-lunatic-client-version-select="true"]
    > .MuiSelect-select {background: transparent !important;color: #f0f0f2 !important;}[data-lunatic-client-version-select="true"].Mui-focused
    > .MuiOutlinedInput-notchedOutline {border-color: #3b4658 !important;}[data-lunatic-core-plugins-grid="true"] {background: transparent !important;}[data-lunatic-core-plugin="true"] {background: var(--lunatic-surface-1) !important;border: 1px solid var(--lunatic-edge) !important;box-shadow: none !important;}[data-lunatic-core-plugin-header="true"],
  [data-lunatic-core-plugin-header-stack="true"] {background: transparent !important;border: 0 !important;box-shadow: none !important;}.MuiBox-root[data-lunatic-core-plugin-content="true"] {background: var(--lunatic-surface-1) !important;border: 1px solid var(--lunatic-edge-strong) !important;border-radius: 9px !important;box-shadow: none !important;}[data-lunatic-core-settings-title="true"] {background: transparent !important;border: 0 !important;box-shadow: none !important;}.MuiBox-root[data-lunatic-core-plugin-content="true"]
    > .MuiStack-root[display="flex"],
  [data-lunatic-core-plugin-content="true"]
    .MuiStack-root[display="flex"] {background: transparent !important;border: 0 !important;box-shadow: none !important;}[data-lunatic-core-plugin-content="true"]
    .MuiStack-root[alignitems="center"] {background: transparent !important;border: 0 !important;border-top: 1px solid var(--lunatic-edge) !important;border-radius: 0 !important;box-shadow: none !important;}[data-lunatic-core-plugin-content="true"]
    .MuiStack-root[display="flex"]
    > .MuiStack-root[alignitems="center"]:first-child {border-top: 0 !important;}[data-lunatic-core-plugin-content="true"]
    .MuiStack-root[alignitems="center"]
    > .MuiBox-root[display="flex"] {background: transparent !important;border: 0 !important;box-shadow: none !important;}}@layer solo-plugin-store-fix {[data-lunatic-feature-flag="true"] {border-radius: 8px !important;background: var(--lunatic-surface-2) !important;}[data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root:not(.Mui-disabled) {color: rgba(255,255,255,.78) !important;filter: none !important;}[data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root:not(.Mui-disabled):hover {color: rgba(255,255,255,.96) !important;background: rgba(255,255,255,.07) !important;}[data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root.Mui-disabled,
  [data-lunatic-core-plugin-header-stack="true"]
    > button.MuiIconButton-root:disabled {color: rgba(255,255,255,.34) !important;filter: none !important;}[data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root svg,
  [data-lunatic-core-plugin-header-stack="true"] > button.MuiIconButton-root svg path {color: inherit !important;fill: currentColor !important;}}
@layer solo-plugin-store-fix {
  /* Input fills belong to the theme, never to Layout & UX. */
  [data-lunatic-core-plugin-content="true"] .MuiOutlinedInput-root,
  [data-lunatic-core-plugin-content="true"] .MuiInputBase-root,
  [data-lunatic-settings-card="true"] .MuiOutlinedInput-root {
    background: var(--lunatic-surface-2, #0c0c0f) !important;
  }

  /* Icon palette is explicitly visual. Geometry/transform locks stay in layout. */
  [data-lunatic-core-plugin="true"] .MuiIconButton-root:not(.Mui-disabled),
  [data-lunatic-settings-card="true"] .MuiIconButton-root:not(.Mui-disabled) {
    color: rgba(255,255,255,.82) !important;
  }

  [data-lunatic-core-plugin="true"] .MuiIconButton-root.Mui-disabled,
  [data-lunatic-settings-card="true"] .MuiIconButton-root.Mui-disabled {
    color: rgba(255,255,255,.34) !important;
  }
}

@layer solo-plugin-store-fix {
  /* Unified input decoration. No geometry here. */
  [data-lunatic-unified-input="true"] {
    background: var(--lunatic-surface-2, #0c0c0f) !important;
    box-shadow: none !important;
  }

  [data-lunatic-unified-input="true"] > .MuiOutlinedInput-notchedOutline {
    border-color: var(--lunatic-edge-strong, #24242b) !important;
    box-shadow: none !important;
  }

  [data-lunatic-unified-input="true"] .MuiInputBase-input {
    color: #bdbdbd !important;
  }
}

@layer solo-plugin-store-fix {
  /* Radiant preset controls use native Luna buttons; this only aligns their
     decoration with Lunatic when the visual theme is enabled. */
  [data-lunatic-installed-plugin-settings="true"]
    .MuiButton-root.MuiButton-outlined {
    border-color: var(--lunatic-edge-strong, rgba(255,255,255,.14)) !important;
    background: transparent !important;
  }

  [data-lunatic-installed-plugin-settings="true"]
    .MuiButton-root.MuiButton-contained {
    box-shadow: none !important;
  }
}


@layer solo-plugin-store-fix {
  /* ===== TIDALUNA SETTINGS — LUNATIC OWNED VISUAL SYSTEM =====
     These pages are Luna UI, not part of the inherited TIDAL visual basis.
     Layout markers are supplied by Layout & UX; this block restores the full
     Lunatic visual treatment independently of the clean TIDAL rewrite. */


  /* Plugin Store */
  [data-solo-plugin-store="true"] {
    background: var(--lunatic-luna-shell) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    box-shadow: none !important;
    -webkit-backdrop-filter: blur(18px) saturate(.82) !important;
    backdrop-filter: blur(18px) saturate(.82) !important;
  }

  [data-solo-plugin-card="true"],
  [data-solo-plugin-card="true"]:is(:hover,:focus,:focus-visible,:active) {
    background: var(--lunatic-luna-card) !important;
    border-color: var(--lunatic-luna-edge) !important;
    box-shadow: none !important;
    filter: none !important;
  }

  /* Installed Plugins — outer plugin card + its settings panel. */
  [data-lunatic-installed-plugin="true"] {
    background: var(--lunatic-luna-card) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    color: var(--lunatic-luna-text) !important;
    box-shadow: none !important;
  }

  [data-lunatic-installed-plugin="true"]
    > :not([data-lunatic-installed-plugin-header="true"]) {
    background: var(--lunatic-luna-inner) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: calc(var(--lunatic-luna-radius, 10px) * .8) !important;
    box-shadow: none !important;
  }

  [data-lunatic-installed-plugin-settings-shell="true"] {
    background: var(--lunatic-luna-inner) !important;
    border-color: var(--lunatic-luna-edge) !important;
    color: var(--lunatic-luna-text) !important;
  }

  [data-lunatic-installed-plugin-setting="true"] {
    color: var(--lunatic-luna-text) !important;
  }

  [data-lunatic-installed-plugin-setting-copy="true"] .MuiTypography-root:last-child,
  [data-lunatic-installed-plugin-author="true"],
  [data-solo-plugin-author="true"] {
    color: var(--lunatic-luna-muted) !important;
  }

  /* Themes */
  [data-lunatic-theme-card="true"] {
    background: var(--lunatic-luna-card) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    box-shadow: none !important;
  }

  [data-lunatic-theme-header="true"],
  [data-lunatic-theme-row="true"] {
    background: transparent !important;
  }

  /* Core plugins / Feature Flags / Client Updates / Backup. */
  [data-lunatic-core-plugin="true"] {
    background: var(--lunatic-luna-card) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    color: var(--lunatic-luna-text) !important;
    box-shadow: none !important;
  }

  .MuiBox-root[data-lunatic-core-plugin-content="true"] {
    background: var(--lunatic-luna-inner) !important;
    border: 1px solid var(--lunatic-luna-edge-strong) !important;
    border-radius: calc(var(--lunatic-luna-radius, 10px) * .9) !important;
    color: var(--lunatic-luna-text) !important;
    box-shadow: none !important;
  }

  [data-lunatic-feature-flags-shell="true"],
  [data-lunatic-client-updates-shell="true"],
  [data-lunatic-backup-settings-shell="true"],
  [data-lunatic-core-plugins-grid="true"] {
    background: rgba(7,9,13,.22) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    box-shadow: none !important;
  }

  [data-lunatic-feature-flag="true"],
  [data-lunatic-client-update-controls="true"] {
    background: var(--lunatic-luna-inner) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: calc(var(--lunatic-luna-radius, 10px) * .8) !important;
    color: var(--lunatic-luna-text) !important;
    box-shadow: none !important;
  }

  /* Supporters */
  [data-lunatic-exact-supporter-grid="sponsors"],
  [data-lunatic-exact-supporter-grid="contributors"],
  [data-lunatic-exact-supporter-grid="stargazers"] {
    background: rgba(7,9,13,.20) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
  }

  [data-lunatic-exact-supporter-item="true"] {
    background: var(--lunatic-luna-card) !important;
    border: 1px solid var(--lunatic-luna-edge) !important;
    border-radius: calc(var(--lunatic-luna-radius, 10px) * .8) !important;
    box-shadow: none !important;
  }

  /* Luna controls. This is deliberately scoped to Lunatic-marked settings so
     stock TIDAL controls are not recoloured globally. */
  :is(
    [data-lunatic-installed-plugin-settings="true"],
    [data-lunatic-core-plugin-content="true"],
    [data-lunatic-settings-card="true"],
    [data-lunatic-themes-install-field="true"],
    [data-solo-plugin-store-controls="true"],
    [data-lunatic-client-updates-shell="true"],
    [data-lunatic-backup-settings-shell="true"]
  ) .MuiOutlinedInput-root,
  [data-lunatic-unified-input="true"] {
    background: var(--lunatic-luna-control) !important;
    color: var(--lunatic-luna-text) !important;
    box-shadow: none !important;
  }

  :is(
    [data-lunatic-installed-plugin-settings="true"],
    [data-lunatic-core-plugin-content="true"],
    [data-lunatic-settings-card="true"],
    [data-lunatic-themes-install-field="true"],
    [data-solo-plugin-store-controls="true"],
    [data-lunatic-client-updates-shell="true"],
    [data-lunatic-backup-settings-shell="true"]
  ) .MuiOutlinedInput-notchedOutline,
  [data-lunatic-unified-input="true"] > .MuiOutlinedInput-notchedOutline {
    border-color: var(--lunatic-luna-edge-strong) !important;
  }

  :is(
    [data-lunatic-installed-plugin-settings="true"],
    [data-lunatic-core-plugin-content="true"],
    [data-lunatic-settings-card="true"],
    [data-lunatic-themes-install-field="true"],
    [data-solo-plugin-store-controls="true"]
  ) .MuiInputLabel-root {
    color: var(--lunatic-luna-muted) !important;
    -webkit-text-fill-color: currentColor !important;
  }

  :is(
    [data-lunatic-installed-plugin-settings="true"],
    [data-lunatic-core-plugin-content="true"],
    [data-lunatic-settings-card="true"]
  ) .MuiTypography-root {
    color: inherit;
  }

  :is(
    [data-lunatic-installed-plugin-header-stack="true"],
    [data-lunatic-core-plugin-header-stack="true"],
    [data-lunatic-settings-card="true"]
  ) .MuiIconButton-root:not(.Mui-disabled) {
    color: rgba(255,255,255,.82) !important;
  }

  :is(
    [data-lunatic-installed-plugin-header-stack="true"],
    [data-lunatic-core-plugin-header-stack="true"],
    [data-lunatic-settings-card="true"]
  ) .MuiIconButton-root:not(.Mui-disabled):hover {
    color: rgba(255,255,255,.98) !important;
    background: rgba(255,255,255,.07) !important;
  }

  :is(
    [data-lunatic-installed-plugin-header-stack="true"],
    [data-lunatic-core-plugin-header-stack="true"],
    [data-lunatic-settings-card="true"]
  ) .MuiIconButton-root.Mui-disabled {
    color: rgba(255,255,255,.34) !important;
  }

  /* Native Luna buttons inside plugin settings belong to the same material. */
  [data-lunatic-installed-plugin-settings="true"] .MuiButton-root {
    border-color: var(--lunatic-luna-edge-strong) !important;
    box-shadow: none !important;
  }

  [data-lunatic-installed-plugin-settings="true"] .MuiButton-root.MuiButton-outlined {
    background: rgba(255,255,255,.025) !important;
    color: var(--lunatic-luna-text) !important;
  }

  [data-lunatic-installed-plugin-settings="true"] .MuiButton-root.MuiButton-contained {
    background: rgba(255,255,255,.90) !important;
    color: #090a0d !important;
  }
}


@layer solo-plugin-store-fix {
  /* Supporters: keep section geometry untouched; only restore dense Lunatic
     surfaces to the actual grids/items instead of blacking out whole sections. */
  [data-lunatic-exact-supporter-section="sponsors"],
  [data-lunatic-exact-supporter-section="contributors"],
  [data-lunatic-exact-supporter-section="stargazers"],
  [data-lunatic-exact-supporter-stack="sponsors"],
  [data-lunatic-exact-supporter-stack="contributors"],
  [data-lunatic-exact-supporter-stack="stargazers"] {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  [data-lunatic-exact-supporter-grid="sponsors"],
  [data-lunatic-exact-supporter-grid="contributors"],
  [data-lunatic-exact-supporter-grid="stargazers"] {
    background: rgba(8,10,15,.92) !important;
    border: 1px solid var(--lunatic-luna-edge, rgba(255,255,255,.075)) !important;
    border-radius: var(--lunatic-luna-radius, 10px) !important;
    box-shadow: none !important;
  }

  [data-lunatic-exact-supporter-item="true"] {
    background: rgba(12,14,20,.96) !important;
    border: 1px solid var(--lunatic-luna-edge, rgba(255,255,255,.075)) !important;
    border-radius: calc(var(--lunatic-luna-radius, 10px) * .8) !important;
    box-shadow: none !important;
  }

  /* Canonical Luna input: Plugin Store is source of truth, Themes matches it. */
  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root > .MuiOutlinedInput-root,
  [data-lunatic-themes-install-field="true"] > .MuiOutlinedInput-root {
    background: var(--lunatic-luna-control, rgba(12,14,20,.92)) !important;
    color: var(--lunatic-luna-text, rgba(255,255,255,.94)) !important;
    box-shadow: none !important;
  }

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root .MuiOutlinedInput-notchedOutline,
  [data-lunatic-themes-install-field="true"] .MuiOutlinedInput-notchedOutline {
    border-color: var(--lunatic-luna-edge-strong, rgba(255,255,255,.13)) !important;
  }

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root:hover .MuiOutlinedInput-notchedOutline,
  [data-lunatic-themes-install-field="true"]:hover .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255,255,255,.18) !important;
  }

  [data-solo-plugin-store-controls="true"] > .MuiFormControl-root:focus-within .MuiOutlinedInput-notchedOutline,
  [data-lunatic-themes-install-field="true"]:focus-within .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255,255,255,.28) !important;
  }
}

`;
