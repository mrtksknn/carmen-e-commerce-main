import React, { useState } from "react";

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
      <div className="rounded-md border" style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
        <table className="w-full">
          <thead>
            <tr>
              {["Image", "Title", "Category", "Price", "Status", "Actions"].map((header) => (
                <th
                  key={header}
                  className="text-left px-6 py-3 text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody style={{ borderTop: "1px solid rgba(229, 231, 235, 0.23)" }}>
            {currentItems.length ? (
              currentItems.map((product) => (
                <tr
                  key={product.id}
                  style={{ borderTop: "1px solid rgba(229, 231, 235, 0.23)" }}
                >
                  <td className="px-6 py-3">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium">{product.name}</td>
                  <td className="px-6 py-3">{product.category}</td>
                  <td className="px-6 py-3">{product.price}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-lg px-3 py-0.5 text-sm ${
                        product.status ? "bg-red-500/50" : "bg-green-500/50"
                      }`}
                    >
                      {product.status ? "Sold" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="border px-2 py-1 rounded-md hover:bg-red-500/25 text-sm"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onToggleStatus(product)}
                      >
                        {product.status ? "Unmark Sold" : "Mark as Sold"}
                      </button>

                      <button
                        className="border px-2 py-1 rounded-md hover:bg-red-500/25 flex items-center gap-1 text-sm"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onEdit(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Edit
                      </button>

                      <button
                        className="border px-2 py-1 rounded-md hover:bg-red-500/25 text-sm"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onDelete(product.id)}
                      >
                        Delete
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
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-500/50"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-full ${
                currentPage === page
                  ? "bg-red-500 text-white"
                  : "hover:bg-red-500/50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-500/50"
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
