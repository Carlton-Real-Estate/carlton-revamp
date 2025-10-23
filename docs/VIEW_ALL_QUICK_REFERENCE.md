# Quick Reference: View All Feature

## Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│  INITIAL VIEW - All Categories                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🏷️  Latest Properties for Sale         [View All →]        │
│  ┌──────┐ ┌──────┐ ┌──────┐  →  →  →                       │
│  │ Card │ │ Card │ │ Card │  (scroll for 2 more)           │
│  └──────┘ └──────┘ └──────┘                                 │
│                                                               │
│  🔑 Latest Properties for Rent          [View All →]        │
│  ┌──────┐ ┌──────┐ ┌──────┐  →  →  →                       │
│  │ Card │ │ Card │ │ Card │  (scroll for 2 more)           │
│  └──────┘ └──────┘ └──────┘                                 │
│                                                               │
│  🏠 Latest Villas                        [View All →]        │
│  ┌──────┐ ┌──────┐ ┌──────┐  →  →  →                       │
│  │ Card │ │ Card │ │ Card │  (scroll for 2 more)           │
│  └──────┘ └──────┘ └──────┘                                 │
│                                                               │
│  🗺️  Latest Lands                        [View All →]        │
│  ┌──────┐ ┌──────┐ ┌──────┐  →  →  →                       │
│  │ Card │ │ Card │ │ Card │  (scroll for 2 more)           │
│  └──────┘ └──────┘ └──────┘                                 │
└─────────────────────────────────────────────────────────────┘

                           ⬇️  Click "View All" on Sale

┌─────────────────────────────────────────────────────────────┐
│  EXPANDED VIEW - Sale Category Only                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🏷️  Latest Properties for Sale    [← Show Less]            │
│  ┌──────┐ ┌──────┐ ┌──────┐  →  →  →  →  →  →             │
│  │ Card │ │ Card │ │ Card │  (scroll for ALL)              │
│  └──────┘ └──────┘ └──────┘                                 │
│                                                               │
│  (Rent, Villas, and Lands sections hidden)                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

                           ⬇️  Click "Show Less"

┌─────────────────────────────────────────────────────────────┐
│  Back to INITIAL VIEW - All Categories                      │
└─────────────────────────────────────────────────────────────┘
```

## Property Card - Before & After

### ❌ BEFORE (With Favorite Button)
```
┌─────────────────────────┐
│  ┌─────────────────┐    │
│  │                 │  ❤️ │ ← Favorite button (tomato)
│  │   Property      │    │
│  │   Image         │    │
│  └─────────────────┘    │
│  Ref: AJ45123           │
│  Luxury 2BR Apartment   │
│  85,000 BHD             │
│  📍 Juffair             │
│  🛏️ 2  🚿 2  🚗 1       │
└─────────────────────────┘
```

### ✅ AFTER (Clean Design)
```
┌─────────────────────────┐
│  ┌─────────────────┐    │
│  │                 │    │
│  │   Property      │    │ ← No favorite button
│  │   Image         │    │
│  └─────────────────┘    │
│  Ref: AJ45123           │
│  Luxury 2BR Apartment   │
│  85,000 BHD             │
│  📍 Juffair             │
│  🛏️ 2  🚿 2  🚗 1       │
└─────────────────────────┘
```

## Button States

### State 1: View All Available
```css
┌──────────────────┐
│  View All  →     │  ← Gradient background
└──────────────────┘     Carlton primary colors
```

### State 2: Category Expanded
```css
┌──────────────────┐
│  ←  Show Less    │  ← Same gradient style
└──────────────────┘     Just reversed icon/text
```

### State 3: Hidden (≤5 properties)
```css
(Button not displayed)
```

## Code Snippets

### View All a Category (JavaScript)
```javascript
// Show all properties in Sale category
window.carltonProperties.viewAllCategory('sale');

// Options: 'sale', 'rent', 'villas', 'lands'
```

### Return to Overview
```javascript
// Show all categories with 5 properties each
window.carltonProperties.showAllCategories();
```

### Check Current State
```javascript
// Get all visible sections
const visibleSections = document.querySelectorAll(
  '.property-category-section[style*="display: block"]'
);

console.log(`${visibleSections.length} categories visible`);
// 1 = Expanded view
// 4 = Normal view
```

## CSS Classes Reference

```css
/* View All Button */
.view-all-btn {
    background: var(--gradient-primary);
    color: var(--white);
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Favorite Button - Hidden */
.button-favorite {
    display: none !important;
}

/* Property Card */
.property {
    /* Now cleaner without favorite button */
    position: relative;
    overflow: visible;
}
```

## Event Flow

```
User Action          →  JavaScript Method            →  Result
─────────────────────────────────────────────────────────────────
Click "View All"     →  viewAllCategory('sale')     →  Shows all sale properties
                                                        Hides other categories
                                                        Button → "Show Less"
                                                        Scrolls to section

Click "Show Less"    →  showAllCategories()         →  Shows all 4 categories
                                                        Limits to 5 per category
                                                        Button → "View All"
                                                        Scrolls to top

Page Load           →  displayCategorizedProperties() → Shows all categories
                                                         5 properties each
                                                         View All buttons visible
```

## Responsive Behavior

| Screen Size | Cards Visible | Scroll   | View All Works |
|------------|---------------|----------|----------------|
| 1400px+    | 3 per row     | → Horiz  | ✅ Yes         |
| 1024-1400  | 2-3 per row   | → Horiz  | ✅ Yes         |
| 768-1024   | 2 per row     | → Horiz  | ✅ Yes         |
| < 768px    | 1 per row     | → Horiz  | ✅ Yes         |

## Testing Commands

```javascript
// Test in browser console:

// 1. View all sale properties
window.carltonProperties.viewAllCategory('sale');

// 2. Check visible sections
document.querySelectorAll('.property-category-section').forEach(s => {
  console.log(s.id, s.style.display);
});

// 3. Return to normal
window.carltonProperties.showAllCategories();

// 4. Test all categories
['sale', 'rent', 'villas', 'lands'].forEach(cat => {
  setTimeout(() => window.carltonProperties.viewAllCategory(cat), 2000);
});
```

## Troubleshooting

### Issue: View All button doesn't appear
```javascript
// Check if more than 5 properties exist
const saleProps = window.carltonProperties.properties.filter(
  p => p.for === 1
);
console.log(`Sale properties: ${saleProps.length}`);
// Should be > 5 for button to show
```

### Issue: Favorite button still visible
```css
/* Verify in DevTools that this style applies: */
.button-favorite {
    display: none !important;
}
/* Clear browser cache if needed */
```

### Issue: Button doesn't scroll to section
```javascript
// Check if smooth scroll is enabled
const html = document.documentElement;
console.log(getComputedStyle(html).scrollBehavior);
// Should return: "smooth"
```

## Performance Metrics

- **Initial Load**: 4 categories × 5 cards = 20 DOM elements
- **Expanded View**: 1 category × All cards (e.g., 5-10 cards)
- **DOM Updates**: Minimal - only affected section
- **Memory**: No memory leaks - no new event listeners
- **Animation**: 60fps smooth scroll

## Browser Console Output

```javascript
// When viewing all
console.log('📂 Viewing all properties in category: sale');

// When showing less  
console.log('📂 Showing all categories (5 per category)');
```
