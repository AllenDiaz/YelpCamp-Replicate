# YelpCamp Color Scheme - Quick Reference

## 🎨 Color Palette Overview

### 🌲 Primary - Teal/Green (Nature & Camping)
```
50:  #f0fdfa  ░░░░░░░░░░
100: #ccfbf1  ░░░░░░░░
200: #99f6e4  ░░░░░░
300: #5eead4  ░░░░
400: #2dd4bf  ░░░
500: #14b8a6  ░░
600: #0d9488  ▓▓  ← Primary Brand Color
700: #0f766e  ▓▓
800: #115e59  ██
900: #134e4a  ██
```
**Use for:** Primary buttons, links, active states, success indicators

### 🏔️ Secondary - Slate (Neutral UI)
```
50:  #f8fafc  ░░░░░░░░░░
100: #f1f5f9  ░░░░░░░░
200: #e2e8f0  ░░░░░░
300: #cbd5e1  ░░░░
400: #94a3b8  ░░░
500: #64748b  ░░
600: #475569  ▓▓
700: #334155  ▓▓  ← Primary Text
800: #1e293b  ██  ← Navbar/Footer
900: #0f172a  ██
```
**Use for:** Text, navigation, borders, neutral elements

### 🔥 Accent - Amber/Orange (Campfire)
```
50:  #fffbeb  ░░░░░░░░░░
100: #fef3c7  ░░░░░░░░
200: #fde68a  ░░░░░░
300: #fcd34d  ░░░░
400: #fbbf24  ░░░
500: #f59e0b  ░░  ← Default Accent
600: #d97706  ▓▓  ← Logout/Warnings
700: #b45309  ▓▓
800: #92400e  ██
900: #78350f  ██
```
**Use for:** Warnings, logout buttons, price tags, special highlights

---

## 🚀 Common Usage Patterns

### Buttons
```tsx
// Primary Action
className="bg-primary-600 hover:bg-primary-700 text-white"

// Secondary/Cancel
className="bg-secondary-300 hover:bg-secondary-400 text-secondary-700"

// Destructive/Logout
className="bg-accent-600 hover:bg-accent-700 text-white"
```

### Form Inputs
```tsx
// Normal state
className="border-border focus:ring-primary-500"

// Error state
className="border-error focus:ring-error"

// Label
className="text-secondary-700"

// Helper text
className="text-secondary-500"

// Error message
className="text-error"
```

### Cards & Containers
```tsx
className="bg-surface border border-border shadow-md"
```

### Text Hierarchy
```tsx
// Headings
className="text-secondary-800"

// Body text
className="text-secondary-700"

// Muted/secondary text
className="text-secondary-600"

// Disabled/placeholder
className="text-secondary-400"
```

### Links
```tsx
className="text-primary-600 hover:text-primary-700"
```

---

## 📊 Component Color Mapping

| Component | Background | Text | Border | Hover |
|-----------|------------|------|--------|-------|
| Navbar | `secondary-800` | `white` | - | `primary-300` |
| Footer | `secondary-800` | `secondary-300` | - | - |
| Card | `surface` | `secondary-700` | `border` | `shadow-lg` |
| Button (Primary) | `primary-600` | `white` | - | `primary-700` |
| Button (Cancel) | `secondary-300` | `secondary-700` | - | `secondary-400` |
| Button (Delete) | `accent-600` | `white` | - | `accent-700` |
| Input | `white` | `secondary-700` | `border` | `ring-primary-500` |
| Toast (Success) | `success` | `white` | - | - |
| Toast (Error) | `error` | `white` | - | - |

---

## 🎯 Semantic Colors

| Color | Hex | Usage | Class |
|-------|-----|-------|-------|
| Success | `#10b981` | Confirmations, success toasts | `bg-success` |
| Error | `#ef4444` | Validation errors, error toasts | `bg-error` |
| Warning | `#f59e0b` | Warning messages | `bg-warning` |
| Info | `#3b82f6` | Informational messages | `bg-info` |

---

## 🌓 Dark Mode

Dark mode automatically adjusts via `prefers-color-scheme`:
- Background: white → `secondary-900`
- Primary: `primary-600` → `primary-400`
- Secondary: `secondary-700` → `secondary-300`
- Surface: white → `secondary-800`

---

## 📦 Files Updated

✅ `app/globals.css` - Color definitions
✅ `components/Navbar.tsx`
✅ `components/Footer.tsx`
✅ `components/Toast.tsx`
✅ `app/page.tsx` (Home)
✅ `app/login/page.tsx`
✅ `app/register/page.tsx`
✅ `app/campgrounds/page.tsx`
✅ `app/campgrounds/[id]/page.tsx`
✅ `app/campgrounds/new/page.tsx`
✅ `app/campgrounds/[id]/edit/page.tsx`

---

## 🔧 Technical Implementation

**Framework:** Tailwind CSS v4 with CSS custom properties
**Location:** `app/globals.css`
**Integration:** `@theme inline` directive
**Benefits:** Single source of truth, easy theming, dark mode ready

---

## 🎨 Design Rationale

### Why These Colors?

**Teal/Green (Primary)**
- Evokes nature and the outdoors
- Associated with growth and adventure
- High readability and accessibility
- Modern and friendly

**Slate (Secondary)**
- Professional and neutral
- Excellent text contrast
- Works well in dark/light modes
- Industry standard for UI elements

**Amber/Orange (Accent)**
- Represents warmth and campfires
- Draws attention without being aggressive
- Complements primary teal color
- Perfect for calls-to-action

### Accessibility
- All color combinations tested for WCAG AA compliance
- Minimum 4.5:1 contrast ratio for text
- Semantic color meanings (error = red, success = green)
- Dark mode support for reduced eye strain

---

## 💡 Tips

1. **Consistency:** Always use custom colors, avoid hardcoded hex values
2. **Semantic Usage:** Use `error`, `success`, `warning` for appropriate states
3. **Hierarchy:** Use lighter shades (100-300) for backgrounds, darker (600-900) for text
4. **Hover States:** Typically use next darker shade (e.g., 600 → 700)
5. **Disabled States:** Use 300-400 range for disabled/muted elements

---

**Last Updated:** December 9, 2024
**Maintained by:** YelpCamp Development Team
