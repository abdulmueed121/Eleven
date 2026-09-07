# Document navigation

Public pages intentionally use native anchors. On the deployed Vinext 1.0.0-beta.5 build, `next/link` intercepts ordinary left clicks and then throws a `TypeError` inside its client navigation handler. Prefetch also reports `RSC prefetch setup error`. The destination pages themselves load correctly through direct requests and new tabs.

Native anchors preserve same-tab navigation, keyboard activation, modified clicks, query parameters and browser history without relying on the failing client router. Page changes now request a full document. Stateful controls such as the mobile menu, accordions and project form still use React.

The `no-html-link-for-pages` lint exception is restricted to the six page components using this deliberate navigation approach. Keep other lint checks enabled. Before reintroducing client routing, verify an ordinary click against a production build, including Products → product detail → enquiry with the selected interest, footer legal links, and the mobile menu.
