import React, { useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { IconButton, Pagination, useAdminT } from "./AdminUI";

const ITEMS_PER_PAGE = 8;

const CollectionList = ({ products, allProducts, onEdit, onDelete }) => {
  const at = useAdminT();
  const [currentPage, setCurrentPage] = useState(1);

  const collectionsWithCounts = useMemo(() => products.map((collection) => ({
    ...collection,
    artCount: allProducts.filter(
      (product) => typeof product.collections === 'string' && product.collections === collection.name
    ).length,
    cover: allProducts.find((p) => p.collections === collection.name)?.img,
  })), [products, allProducts]);

  const totalPages = Math.ceil(collectionsWithCounts.length / ITEMS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const currentItems = collectionsWithCounts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (!collectionsWithCounts.length) {
    return <p className="py-16 text-center text-sm text-white/50">{at('collectionsEmpty')}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[620px] text-left">
          <thead>
            <tr className="border-b border-white/10">
              {[at('colName'), at('colDesc'), at('colCount')].map((h) => (
                <th key={h} scope="col" className="px-4 pb-3 text-[12px] font-medium text-white/45">{h}</th>
              ))}
              <th scope="col" className="px-4 pb-3 text-[12px] font-medium text-white/45 text-right">{at('colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {currentItems.map((collection) => (
              <tr key={collection.id} className="hover:bg-white/[0.025] transition-colors duration-150">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 shrink-0 rounded-[3px] overflow-hidden bg-white/[0.04] ring-1 ring-white/10">
                      {collection.cover && <img src={collection.cover} alt="" className="w-full h-full object-cover" />}
                    </span>
                    <span className="font-serif text-lg text-white">{collection.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white/60 max-w-md">
                  <span className="line-clamp-2">{collection.description || '—'}</span>
                </td>
                <td className="px-4 py-3 text-sm text-white/80 tabular-nums">{at('worksCount', { n: collection.artCount })}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <IconButton label={at('edit')} onClick={() => onEdit(collection)}>
                      <Edit2 size={16} strokeWidth={1.6} />
                    </IconButton>
                    <IconButton label={at('delete')} tone="danger" onClick={() => onDelete(collection.id)}>
                      <Trash2 size={16} strokeWidth={1.6} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={totalPages} onChange={setCurrentPage} />
    </>
  );
};

export default CollectionList;
