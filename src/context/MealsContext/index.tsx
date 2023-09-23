import { useState } from 'react';
import { MealsContext } from './MealsContext';
import { Meals } from '../../types/typesApi';

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meals[]>([]);

  const shared = {
    meals,
    setMeals,
  };

  return (
    <MealsContext.Provider value={ shared }>
      { children }
    </MealsContext.Provider>
  );
}
