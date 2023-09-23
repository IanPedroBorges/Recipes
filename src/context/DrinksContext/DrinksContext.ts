import { createContext } from 'react';
import { Drinks } from '../../types/typesApi';

type DrinksType = {
  drinks: Drinks[],
  setDrinks: React.Dispatch<React.SetStateAction<Drinks[]>>,
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  searchFilter: string,
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>,
};

export const DrinksContext = createContext({} as DrinksType);
