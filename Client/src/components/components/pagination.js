import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange, getPageRange }) => {
  // Tự tính page range nếu không truyền từ ngoài
  const calculatePageRange = () => {
    if (getPageRange) return getPageRange();

    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Điều chỉnh khi ở gần đầu hoặc cuối
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }

      // Thêm ... trước nếu cần
      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) pages.push(i);

      // Thêm ... sau nếu cần
      if (end < totalPages - 1) pages.push("...");

      // Luôn hiển thị trang cuối
      pages.push(totalPages);
    }

    return pages;
  };

  const pageRange = calculatePageRange();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4 select-none">
      {/* Trang đầu */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          }`}
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      {/* Trang trước */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          }`}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      {/* Các trang */}
      {pageRange.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${currentPage === page
                ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-500"
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Trang sau */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          }`}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      {/* Trang cuối */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          }`}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
};

export default Pagination;
