import React from 'react';

const SearchInput = ({ searchTerm, handleSearch }) => (
    <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
    />
);

export default SearchInput;