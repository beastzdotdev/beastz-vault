export const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const renderPages = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md mx-1 ${
            currentPage === i ? 'bg-gray-300' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md mx-1 bg-gray-200"
        >
          Previous
        </button>
      )}
      {renderPages()}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md mx-1 bg-gray-200"
        >
          Next
        </button>
      )}
    </div>
  );
};
