# WarNight.net Minimalist Store

## Overview
WarNight.net is a minimal production-ready store for digital goods and donations, built with static HTML and minimal CSS/JS while protected by Cloudflare (including Workers, API Shield, and bot/rate rules). The design philosophy favors a dark, fast, and predictable experience with no frameworks or build tooling.

## Domains
- **warnight.net** — primary site and store
- **boomiings.com** — legacy domain used for some migrations

## Frontend
- Pure HTML with shared minimal stylesheet (`_s.css`).
- Shared header (`_h.js`) and footer (`_f.js`) components.
- Pretty URLs handled by Cloudflare (no `.html` suffixes).

### Key Pages
- `/donate`: Donation form for the `mc.WarNight.net` Minecraft server with nickname + privilege selection (VIP, Lord, Lord+, Владелец, WarNight). Includes an "Дополнительные товары" block with product cards linking to item pages.
- `/shop/6` and `/shop/7`: Digital key purchase pages with quantity and email collection (non-empty only) sent to the API.
- `/demonlist`: Geometry Dash demon list table, aligned to the shared site styling with common header/footer.

## Backend (Cloudflare Worker)
- Minimal Worker exposing `/api/np` to create invoices.
- Worker performs minimal logic: parse JSON, create invoice, return payment URL; validation happens upstream.

## Security (Cloudflare-first)
- **API Shield schema validation** enforces required fields (`amount` number with `multipleOf`, `desc` string with length limits), blocking empty bodies, oversized requests, and extraneous fields before reaching the Worker.
- **Origin/header rules** allow API requests only from the expected origin; Postman/curl-style requests are blocked.
- **Rate limiting** to mitigate spam/brute-force.
- **Bot/API abuse rules** distinguish verified bots from unknown automation, preserving indexing while filtering noise.
- Principle: *"Worker is business logic, not a firewall; garbage is filtered before it."*

## Goals
1. Functional production store with minimal code and minimal bugs.
2. Maximal protection without complicating the Worker.
3. Easy scalability for new products and future payment providers.
4. Full control without external CMS/SaaS dependencies.

## Design Principles
- Minimalism and dark theme.
- No gratuitous animations; fast load and clear readability.
- Predictable behavior and simple code paths.
