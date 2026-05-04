# Lilu & Chef — קייטרינג בוטיק

Modern, mobile-first, Hebrew/RTL site for **Lilu & Chef** boutique catering in Kfar Saba.

## Stack
Plain HTML / CSS / vanilla JS — no build step. Drop the folder on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, Hostinger…).

## Local preview
Open `index.html` directly, or run a tiny dev server:

```bash
# Python 3
python -m http.server 8080
# Node
npx serve .
```

## What's inside
- Hero with parallax 3D floating elements + animated gradient mesh
- Sticky header that blurs on scroll
- Sections: Story · Services · Menu (tabbed) · Process · Gallery · Testimonials · FAQ · Contact
- Floating WhatsApp button + cookie note + sticky social links in footer
- Reveal-on-scroll, mouse-tilt 3D cards, ticker, scroll cue
- SEO: meta + Open Graph + JSON-LD `FoodEstablishment` + sitemap + robots
- Accessibility: skip link, focus-visible styles, ARIA labels, prefers-reduced-motion respected, semantic HTML

## Customization
Replace placeholder gallery gradients with real photos in `index.html` and add `<img>`s.
Brand colors live in `assets/css/styles.css` under `:root` tokens.
Phone, address, and links are in the JSON-LD block (top of `index.html`) and the contact section.

## Contact
**☎ 054-484-6106** · כפר סבא
