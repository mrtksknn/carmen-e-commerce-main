import { normalizeSiteUrl } from "./seo-data.mjs";

export const APP_CONFIG = {
  NAME: "Piece Of Oblivion",
  // Public address of the site. Set VITE_SITE_URL in .env when the domain changes.
  BASE_URL: normalizeSiteUrl(import.meta.env.VITE_SITE_URL),
  LOGO_URL: "/logo.svg",
  DESCRIPTION: "Original hand-made paintings and drawings by Beliz Keskin. One of a kind, certified, shipped worldwide.",
  KEYWORDS: "Beliz Keskin, Piece Of Oblivion, özgün tablo, el yapımı tablo, çizim, sanat eseri satın al, original painting, original drawing, buy art online"
};

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  COLLECTIONS: "/collections",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRODUCT_DETAILS: "/eser/:slug",
  ADMIN: "/admin"
};

export const IMAGES = {
  ARTIST_AT_WORK: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=800&fit=crop&fm=webp"
};
