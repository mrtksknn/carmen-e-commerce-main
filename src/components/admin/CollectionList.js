import React, { useEffect, useState } from "react";

const CollectionList = ({ products, allProducts, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionsWithCounts, setCollectionsWithCounts] = useState([]);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(collectionsWithCounts.length / itemsPerPage);
  const currentItems = collectionsWithCounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const enriched = products.map((collection) => {
      const artCount = allProducts.filter(
        (product) =>
          typeof product.collections === 'string' &&
          product.collections === collection.name
      ).length;

      return { ...collection, artCount };
    });

    setCollectionsWithCounts(enriched);
  }, [products, allProducts]);

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
              {["Collection Name", "Description", "Arts", "Actions"].map((header) => (
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
              currentItems.map((collection) => (
                <tr
                  key={collection.id}
                  style={{ borderTop: "1px solid rgba(229, 231, 235, 0.23)" }}
                >
                  <td className="px-6 py-3 font-medium text-left">{collection.name}</td>
                  <td className="px-6 py-3 text-left">{collection.description || '--'}</td>
                  <td className="px-6 py-3 text-left">
                    {collection.artCount ? <span>{collection.artCount}</span> : '0'}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="border px-2 py-1 rounded-md hover:bg-red-500/25 flex items-center gap-1 text-sm"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onEdit(collection)}
                      >
                        Edit
                      </button>
                      <button
                        className="border px-2 py-1 rounded-md hover:bg-red-500/25 text-sm"
                        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                        onClick={() => onDelete(collection.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-muted-foreground">
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
            className={`px-3 py-1 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500/50"}`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-full ${currentPage === page ? "bg-red-500 text-white" : "hover:bg-red-500/50"}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
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

export default CollectionList;
