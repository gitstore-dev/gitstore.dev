# GitStore.dev Landing Page Design System

**Version**: 1.0.0
**Date**: 2026-03-27
**Feature**: Coming Soon Landing Page

---

## Design Principles

1. **Technical Clarity**: Communicate git-optimized e-commerce value proposition instantly
2. **Developer-First Aesthetic**: Clean, minimal, code-inspired visual language
3. **Dual Audience Balance**: Primary technical messaging with subtle business-user hints
4. **Speed & Performance**: Lightweight design, system fonts, minimal assets

---

## Colors

### Primary Palette

```css
--color-primary: #2563eb;      /* Blue 600 - CTAs, links, brand */
--color-primary-dark: #1e40af; /* Blue 700 - Hover states */
--color-primary-light: #dbeafe; /* Blue 50 - Subtle backgrounds */
```

**Usage**: Primary blue for call-to-action button, GitHub icon, and interactive elements. Evokes trust, technology, and reliability.

### Neutral Palette

```css
--color-neutral-900: #111827;  /* Gray 900 - Headings */
--color-neutral-700: #374151;  /* Gray 700 - Body text */
--color-neutral-400: #9ca3af;  /* Gray 400 - Placeholders, muted text */
--color-neutral-100: #f3f4f6;  /* Gray 100 - Input backgrounds */
--color-neutral-50: #f9fafb;   /* Gray 50 - Page background */
--color-white: #ffffff;        /* White - Cards, inputs */
```

**Usage**: Neutral grays for typography hierarchy, backgrounds, and borders. High contrast for readability.

### Semantic Colors

```css
--color-success: #10b981;      /* Green 500 - Success messages */
--color-error: #ef4444;        /* Red 500 - Error messages */
--color-accent: #8b5cf6;       /* Purple 500 - Secondary accents (optional) */
```

**Usage**: Success green for form confirmation, error red for validation feedback.

---

## Typography

### Font Families

```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

**Strategy**: Use system font stack for MVP (zero latency). If web fonts needed, load Inter from Google Fonts with `font-display: swap`.

### Type Scale

```css
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Input text, captions */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body, subheadings */
--text-xl: 1.25rem;    /* 20px - Section headings */
--text-2xl: 1.5rem;    /* 24px - Page titles (mobile) */
--text-3xl: 1.875rem;  /* 30px - Page titles (tablet) */
--text-4xl: 2.25rem;   /* 36px - Hero heading (mobile) */
--text-5xl: 3rem;      /* 48px - Hero heading (desktop) */
--text-6xl: 3.75rem;   /* 60px - Hero heading (large desktop) */
```

### Font Weights

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;     /* Headings */
--leading-normal: 1.5;     /* Body text */
--leading-relaxed: 1.75;   /* Large body text */
```

---

## Spacing

**Base Unit**: 4px (0.25rem)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Usage Guidelines**:
- Component padding: `--space-4` to `--space-6`
- Section spacing: `--space-12` to `--space-20`
- Hero top margin: `--space-16` to `--space-24`

---

## Layout

### Container

```css
--container-max-width: 1280px;  /* Max content width */
--container-padding: 1.5rem;    /* Horizontal padding (mobile) */
--container-padding-lg: 2rem;   /* Horizontal padding (desktop) */
```

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
```

**Mobile-First Approach**: Design for 375px width first, enhance for larger screens.

---

## Components

### Hero Section

**Purpose**: Display "Coming Soon" message and core value proposition

**Layout**:
- Centered vertical layout
- Max width: 800px
- Padding: `--space-16` top, `--space-12` bottom (mobile)
- Padding: `--space-24` top, `--space-16` bottom (desktop)

**Elements**:
1. **"Coming Soon" Badge**:
   - Background: `--color-primary-light`
   - Text: `--color-primary`
   - Padding: `--space-2` horizontal, `--space-1` vertical
   - Border radius: `9999px` (pill shape)
   - Font: `--text-sm`, `--font-semibold`, uppercase
   - Margin bottom: `--space-6`

2. **Heading**:
   - Text: "GitStore"
   - Font: `--text-5xl` (mobile), `--text-6xl` (desktop)
   - Weight: `--font-bold`
   - Color: `--color-neutral-900`
   - Margin bottom: `--space-4`

3. **Subheading**:
   - Text: "Manage your store like code"
   - Font: `--text-xl` (mobile), `--text-2xl` (desktop)
   - Weight: `--font-medium`
   - Color: `--color-neutral-700`
   - Margin bottom: `--space-3`

4. **Value Proposition**:
   - Text: "An e-commerce engine optimized for git operations. Branch, merge, and roll back product catalog changes with git workflows."
   - Font: `--text-base`, `--text-lg` (desktop)
   - Weight: `--font-regular`
   - Color: `--color-neutral-700`
   - Line height: `--leading-relaxed`
   - Max width: 600px
   - Margin bottom: `--space-4`

5. **Audience Tag**:
   - Text: "Built for developers, AI agents, and store operators"
   - Font: `--text-sm`
   - Weight: `--font-medium`
   - Color: `--color-neutral-400`
   - Margin bottom: `--space-12`

---

### Email Signup Form

**Purpose**: Capture early adopter email addresses

**Layout**:
- Max width: 500px
- Margin: `0 auto`
- Background: `--color-white`
- Padding: `--space-8`
- Border radius: `0.75rem`
- Box shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

**Elements**:
1. **Form Label**:
   - Text: "Get notified at launch"
   - Font: `--text-lg`
   - Weight: `--font-semibold`
   - Color: `--color-neutral-900`
   - Margin bottom: `--space-2`

2. **Email Input**:
   - Width: 100%
   - Height: `3rem` (48px)
   - Padding: `--space-3` horizontal
   - Border: `2px solid --color-neutral-100`
   - Border radius: `0.5rem`
   - Font: `--text-base`
   - Placeholder: "your@email.com"
   - Placeholder color: `--color-neutral-400`
   - Focus state:
     - Border color: `--color-primary`
     - Outline: `2px solid --color-primary-light`
   - Error state:
     - Border color: `--color-error`

3. **Submit Button**:
   - Width: 100%
   - Height: `3rem` (48px)
   - Margin top: `--space-4`
   - Background: `--color-primary`
   - Color: `--color-white`
   - Font: `--text-base`
   - Weight: `--font-semibold`
   - Border radius: `0.5rem`
   - Cursor: pointer
   - Hover state:
     - Background: `--color-primary-dark`
   - Disabled state:
     - Background: `--color-neutral-400`
     - Cursor: not-allowed

4. **Honeypot Field**:
   - Hidden via CSS: `position: absolute; left: -5000px`
   - Name: `_gotcha`
   - Tabindex: `-1`
   - Autocomplete: `off`

5. **Success Message**:
   - Background: `color-mix(in srgb, var(--color-success) 10%, white)`
   - Border: `1px solid var(--color-success)`
   - Padding: `--space-4`
   - Border radius: `0.5rem`
   - Font: `--text-sm`
   - Color: `--color-success`
   - Icon: Checkmark (optional)

6. **Error Message**:
   - Background: `color-mix(in srgb, var(--color-error) 10%, white)`
   - Border: `1px solid var(--color-error)`
   - Padding: `--space-4`
   - Border radius: `0.5rem`
   - Font: `--text-sm`
   - Color: `--color-error`

---

### GitHub Link

**Purpose**: Link to open-source repository

**Layout**:
- Margin top: `--space-12`
- Text align: center

**Elements**:
1. **Link Text**:
   - Text: "View on GitHub"
   - Font: `--text-base`
   - Weight: `--font-medium`
   - Color: `--color-primary`
   - Display: inline-flex
   - Align items: center
   - Gap: `--space-2`
   - Hover state:
     - Color: `--color-primary-dark`
     - Text decoration: underline

2. **GitHub Icon**:
   - SVG icon (inline)
   - Size: `1.25rem` (20px)
   - Color: currentColor (inherits from link)

---

### Footer (Optional)

**Purpose**: Copyright and additional links

**Layout**:
- Margin top: `--space-20`
- Padding top: `--space-8`
- Border top: `1px solid --color-neutral-100`
- Text align: center

**Elements**:
- Text: "© 2026 GitStore. Open source e-commerce for git workflows."
- Font: `--text-sm`
- Color: `--color-neutral-400`

---

## Interactions

### Button Hover

```css
transition: background-color 150ms ease-in-out;
```

### Input Focus

```css
transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;
```

### Form Submit States

1. **Idle**: Button enabled, label "Sign up"
2. **Submitting**: Button disabled, label "Sending..."
3. **Success**: Form hidden, success message displayed
4. **Error**: Error message displayed below form, button enabled

---

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum for body, 3:1 for large text)
- Primary blue (#2563eb) on white: 4.56:1 ✅
- Neutral 700 (#374151) on white: 10.76:1 ✅

### Focus States

- Visible focus indicators on all interactive elements
- Focus ring: `2px solid --color-primary-light`
- Skip link for keyboard navigation (optional for single page)

### Form Labels

- All inputs have associated `<label>` elements
- Error messages linked via `aria-describedby`

### Semantic HTML

- Use `<main>`, `<section>`, `<form>`, `<button>` elements
- Heading hierarchy: `<h1>` for "GitStore", no nested headings

---

## Responsive Behavior

### Mobile (< 640px)

- Single column layout
- Hero heading: `--text-4xl`
- Form width: 100% (minus container padding)
- Container padding: `--space-6`

### Tablet (640px - 1024px)

- Hero heading: `--text-5xl`
- Form max-width: 500px
- Container padding: `--space-8`

### Desktop (> 1024px)

- Hero heading: `--text-6xl`
- Max content width: 800px for hero, centered
- Container padding: `--space-12`

---

## Assets

### Favicon

- Format: ICO or PNG
- Size: 32x32px, 16x16px
- Design: Simplified "G" lettermark or git branch icon
- Color: `--color-primary`

### Open Graph Image

- Format: PNG
- Size: 1200x630px
- Design: Hero text + subtle background pattern
- Include: "GitStore - E-commerce for Git Workflows"

### GitHub Icon SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
</svg>
```

---

## Implementation Notes

### TailwindCSS Configuration

Map design tokens to Tailwind config:

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#dbeafe',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          400: '#9ca3af',
          700: '#374151',
          900: '#111827',
        },
        success: '#10b981',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
};
```

### Google Stitch Export

1. Create project in Stitch with above design system
2. Generate hero section component
3. Generate form component
4. Export as HTML + Tailwind classes
5. Integrate into `index.html`

---

## Version History

- **1.0.0** (2026-03-27): Initial design system for coming soon landing page
