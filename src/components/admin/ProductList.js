import React, { useState } from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goPrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goNext = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="space-y-4">
      <div className="rounded-md border" style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
        <table className="w-full">
          <thead>
            <tr>
              {["Image", "Title", "Category", "Price", "Status", "Actions"].map((th) => (
                <th key={th} className="text-start px-6 py-3" style={{ color: "#94a3b8" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ borderTop: "1px solid", borderColor: "rgba(229, 231, 235, 0.23)" }}>
            {currentProducts.length > 0 ? (
              currentProducts.map((artwork) => (
                <tr key={artwork.id} style={{ borderTop: "1px solid", borderColor: "rgba(229, 231, 235, 0.23)" }}>
                  <td className="px-6 py-3">
                    <img src={artwork.img} alt={artwork.name} className="w-16 h-12 object-cover rounded" />
                  </td>
                  <td className="px-6 py-3 font-medium">{artwork.name}</td>
                  <td className="px-6 py-3">{artwork.category}</td>
                  <td className="px-6 py-3">{artwork.price}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-lg ${artwork.status ? "bg-red-500/50" : "bg-green-500/50"}`} style={{ padding: ".125rem .625rem" }}>
                      {artwork.status ? "Sold" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="border flex items-center gap-2 py-1 px-2 rounded-md hover:bg-red-500/25"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onEdit(artwork)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                        </svg>
                        Edit
                      </button>

                      <button
                        className="border flex items-center gap-2 py-1 px-2 rounded-md hover:bg-red-500/25"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onDelete(artwork.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-muted-foreground">
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
            onClick={goPrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500/50"}`}
          >
            Prev
          </button>
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1 rounded-full ${currentPage === num ? "bg-red-500 text-white" : "hover:bg-red-500/50"}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500/50"}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
