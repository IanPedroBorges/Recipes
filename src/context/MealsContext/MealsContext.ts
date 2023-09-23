import { createContext } from 'react';
import { Meals } from '../../types/typesApi';

type MealsType = {
  meals: Meals[],
  setMeals: React.Dispatch<React.SetStateAction<Meals[]>>,
};

export const MealsContext = createContext({} as MealsType);
