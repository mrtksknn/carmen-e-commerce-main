import { ARTWORK_ROUTE, buildSlugMap, slugify } from './seo-data.mjs';

// The readable address of every work is derived from the full catalogue (so
// two works with the same name still get distinct addresses). Whatever loads
// the catalogue registers it here; links read from it.
let slugMap = new Map();

export const registerProducts = (products) => {
  slugMap = buildSlugMap(products || []);
};

export const artworkSlug = (product) => slugMap.get(product?.id) || slugify(product?.name);

export const artworkPath = (product) => `${ARTWORK_ROUTE}/${artworkSlug(product)}`;

/** The work at a readable address; also accepts an old Firestore id. */
export const findArtwork = (products, slugOrId) => {
  if (!slugOrId || !products?.length) return null;
  const map = buildSlugMap(products);
  return products.find((p) => map.get(p.id) === slugOrId)
    || products.find((p) => p.id === slugOrId)
    || null;
};
