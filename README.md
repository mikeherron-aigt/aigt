# Museum Page Implementation Guide

## Files Created

1. **Footer.tsx** - Reusable footer component
2. **page.tsx** - Complete museum page

## Installation Steps

### 1. Add the Footer Component

Copy `Footer.tsx` to your project:
```
app/components/Footer.tsx
```

### 2. Add the Museum Page

Create a new directory and add the page:
```
app/museum/page.tsx
```

Copy the contents of `page.tsx` to this location.

### 3. Add Images to Public Directory

Move the uploaded images to your `public` folder:
- `museum_hero.jpg` → `/public/museum_hero.jpg`
- `museum_render.jpg` → `/public/museum_render.jpg`
- `museum_artist.jpg` → `/public/museum_artist.jpg`
- `john_working.png` → `/public/john_working.png`
- `john_working2.png` → `/public/john_working2.png`
- `ashley.png` → `/public/ashley.png`
- `museum_mock.png` → `/public/museum_mock.png`

### 4. Update Your Layout (Optional)

If you want to use the Footer component globally, update `app/layout.tsx`:

```tsx
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />  {/* Add this */}
      </body>
    </html>
  );
}
```

Or keep it page-specific as shown in the museum page.

### 5. Update Your Navigation

Add the museum link to your Header component:

In `app/components/Header.tsx`, add a navigation link:
```tsx
<Link href="/museum" className="nav-link">
  Museum
</Link>
```

## Features Included

✅ Full museum page with all content from PDF design
✅ Responsive layout (mobile, tablet, desktop)
✅ Optimized images with Next.js Image component
✅ Proper typography using your existing CSS classes
✅ Reusable Footer component
✅ SEO metadata
✅ Matches your brand styling

## Color Variables Used

The page uses your existing CSS variables:
- `--archive-slate` (#252e3a) - Main text
- `--ledger-stone` (#a1a69d) - Accent text/borders
- `--paper-white` (#f5f5f5) - Background
- `--gallery-plaster` (#dadada) - Borders
- `--deep-patina` (#294344) - Links

## Typography

- Headings: Georgia serif (matching your site)
- Body: Open Sans (your existing font)
- All sizing matches your global CSS

## Testing Checklist

- [ ] Images load correctly
- [ ] Links work (Request Access, footer links)
- [ ] Mobile responsive
- [ ] Footer displays properly
- [ ] Matches brand styling
- [ ] Typography is consistent

## URL Structure

Once deployed, the page will be available at:
```
https://artinvestmentgrouptrust.com/museum
```

## Next Steps

1. Copy files to your project
2. Move images to public folder
3. Test locally: `npm run dev`
4. Commit to GitHub
5. Deploy

No Builder.io involvement = No more sync issues! 🎉
