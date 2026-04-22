import React, { useState } from "react";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

const ProductList = ({ products, onEdit, onDelete, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-[#0a0a0a] overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5">
              {["Image", "Title", "Category", "Price", "Status", "Actions"].map((header) => (
                <th
                  key={header}
                  className="text-left px-6 py-4 text-gray-400 font-medium tracking-wide text-sm"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-primary/10">
            {currentItems.length ? (
              currentItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-left">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-12 object-cover rounded-md shadow-sm group-hover:shadow-primary/20 transition-all"
                    />
                  </td>
                  <td className="px-6 py-4 text-left font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{product.collections ? <span>{product.collections}</span> : '--'}</td>
                  <td className="px-6 py-4 text-left text-gray-300">{product.price}</td>
                  <td className="px-6 py-4 text-left">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium border ${
                        product.status 
                        ? "bg-primary/20 border-primary/30 text-white" 
                        : "bg-green-500/10 border-green-500/20 text-green-400"
                      }`}
                    >
                      {product.status ? "Sold" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-start gap-3">
                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-primary/20 hover:bg-primary/10 text-gray-400 hover:text-white transition-all shadow-sm hover:shadow"
                        title={product.status ? "Unmark Sold" : "Mark as Sold"}
                        onClick={() => onToggleStatus(product)}
                      >
                        {product.status ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                      </button>

                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-blue-500/20 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all shadow-sm hover:shadow"
                        title="Edit Product"
                        onClick={() => onEdit(product)}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        className="p-1.5 rounded-md border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all shadow-sm hover:shadow"
                        title="Delete Product"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-muted-foreground"
                >
                  No products found. Add your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed bg-[#0a0a0a] text-gray-500 border border-primary/10"
                : "bg-[#0a0a0a] text-gray-300 border border-primary/20 hover:bg-primary/20 hover:text-white"
            }`}
          >
            Prev
          </button>

          <div className="flex bg-[#0a0a0a] rounded-lg border border-primary/20 p-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:bg-primary/10 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed bg-[#0a0a0a] text-gray-500 border border-primary/10"
                : "bg-[#0a0a0a] text-gray-300 border border-primary/20 hover:bg-primary/20 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
