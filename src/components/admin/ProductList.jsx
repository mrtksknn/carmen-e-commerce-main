import React, { useState } from "react";
import { Edit2, Trash2, FileBadge, CircleCheck, CircleDot } from "lucide-react";
import CertificateDialog from "./CertificateDialog";
import { IconButton, Pagination, StatusBadge, useAdminT } from "./AdminUI";
import { artImage } from '../../lib/artImage';

const ITEMS_PER_PAGE = 8;

const ProductList = ({ products, onEdit, onDelete, onToggleStatus }) => {
  const at = useAdminT();
  const [currentPage, setCurrentPage] = useState(1);
  const [certFor, setCertFor] = useState(null);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const currentItems = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (!products.length) {
    return <p className="py-16 text-center text-sm text-white/50">{at('worksEmpty')}</p>;
  }

  const actions = (product, isSold) => (
    <>
      <IconButton label={at('makeCertificate')} tone="accent" onClick={() => setCertFor(product)}>
        <FileBadge size={17} strokeWidth={1.6} />
      </IconButton>
      <IconButton label={isSold ? at('markAvailable') : at('markSold')} onClick={() => onToggleStatus(product)}>
        {isSold ? <CircleDot size={17} strokeWidth={1.6} /> : <CircleCheck size={17} strokeWidth={1.6} />}
      </IconButton>
      <IconButton label={at('edit')} onClick={() => onEdit(product)}>
        <Edit2 size={16} strokeWidth={1.6} />
      </IconButton>
      <IconButton label={at('delete')} tone="danger" onClick={() => onDelete(product.id)}>
        <Trash2 size={16} strokeWidth={1.6} />
      </IconButton>
    </>
  );

  return (
    <>
      {/* Phones: one row per work, actions underneath */}
      <ul className="md:hidden divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {currentItems.map((product) => {
          const isSold = product.status === true;
          return (
            <li key={product.id} className="py-4">
              <div className="flex items-start gap-4">
                <img {...artImage(product.img, { sizes: '64px', maxWidth: 480 })} alt="" className="w-14 h-16 shrink-0 object-cover rounded-[3px] ring-1 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg text-white leading-tight truncate">{product.name}</p>
                  {product.material && <p className="text-[12px] text-white/45 truncate">{product.material}</p>}
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <StatusBadge tone={isSold ? 'sold' : 'available'}>{isSold ? at('sold') : at('available')}</StatusBadge>
                    {product.collections && <span className="text-[12px] text-white/55 truncate">{product.collections}</span>}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-1">{actions(product, isSold)}</div>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-white/10">
              {[at('colImage'), at('colTitle'), at('colCollection'), at('colStatus')].map((h) => (
                <th key={h} scope="col" className="px-4 pb-3 text-[12px] font-medium text-white/45">{h}</th>
              ))}
              <th scope="col" className="px-4 pb-3 text-[12px] font-medium text-white/45 text-right">{at('colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {currentItems.map((product) => {
              const isSold = product.status === true;
              return (
                <tr key={product.id} className="group hover:bg-white/[0.025] transition-colors duration-150">
                  <td className="px-4 py-3">
                    <img {...artImage(product.img, { sizes: '64px', maxWidth: 480 })} alt="" className="w-12 h-14 object-cover rounded-[3px] ring-1 ring-white/10" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-serif text-lg text-white">{product.name}</span>
                    {product.material && <span className="block text-[12px] text-white/40">{product.material}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-white/65">{product.collections || '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={isSold ? 'sold' : 'available'}>{isSold ? at('sold') : at('available')}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5">{actions(product, isSold)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={totalPages} onChange={setCurrentPage} />

      <CertificateDialog
        open={!!certFor}
        onOpenChange={(open) => !open && setCertFor(null)}
        artwork={certFor}
        source={certFor ? { productId: certFor.id } : {}}
      />
    </>
  );
};

export default ProductList;
