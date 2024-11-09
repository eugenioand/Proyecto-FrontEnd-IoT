import React from "react";

interface PaginationProps {
    totalRecords: number;
    recordsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ totalRecords, recordsPerPage, currentPage, onPageChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={handlePreviousPage}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                disabled={currentPage === 1}
            >
                Anterior
            </button>
            <p>
                Página {currentPage} de {totalPages}
            </p>
            <button
                onClick={handleNextPage}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                disabled={currentPage === totalPages}
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;