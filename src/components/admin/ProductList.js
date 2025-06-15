import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const ProductList = ({ onEdit }) => {

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sayfaya göre ürünleri filtrele
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Sayfa numarası butonları oluştur
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Sayfa değiştirme fonksiyonu
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Önceki ve Sonraki butonları için
  const goPrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const goNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        list.sort((a, b) => {
          return b.timeStamp.seconds - a.timeStamp.seconds;
        });

        setProducts(list);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsub();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div
        className="rounded-md border"
        style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Image
              </th>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Title
              </th>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Category
              </th>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Price
              </th>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Status
              </th>
              <th
                style={{ color: "#94a3b8" }}
                className="text-start px-6 py-3"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            style={{
              borderTop: "1px solid",
              borderColor: "rgba(229, 231, 235, 0.23)",
            }}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((artwork) => (
                <tr
                  key={artwork.id}
                  style={{
                    borderTop: "1px solid",
                    borderColor: "rgba(229, 231, 235, 0.23)",
                  }}
                >
                  <td className="px-6 py-3">
                    <img
                      src={artwork.img}
                      alt={artwork.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium">{artwork.name}</td>
                  <td className="px-6 py-3">{artwork.category}</td>
                  <td className="px-6 py-3">{artwork.price}</td>
                  <td className="px-6 py-3">
                    {artwork.status === true ? (
                      <span
                        className="rounded-lg bg-red-500/50"
                        style={{ padding: ".125rem .625rem" }}
                      >
                        Sold
                      </span>
                    ) : (
                      <span
                        className="rounded-lg bg-green-500/50"
                        style={{ padding: ".125rem .625rem" }}
                      >
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      className="border gap-2 flex items-center py-1 px-2 rounded-md hover:bg-red-500/25"
                      style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}
                      onClick={() => onEdit(artwork)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-edit"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
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
        <div className="flex justify-center items-center space-x-2" style={{ marginTop: '24px' }}>
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-500/50"
              }`}
          >
            Prev
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1 rounded-full ${currentPage === num
                ? "bg-red-500 text-white"
                : "hover:bg-red-500/50"
                }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
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
