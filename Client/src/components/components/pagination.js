// Pagination.js
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";



const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  getPageRange,
}) => {
  
  
    const renderEllipsis = () => {
        return <span className="font-bold py-2 px-4">...</span>;
      };
  
    // Hiển thị nút previous
  const renderPreviousButton = () => {
    if (currentPage > 1) {
      return (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      );
    }
    return null;
  };

  // Hiển thị nút next
  const renderNextButton = () => {
    if (currentPage < totalPages) {
      return (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      );
    }
    return null;
  };

  // Hiển thị nút phân trang
 // Hiển thị nút phân trang
const renderPagination = () => {
    const paginationButtons = [];
    const pageRange = getPageRange();
    for (let i = 0; i < pageRange.length; i++) {
      paginationButtons.push(
        <button
          key={pageRange[i]}
          onClick={() => handlePageChange(pageRange[i])}
          className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 mx-1 px-2 border border-gray-400 rounded-3xl ${
            currentPage === pageRange[i] ? 'bg-[#f2c28e]' : ''
          }`}
        >
          {pageRange[i]}
        </button>
      );
    }
  
    // Kiểm tra nếu còn trang tiếp theo sau trang 5
    if (totalPages > pageRange[pageRange.length - 1]) {
      paginationButtons.push(renderEllipsis());
    }
  
    return paginationButtons;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      {/* Hiển thị nút previous */}
      {renderPreviousButton()}
      {/* Render nút phân trang */}
      {renderPagination()}
      {/* Hiển thị nút next */}
      {renderNextButton()}
    </div>
  );
};

export default Pagination;
