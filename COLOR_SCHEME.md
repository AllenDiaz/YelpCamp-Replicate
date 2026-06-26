# YelpCamp Color Scheme Documentation

## Overview

This document describes the cohesive color scheme implemented across the YelpCamp application. The color system uses CSS custom properties (CSS variables) integrated with Tailwind CSS v4 for a consistent, maintainable, and theme-ready design.

## Color Philosophy

The color scheme is inspired by the outdoor camping theme:
- **Primary (Teal/Green)**: Represents nature, outdoor activities, and the camping experience
- **Secondary (Slate/Blue-Gray)**: Provides professional, neutral UI elements
- **Accent (Amber/Orange)**: Evokes campfire warmth and calls-to-action

## Color Palette

### Primary Colors (Teal/Green - Nature Theme)
Represents outdoor activities, nature, and success states.

| Variable | Hex | Usage |
|----------|-----|-------|
| `primary-50` | #f0fdfa | Very light backgrounds |
| `primary-100` | #ccfbf1 | Light backgrounds |
| `primary-200` | #99f6e4 | Subtle highlights |
| `primary-300` | #5eead4 | Hover states (dark mode) |
| `primary-400` | #2dd4bf | Active states |
| `primary-500` | #14b8a6 | Default accent |
| `primary-600` | #0d9488 | **Primary brand color** (buttons, links) |
| `primary-700` | #0f766e | Hover states |
| `primary-800` | #115e59 | Pressed states |
| `primary-900` | #134e4a | Text on light backgrounds |

**Tailwind Classes**: `bg-primary-600`, `text-primary-700`, `border-primary-500`, etc.

### Secondary Colors (Slate - Neutral UI)
Used for navigation, text, borders, and neutral UI elements.

| Variable | Hex | Usage |
|----------|-----|-------|
| `secondary-50` | #f8fafc | Light page backgrounds |
| `secondary-100` | #f1f5f9 | Subtle backgrounds |
| `secondary-200` | #e2e8f0 | Disabled states |
| `secondary-300` | #cbd5e1 | Borders, dividers |
| `secondary-400` | #94a3b8 | Placeholder text |
| `secondary-500` | #64748b | Secondary text |
| `secondary-600` | #475569 | Body text |
| `secondary-700` | #334155 | **Primary text color** |
| `secondary-800` | #1e293b | **Dark backgrounds** (navbar, footer) |
| `secondary-900` | #0f172a | Darkest backgrounds |

**Tailwind Classes**: `bg-secondary-800`, `text-secondary-700`, `border-secondary-300`, etc.

### Accent Colors (Amber/Orange - Campfire Theme)
Used for warning states, destructive actions, and special highlights.

| Variable | Hex | Usage |
|----------|-----|-------|
| `accent-50` | #fffbeb | Light backgrounds |
| `accent-100` | #fef3c7 | Subtle highlights |
| `accent-200` | #fde68a | Badges |
| `accent-300` | #fcd34d | Warning backgrounds |
| `accent-400` | #fbbf24 | Active states |
| `accent-500` | #f59e0b | **Default accent** |
| `accent-600` | #d97706 | Logout buttons, warnings |
| `accent-700` | #b45309 | Hover states |
| `accent-800` | #92400e | Pressed states |
| `accent-900` | #78350f | Dark text |

**Tailwind Classes**: `bg-accent-600`, `text-accent-500`, `border-accent-400`, etc.

### Semantic Colors
Pre-defined colors for specific UI states.

| Variable | Hex | Usage | Tailwind Class |
|----------|-----|-------|---------------|
| `success` | #10b981 | Success messages, confirmations | `bg-success` |
| `error` | #ef4444 | Error messages, validation | `bg-error` |
| `warning` | #f59e0b | Warning messages | `bg-warning` |
| `info` | #3b82f6 | Information messages | `bg-info` |

### Surface & Layout Colors

| Variable | Value (Light) | Value (Dark) | Usage |
|----------|--------------|--------------|-------|
| `surface` | #ffffff | #1e293b | Card backgrounds |
| `surface-hover` | #f9fafb | #334155 | Hover states |
| `border` | #e5e7eb | #334155 | Default borders |
| `border-hover` | #d1d5db | #475569 | Hover borders |
| `background` | #ffffff | #0f172a | Page background |
| `foreground` | #1f2937 | #f1f5f9 | Primary text |

## Component Usage

### Buttons

```tsx
// Primary action button
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Submit
</button>

// Secondary/Cancel button
<button className="bg-secondary-300 hover:bg-secondary-400 text-secondary-700">
  Cancel
</button>

// Destructive action (logout, delete)
<button className="bg-accent-600 hover:bg-accent-700 text-white">
  Delete
</button>
```

### Form Elements

```tsx
// Input field
<input 
  className="border-border focus:ring-primary-500 focus:border-primary-500"
/>

// Error state
<input 
  className="border-error focus:ring-error"
/>

// Label
<label className="text-secondary-700">Username</label>

// Error message
<p className="text-error">This field is required</p>
```

### Cards

```tsx
<div className="bg-surface border border-border rounded-lg shadow-md hover:shadow-lg">
  <h2 className="text-secondary-800">Card Title</h2>
  <p className="text-secondary-600">Card content</p>
</div>
```

### Navigation

```tsx
// Navbar
<nav className="bg-secondary-800 text-white">
  <a className="hover:text-primary-300">Home</a>
</nav>

// Footer
<footer className="bg-secondary-800 text-secondary-300">
  © 2024 YelpCamp
</footer>
```

### Toast Notifications

```tsx
// Success toast
<div className="bg-success text-white">Success message</div>

// Error toast
<div className="bg-error text-white">Error message</div>
```

## Dark Mode Support

The color scheme includes dark mode support via the `prefers-color-scheme` media query. Dark mode automatically adjusts:

- Background: White → Dark slate
- Foreground: Dark gray → Light gray
- Primary: Teal-600 → Teal-400 (lighter for better contrast)
- Secondary: Slate-700 → Slate-300
- Accent: Amber-500 → Amber-400
- Surface: White → Dark slate
- Borders: Light gray → Medium slate

## Implementation Details

### CSS Custom Properties (globals.css)

All colors are defined as CSS custom properties in `app/globals.css`:

```css
:root {
  --primary-600: #0d9488;
  --secondary-800: #1e293b;
  /* ... more colors */
}
```

### Tailwind CSS v4 Integration

Colors are exposed to Tailwind via the `@theme inline` directive:

```css
@theme inline {
  --color-primary-600: var(--primary-600);
  --color-secondary-800: var(--secondary-800);
  /* ... more mappings */
}
```

### Usage in Components

Components use Tailwind classes that reference the custom colors:

```tsx
<button className="bg-primary-600 hover:bg-primary-700">
  Click me
</button>
```

## Benefits

1. **Consistency**: Single source of truth for all colors
2. **Maintainability**: Change colors in one place (`globals.css`)
3. **Theme Support**: Easy to add themes or dark mode variations
4. **Type Safety**: Tailwind provides autocomplete for color classes
5. **Performance**: CSS variables are highly performant
6. **Accessibility**: Carefully chosen color contrasts for WCAG compliance
7. **Branding**: Cohesive outdoor/camping theme throughout the app

## Migration Notes

All existing color classes have been updated:
- `bg-blue-*` → `bg-primary-*`
- `bg-green-*` → `bg-primary-*`
- `bg-red-*` → `bg-error` or `bg-accent-*`
- `bg-gray-*` → `bg-secondary-*` or `bg-surface`
- `text-gray-*` → `text-secondary-*`
- `border-gray-*` → `border-border`
- `focus:ring-blue-*` → `focus:ring-primary-*`

## Future Enhancements

- [ ] Add theme switcher component
- [ ] Implement additional theme variants (forest, desert, beach)
- [ ] Add gradient utilities for hero sections
- [ ] Create color palette documentation page in the app
- [ ] Add accessibility contrast checker
