export const lunaticPluginStoreUxCss = String.raw`
@layer lunatic-stable-tint, solo-plugin-store-fix;@layer solo-plugin-store-fix {[data-solo-plugin-card="true"] > [data-solo-original-action="true"] {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }.solo-plugin-store-real-action {
    position: absolute !important;
    z-index: 20 !important;
    right: 20px !important;
    bottom: 16px !important;

    min-width: 84px !important;
    height: 32px !important;
    box-sizing: border-box !important;
    padding: 6px 13px !important;

    border: 1px solid rgba(255,255,255,.17) !important;
    border-radius: 7px !important;
    background: rgba(255,255,255,.065) !important;
    color: inherit !important;

    font: inherit !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    line-height: 18px !important;
    text-align: center !important;

    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    cursor: pointer !important;
  }.solo-plugin-store-real-action[data-solo-action-kind="install"] {
    background: #fafafa !important;
    color: #19191b !important;
    border-color: #fafafa !important;
  }.solo-plugin-store-real-action[data-solo-action-kind="install"]:hover {
    background: #ffffff !important;
    color: #19191b !important;
    border-color: #ffffff !important;
  }.solo-plugin-store-real-action[data-solo-action-kind="uninstall"] {
    background: rgba(255,255,255,.065) !important;
    color: inherit !important;
    border-color: rgba(255,255,255,.17) !important;
  }.solo-plugin-store-real-action[data-solo-action-kind="uninstall"]:hover {
    background: rgba(255,255,255,.12) !important;
    border-color: rgba(255,255,255,.29) !important;
  }.solo-plugin-store-real-action:focus-visible {
    outline: 2px solid rgba(255,255,255,.28) !important;
    outline-offset: 2px !important;
  }.solo-plugin-store-real-action[data-solo-busy="true"] {
    opacity: .55 !important;
    cursor: wait !important;
  }}
`;
