import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // all, car, bike, ev
    condition: 'all', // all, new, used
  });

  return (
    <SearchContext.Provider value={{ query, setQuery, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};
