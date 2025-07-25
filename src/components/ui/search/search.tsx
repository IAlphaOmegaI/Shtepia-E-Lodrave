import React, { useState } from 'react';
import { SearchIcon } from '@/components/icons/search';
import { CloseIcon } from '@/components/icons/close';
import cn from 'classnames';
import { useRouter } from 'next/navigation';

interface SearchProps {
  className?: string;
  label?: string;
  variant?: 'minimal' | 'flat' | 'normal';
  placeholder?: string;
  inputClassName?: string;
}

const Search: React.FC<SearchProps> = ({
  className = 'md:w-[730px]',
  label,
  variant = 'normal',
  placeholder = 'Search...',
  inputClassName,
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn('relative flex w-full', className)}
    >
      <label htmlFor={label} className="sr-only">
        {label}
      </label>
      <div className={cn('relative flex w-full items-center')}>
        <input
          id={label}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-11 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-accent focus:outline-none',
            {
              'border-gray-200 bg-gray-50': variant === 'minimal',
              'border-0 bg-gray-100': variant === 'flat',
            },
            inputClassName
          )}
        />
        <button
          type="submit"
          className="absolute left-0 flex h-full w-10 items-center justify-center text-gray-600"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </button>
        {searchText && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-0 flex h-full w-10 items-center justify-center text-gray-600 hover:text-gray-900"
          >
            <CloseIcon className="h-[14px] w-[14px]" />
          </button>
        )}
      </div>
    </form>
  );
};

export default Search;