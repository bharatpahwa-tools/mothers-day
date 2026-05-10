# Letter to Mom — Mother's Day Card App

## Original Problem Statement
Build a Mother's Day web app where users upload an image and share a customized card with their mother. Each card gets its own unique URL (like /card/:slug) so the user can share a private custom site with their mom. Stunning, anonymous, easy to share.

## Architecture
- **Backend**: FastAPI + Motor (MongoDB async), Cloudinary signed uploads, Emergent LLM Key (GPT-5.2)
- **Frontend**: React 19 + React Router 7 + TailwindCSS + Shadcn UI + Framer Motion + canvas-confetti
- **Storage**: MongoDB collection `cards` (id, slug, sender_name, recipient_name, message, image_url, image_public_id, bg_color, bg_gradient, font_family, text_color, frame, stickers[], music_track, created_at)
- **Theme**: Light, Organic-Earthy editorial. Warm Pearl (#FDFBF7), Deep Pine (#2C362B), Terracotta (#E07A5F). Cormorant Garamond + Outfit fonts.

## User Personas
- Adult children wanting to surprise their mom on Mother's Day with something more personal than a generic e-card.
- Anonymous, no login — must be ultra fast to make and share.

## Core Requirements (static)
1. Anonymous card creation — no auth.
2. Photo upload to Cloudinary via signed-upload flow.
3. Full editor: photo, message, AI suggestions, stickers (drag/resize/color), frames, bg color/gradient, font, text color, music selection.
4. Each card gets a `/card/:slug` URL.
5. Shared page must feel cinematic: scale-up reveal, confetti burst, falling petals, optional background music.
6. Mobile responsive; respect `prefers-reduced-motion`.

## What's Implemented (2026-02 / Mother's Day cycle)
- ✅ Backend endpoints: `/api/cloudinary/signature`, `POST /api/cards`, `GET /api/cards/:slug`, `POST /api/ai/suggest-message`
- ✅ AI message suggestions via GPT-5.2 (Emergent Universal Key) with tone selector (heartfelt, poetic, funny, grateful, simple)
- ✅ Editor with 6 tabs: Message+AI / Photo / Stickers / Style (bg, gradients, font, text color) / Frame / Music
- ✅ Drag-to-position stickers, size + rotation + color controls; 12 sticker icons via lucide-react
- ✅ 5 frame styles (none, soft, double, ornate, deckle)
- ✅ 5 fonts (Cormorant, Dancing Script, Caveat, Playfair, Outfit)
- ✅ 4 royalty-free music tracks (Pixabay CDN) + None option
- ✅ Landing page with editorial hero, asymmetric grid, animated floral accent
- ✅ Shared `/card/:slug` page: scale-up reveal, dual confetti bursts, falling petals, audio toggle, native share/copy link
- ✅ 404 / not-found state for invalid slugs
- ✅ data-testid on all interactive elements
- ✅ End-to-end testing: backend 100%, frontend 100%

## P0 Backlog (next)
- Card preview thumbnail / OG meta tags so shared links look great on iMessage/WhatsApp.
- "Download as image" button on shared page (html-to-image already installed).

## P1 Backlog
- More sticker packs (animated GIF stickers).
- Multi-photo / collage layouts.
- Recipient guestbook (mom can leave a reply).
- Voice note attachment.

## P2 Backlog
- Card expiry / privacy controls.
- Light analytics ("Mom opened your card").
- Theme presets (Vintage, Watercolor, Minimal Modern).
