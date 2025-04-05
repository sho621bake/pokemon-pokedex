import React from 'react';
import { Button } from './ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 表示するページ番号の計算
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='mt-10 flex flex-col items-center space-y-4'>
      <div className='text-sm text-gray-500 dark:text-gray-400'>
        {totalPages} ページ中 {currentPage} ページ目を表示
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='hidden sm:flex items-center gap-1 border-gray-200 dark:border-gray-700'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
            />
          </svg>
          <span>最初</span>
        </Button>

        <Button
          variant='outline'
          onClick={handlePrev}
          disabled={currentPage === 1}
          className='border-gray-200 dark:border-gray-700'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </Button>

        <div className='flex items-center overflow-x-auto space-x-1 px-1'>
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => onPageChange(page)}
              className={`
                transition-all min-w-[40px]
                ${
                  currentPage === page
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'border-gray-200 dark:border-gray-700'
                }
                ${Math.abs(currentPage - page) > 2 ? 'hidden sm:flex' : ''}
              `}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant='outline'
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className='border-gray-200 dark:border-gray-700'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Button>

        <Button
          variant='outline'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='hidden sm:flex items-center gap-1 border-gray-200 dark:border-gray-700'
        >
          <span>最後</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 5l7 7-7 7M5 5l7 7-7 7'
            />
          </svg>
        </Button>
      </div>

      <div className='flex items-center space-x-2 sm:hidden'>
        <Button
          variant='outline'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='text-xs py-1 h-8 border-gray-200 dark:border-gray-700'
        >
          最初
        </Button>

        <Button
          variant='outline'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='text-xs py-1 h-8 border-gray-200 dark:border-gray-700'
        >
          最後
        </Button>
      </div>
    </div>
  );
}
