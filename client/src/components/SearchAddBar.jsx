import React from 'react'

const SearchAddBar = ({ onAddClick, searchValue, onSearchChange }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <input
                    type="text"
                    placeholder="Search cookies..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-zinc-950 dark:border-gray-700 dark:text-white dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors shadow-lg"
                />
                <button
                    onClick={onAddClick}
                    className="w-full sm:w-auto sm:min-w-[140px] h-10 bg-zinc-950 text-white text-sm font-medium rounded-lg hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus:ring-white transition-colors shadow-lg"
                >
                    Add Cookie
                </button>
            </div>
        </div>
    )
}

export default SearchAddBar