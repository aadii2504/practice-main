# App.css - Complete Explanation

## File Location

`src/App.css`

---

## Overview

This file defines the **global theme system** using CSS variables for dark/light modes and animations.

---

## Line-by-Line Breakdown

### Line 1: TailwindCSS Import

```css
@import "tailwindcss";
```

**Explanation:**

- Imports TailwindCSS utility classes
- Must be first line
- Enables all Tailwind classes like `px-4`, `flex`, `text-white`, etc.

---

### Lines 4-9: Light Mode (Default Theme)

```css
:root {
  --bg: #f8fafc; /* light background */
  --text: #0f172a; /* light text */
  --card: rgba(255, 255, 255, 0.75);
  --border: rgba(17, 24, 39, 0.12);
}
```

**`:root` selector:**

- Applies to entire document
- Highest specificity for CSS variables
- Default theme (light mode)

**CSS Variables:**

| Variable   | Value                    | Purpose          | Appearance              |
| ---------- | ------------------------ | ---------------- | ----------------------- |
| `--bg`     | `#f8fafc`                | Page background  | Very light gray         |
| `--text`   | `#0f172a`                | Text color       | Almost black            |
| `--card`   | `rgba(255,255,255,0.75)` | Card backgrounds | Semi-transparent white  |
| `--border` | `rgba(17,24,39,0.12)`    | Border colors    | Light gray, 12% opacity |

**Why `rgba()`?**

- Allows transparency
- `rgba(255,255,255,0.75)` = white at 75% opacity
- Creates glassmorphism effect (see-through cards)

---

### Lines 11-17: Dark Mode Theme

```css
[data-theme="dark"] {
  --bg: radial-gradient(
    1200px 600px at 25% -10%,
    #0b1b3a 0%,
    #0d1221 40%,
    #080c17 100%
  );
  --text: #e7e9ee;
  --card: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.1);
}
```

**`[data-theme="dark"]` selector:**

- Applies when `<body>` or `<html>` has attribute `data-theme="dark"`
- Overrides `:root` variables

**Dark Theme Variables:**

| Variable   | Value                    | Purpose                    |
| ---------- | ------------------------ | -------------------------- |
| `--bg`     | `radial-gradient(...)`   | Gradient background        |
| `--text`   | `#e7e9ee`                | Light text for dark bg     |
| `--card`   | `rgba(255,255,255,0.06)` | Very subtle white cards    |
| `--border` | `rgba(255,255,255,0.10)` | White borders, 10% opacity |

**Radial Gradient Breakdown:**

```css
radial-gradient(
  1200px 600px       /* Ellipse size: width height */
  at 25% -10%,       /* Position: horizontal vertical */
  #0b1b3a 0%,        /* Start color: Dark blue */
  #0d1221 40%,       /* Middle color: Navy */
  #080c17 100%       /* End color: Almost black */
)
```

**Visual Effect:**

- Creates circular/elliptical gradient
- Center is lighter (`#0b1b3a`)
- Edges are darker (`#080c17`)
- Positioned at 25% from left, -10% from top (off-screen)
- Mimics 100xDevs dark theme

---

### Lines 20-24: App Shell Wrapper

```css
.app-shell {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}
```

**`.app-shell` class:**

- Applied to root div in App.jsx
- Ensures full viewport height
- Uses CSS variables for theme

**Properties:**

| Property     | Value         | Purpose                      |
| ------------ | ------------- | ---------------------------- |
| `min-height` | `100vh`       | Minimum 100% viewport height |
| `background` | `var(--bg)`   | Uses theme background        |
| `color`      | `var(--text)` | Uses theme text color        |

**Why `var(--bg)`?**

- `var()` reads CSS variable value
- Automatically updates when theme changes
- In light mode: `var(--bg)` → `#f8fafc`
- In dark mode: `var(--bg)` → `radial-gradient(...)`

---

### Lines 27-30: Marquee Animation

```css
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

**`@keyframes` definition:**

- Defines animation steps
- `marquee` is the animation name

**Animation steps:**

- `0%`: Start at original position (`translateX(0)`)
- `100%`: Move left by 50% (`translateX(-50%)`)

**Effect:**

- Slides element from right to left
- `-50%` means it moves left by half its width

```css
.marquee {
  animation: marquee 28s linear infinite;
}
```

**`.marquee` class:**

- Applies the animation to elements

**Animation properties:**

- `marquee` - Use the keyframes above
- `28s` - Duration: 28 seconds for one loop
- `linear` - Constant speed (no easing)
- `infinite` - Never stop, loop forever

**Usage example:**

```html
<div class="marquee">
  <span>This text scrolls continuously</span>
  <span>This text scrolls continuously</span>
</div>
```

---

### Lines 35-37: Shimmer Animation

```css
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
```

**Shimmer effect:**

- Used for skeleton loaders
- Slides highlight across element

**Only defines end state:**

- `0%`: Implicit start at `translateX(0)`
- `100%`: Move right by 100%

**Typical usage:**

```css
.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

### Lines 40-41: Hide Scrollbar

```css
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**`.hide-scrollbar` utility:**

- Hides scrollbar but keeps scroll functionality

**Three browser prefixes:**

1. **Webkit** (Chrome, Safari, Edge):

```css
::-webkit-scrollbar {
  display: none;
}
```

2. **IE/Edge (old)**:

```css
-ms-overflow-style: none;
```

3. **Firefox**:

```css
scrollbar-width: none;
```

**Usage:**

```html
<div class="overflow-x-auto hide-scrollbar">
  <!-- Scrollable content without visible scrollbar -->
</div>
```

---

## How Themes Work

### Theme Toggle Implementation (not in this file):

**In JavaScript:**

```javascript
// Set dark theme
document.documentElement.setAttribute("data-theme", "dark");

// Set light theme
document.documentElement.setAttribute("data-theme", "light");
// or remove attribute to use :root defaults
document.documentElement.removeAttribute("data-theme");
```

### CSS Variable Usage in Components:

**In JSX:**

```javascript
<div
  style={{
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  }}
>
  Card content
</div>
```

**In Tailwind (custom classes):**

```html
<div class="bg-[var(--card)] border-[var(--border)] text-[var(--text)]">
  Themed element
</div>
```

---

## Interview Questions

### Q1: Why use CSS variables instead of Tailwind's dark mode?

**Answer:**
"CSS variables provide more flexibility and granular control:

1. **Runtime switching**: Can change themes without rebuilding
2. **Gradients**: Can use complex backgrounds like radial-gradient
3. **Transparency**: Easy rgba() values for glassmorphism
4. **No class duplication**: Don't need `dark:bg-slate-900` on every element
5. **Shared values**: Same variable used in multiple places

With Tailwind dark mode, you'd need:

```html
<div class="bg-white dark:bg-slate-900 text-black dark:text-white"></div>
```

With CSS variables:

```html
<div class="bg-[var(--bg)] text-[var(--text)]"></div>
```

Much cleaner!"

### Q2: Explain how the marquee animation works

**Answer:**
"The marquee animation creates an infinite scrolling effect:

```css
@keyframes marquee {
  0% {
    transform: translateX(0);
  } /* Start position */
  100% {
    transform: translateX(-50%);
  } /* End position */
}
```

It moves the element left by 50% of its width over 28 seconds, then loops. To create seamless scrolling, you typically duplicate the content:

```html
<div class="marquee">
  <span>Text Text Text</span>
  <span>Text Text Text</span>
  <!-- Duplicate for seamless loop -->
</div>
```

When the first copy moves 50% left, the second copy appears from the right, creating continuous motion."

### Q3: What is the radial-gradient doing in dark mode?

**Answer:**
"The radial-gradient creates a subtle circular glow effect:

```css
radial-gradient(
  1200px 600px at 25% -10%,  /* Big ellipse, positioned off top-left */
  #0b1b3a 0%,                /* Lighter blue in center */
  #0d1221 40%,               /* Medium dark */
  #080c17 100%               /* Darkest at edges */
)
```

This mimics modern dark mode UIs (like 100xDevs, Linear, Vercel) where the background has depth rather than being flat black. The center is subtly lighter, drawing attention without being bright."

### Q4: How do you switch between themes?

**Answer:**
"You toggle the `data-theme` attribute on the document:

```javascript
// Switch to dark
document.documentElement.setAttribute("data-theme", "dark");

// Switch to light
document.documentElement.removeAttribute("data-theme");
```

When `data-theme='dark'`, CSS applies the `[data-theme='dark']` rules which override the `:root` variables. All components using `var(--bg)`, `var(--text)`, etc. automatically update without needing prop changes or re-renders."

---

## Theme Variable Reference

### Usage in Your Code:

```javascript
// Correct:
style={{ background: 'var(--card)' }}
className="bg-[var(--card)]"

// Wrong (hardcoded):
style={{ background: 'white' }}
className="bg-white"
```

### All Available Variables:

| Variable   | Light Mode | Dark Mode | Use For           |
| ---------- | ---------- | --------- | ----------------- |
| `--bg`     | Light gray | Gradient  | Page background   |
| `--text`   | Dark       | Light     | All text          |
| `--card`   | White 75%  | White 6%  | Card backgrounds  |
| `--border` | Dark 12%   | White 10% | Borders, dividers |

---

## Summary

**This file provides:**

1. ✅ TailwindCSS integration
2. ✅ Light/dark theme system via CSS variables
3. ✅ Smooth marquee animation for scrolling text
4. ✅ Shimmer effect for loading states
5. ✅ Utility to hide scrollbars

**Key concept:** CSS variables + `data-theme` attribute = Flexible theming system
