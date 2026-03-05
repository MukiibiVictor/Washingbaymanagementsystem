# Theme System Guide

## Overview
The ZORI Auto Spa Management System now includes a comprehensive dark/light mode theme system with custom colors.

## Dark Mode Colors
- **Deep Navy**: `#0a1628` - Main background
- **Dark Blue**: `#0d1b2e` - Secondary background
- **Midnight Blue**: `#0f1f3a` - Card backgrounds
- **Dark Gradient**: Mix of navy and blue tones
- **Smoke Grey**: `#374151` - Muted elements

## Light Mode Colors
- Clean white backgrounds
- Slate grey accents
- Blue primary colors

## Usage

### Theme Toggle
A theme toggle button is available in the header that switches between light and dark modes.

### Theme Persistence
The selected theme is saved to localStorage and persists across sessions.

### Using Theme in Components
```tsx
import { useTheme } from '../lib/theme-context';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-[#0f1f3a]">
      Current theme: {theme}
    </div>
  );
}
```

### Dark Mode Classes
Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-[#0a1628] text-slate-900 dark:text-slate-200">
  Content
</div>
```

## Custom Colors Reference

### Backgrounds
- `dark:bg-[#0a1628]` - Deep navy
- `dark:bg-[#0d1b2e]` - Dark blue
- `dark:bg-[#0f1f3a]` - Midnight blue

### Borders
- `dark:border-[#1e3a5f]` - Subtle blue border

### Text
- `dark:text-slate-200` - Primary text
- `dark:text-slate-400` - Secondary text
- `dark:text-slate-500` - Muted text

### Gradients
```tsx
className="dark:bg-gradient-to-br dark:from-[#0a1628] dark:via-[#0d1b2e] dark:to-[#0f1f3a]"
```

## Components with Dark Mode Support
- ✅ Layout (Header, Sidebar, Background)
- ✅ LoginPage
- ✅ ThemeToggle button
- ✅ All UI components (via theme.css)

## Customization
Edit `src/styles/theme.css` to modify theme colors:

```css
.dark {
  --background: #0a1628;
  --card: #0f1f3a;
  /* ... more variables */
}
```

## Testing
1. Click the theme toggle button in the header
2. Theme should switch immediately
3. Refresh the page - theme should persist
4. Check all pages for proper dark mode styling
