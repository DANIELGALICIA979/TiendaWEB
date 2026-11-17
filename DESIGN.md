---
name: Cyber Void
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#f5fff3'
  on-secondary: '#003919'
  secondary-container: '#34ff8d'
  on-secondary-container: '#007239'
  tertiary: '#fdf2ff'
  on-tertiary: '#490080'
  tertiary-container: '#eacfff'
  on-tertiary-container: '#842bd2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#60ff99'
  secondary-fixed-dim: '#00e479'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Chivo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  code-key:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system targets competitive gamers, esports enthusiasts, and digital key traders who expect raw kinetic energy paired with surgical UI precision. The identity fuses high-octane cyberpunk futurism with refined, dark-mode ergonomics. 

The aesthetic marries deep obsidian voids with razor-sharp neon photon emission. Interfaces evoke futuristic command consoles, neural interfaces, and state-of-the-art gaming hardware dashboards. It avoids playful or cartoonish tropes in favor of an intense, premium, high-tech mood: ultra-precise, high-contrast, kinetic, and razor-sharp.

## Colors

The chromatic structure is built upon an uncompromising pitch-black baseline to maximize the luminescence of neon photon signals:

- **Base Void & Surfaces**: Canvas background sits at `#0a0a0f`. Layered surfaces scale upward into `#12121a` (cards, modules) and `#1a1a26` (elevated sheets, flyouts, active states). Hairline borders utilize low-opacity neon tints or stark `#262638`.
- **Electric Cyan (`#00f0ff`)**: The core interactive photon color. Used for primary CTAs, active focus indicators, and key touch targets. Mid-tone gradient stops use `#00b4d8`.
- **Cyber Emerald (`#00ff88`)**: Represents successful states, live streaming indicators, high-yield trade drops, and affirmative system actions. Supported by deep cyber green `#10b981`.
- **Ultraviolet Purple (`#a855f7`)**: Applied for premium rarity tiers, activation keys, elite rankings, and cosmetic unlocks. Paired with magenta-violet `#d946ef` for high-impact gradients.
- **Signal Statuses**: Critical warnings utilize hot crimson-orange (`#ff3366`), while alerts use electric amber (`#ffb703`).

## Typography

The typography scale balances geometric tech power with industrial terminal precision:

- **Display & Headlines (`Sora`)**: Sharp, architectural geometry with modern gaming authority. Headlines carry tight tracking for a locked-in, tactical appearance.
- **Body (`Chivo`)**: Neutral, angular grotesque that guarantees supreme legibility across dense spec sheets, chat logs, and game descriptions against dark backdrops.
- **System Labels, Platforms & Key Activation (`JetBrains Mono`)**: Monospaced, zero-ambiguity digital readout aesthetic. Used exclusively for alphanumeric platform tags (PC, PS5, XBOX, NSW), license keys, wallet balances, latency stats, and telemetry metrics. Uppercase transformation applied across platform chips and telemetry tokens.

## Layout & Spacing

A strictly disciplined mobile-first fluid layout based on a 4px/8px modular rhythm:

- **Grid Architecture**: Mobile screens utilize a 4-column layout with 12px (`gutter-mobile`) columns and 16px (`margin-mobile`) horizontal canvas protection. Tablet and hybrid gaming decks expand into an 8-column layout with 16px (`gutter`) columns and 20px outer margins.
- **Vertical Rhythm**: Content blocks adhere to dense stacking (`space-sm` to `space-md`) to ensure critical gaming inventory, telemetry stats, and transaction trays remain visible above the fold.
- **Touch Ergonomics**: All interactive elements maintain a minimum target size of 44x44px. Bottom app bars, key redeemers, and primary trigger buttons are pinned to thumb-reachable zones with bottom safe-area insets.

## Elevation & Depth

Visual hierarchy does not rely on diffused drop shadows, but instead uses light emissions, edge-glow highlights, and obsidian surface stratification:

- **Level 0 (Canvas Base)**: Pure void `#0a0a0f`. No elevation, pure black space.
- **Level 1 (Cybernetic Tiles & Modules)**: Background `#12121a` encased with a 1px border of `rgba(255, 255, 255, 0.07)`. In passive state, it blends into the matrix.
- **Level 2 (Interactive Floating Trays & Sheets)**: Background `#1a1a26` with a 1px border of `rgba(0, 240, 255, 0.25)`. Supported by an outer aura: `0 0 16px rgba(0, 240, 255, 0.12)`.
- **Level 3 (Focused & Active States)**: High-luminescence photonic glow. Borders sharpen to solid neon hues (`#00f0ff` or `#00ff88`) with dual-tier bloom shadows: `0 0 8px rgba(0, 240, 255, 0.4), 0 0 24px rgba(0, 240, 255, 0.2)`.
- **Glass Shards**: Overlays use `rgba(18, 18, 26, 0.8)` paired with `backdrop-filter: blur(16px)` and top-edge neon refraction lines (`border-top: 1px solid rgba(0, 240, 255, 0.4)`).

## Shapes

The design system embraces an aggressive, angular geometry. A base curvature of `roundedness: 1` (`0.25rem` / `4px`) gives surfaces a clipped, machined industrial finish rather than organic softness. 

- **Containers, Cards, Inputs**: `4px` corner radii reinforce high-tech tactical equipment casings.
- **Chips & Badges**: Retain strict geometric definition (`4px`), occasionally incorporating chamfered 45-degree corner clips on decorative card headers.
- **Pill Badges**: Platform identifiers (PS5, PC, Switch, Xbox) and live tags use encapsulated mini-capsules (`rounded-full` / `9999px`) to create functional distinction against rectilinear layout cards.

## Components

### Buttons
- **Primary Cyber Trigger**: Electric Cyan background (`#00f0ff`), pitch-black bold text (`#0a0a0f`), 4px border radius. Emits a continuous subtle pulse glow: `0 0 12px rgba(0, 240, 255, 0.35)`. Pressed state scales to `98%` with an emerald energy switch (`#00ff88`).
- **Secondary Ghost**: Transparent void, 1px border in `rgba(0, 240, 255, 0.4)`, cyan text. Hover/Tap activates `rgba(0, 240, 255, 0.08)` surface fill.
- **Ultraviolet Action**: Deep purple gradient (`#8b5cf6` to `#d946ef`) for VIP loot, premium subscriptions, and season passes.

### Platform Badges & Chips
- Miniature pills (`padding: 2px 8px`, `border-radius: 9999px`) utilizing `JetBrains Mono` at 10px uppercase.
- **PC**: Steel cyan border `rgba(0, 240, 255, 0.5)` with `rgba(0, 240, 255, 0.1)` tint.
- **PS5**: Pure cobalt white border `rgba(59, 130, 246, 0.6)` with deep blue tint.
- **Xbox**: Cyber emerald border `rgba(0, 255, 136, 0.5)` with neon green glow.
- **Switch**: Signal crimson border `rgba(255, 51, 102, 0.6)` with red sub-glow.

### Cybernetic Cards
- Surface background `#12121a` framed by 1px hairline border `#262638`.
- Includes an absolute-positioned 1px glowing accent line along the top border using linear gradients (e.g., cyan fading to transparent).
- Inner contents feature metadata readouts set in `JetBrains Mono` and game titles in `Sora`.

### Digital Key Reveal Module
- Security-locked display box set in `#0a0a0f` with a dashed border (`#a855f7`).
- Features a monospaced voucher layout (`XXXX-XXXX-XXXX-XXXX`) equipped with a single-tap "Copy to Neural Link" neon trigger button, providing instantaneous haptic and emerald flash feedback.

### Form Inputs & Search
- Inputs sit on `#12121a` with inset dark shadow, framed by a muted border (`rgba(255, 255, 255, 0.12)`).
- On focus, transitions dynamically to cyan glow border with `0 0 10px rgba(0, 240, 255, 0.25)`.
- Placeholder text in muted tactical slate (`#64748b`), active text in crisp luminescent white (`#f8fafc`).

### Selection Controls (Checkboxes & Radios)
- Sharp 2px rounded checkboxes and circular radios edged with `#262638`.
- Checked state fills with `#00ff88`, showcasing pitch-black icons backed by an emerald photon glow.