import { Drinks, Meals } from '../types/typesApi';

export const ingredientsDetails = (drink: Drinks | Meals) => {
  const ingredientsAndNumbers = Object.entries(drink).reduce(
    (acc: string[], curr: string[]) => {
      if (
        curr[0].includes('strIngredient')
                && curr[1] !== null
                && curr[1] !== ''
      ) {
        acc.push(`${curr[0].substring(curr[0].length - 1)} ${curr[1]}`);
      }
      return acc;
    },
    [],
  );
  return ingredientsAndNumbers;
};

export const measuresDetails = (drink: Drinks | Meals) => {
  const measures = Object.entries(drink).reduce(
    (acc: string[], curr: string[]) => {
      if (curr[0].includes('strMeasure') && curr[1] !== null) {
        acc.push(curr[1]);
      }
      return acc;
    },
    [],
  );
  return measures;
};
