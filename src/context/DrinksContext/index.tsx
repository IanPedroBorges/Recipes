import { useState } from 'react';
import { DrinksContext } from './DrinksContext';
import { Drinks } from '../../types/typesApi';

export function DrinksProvider({ children }: { children: React.ReactNode }) {
  const [drinks, setDrinks] = useState<Drinks[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const shared = {
    drinks,
    setDrinks,
    inputValue,
    setInputValue,
    searchFilter,
    setSearchFilter,
  };

  return (
    <DrinksContext.Provider value={ shared }>
      { children }
    </DrinksContext.Provider>
  );
}
