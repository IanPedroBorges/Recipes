import drinksByIngredient from './mockDrinksByIngredient';
import drinkCategories from './mockDrinkCategories';
import mealCategories from './mockMealCategories';
import mealsByIngredient from './mockMealsByIngredient';
import oneMeal from './mockOneMeal';
import oneDrink from './mockOneDrink';
import drinks from './mockDrinks';
import meals from './mockMeals';

const mockFetch = (url: string) => Promise.resolve({
  status: 200,
  ok: true,
  json: () => {
    if (url === 'https://www.themealdb.com/api/json/v1/1/list.php?c=list') { return Promise.resolve(mealCategories); }

    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list') { return Promise.resolve(drinkCategories); }

    if (url === 'https://www.themealdb.com/api/json/v1/1/filter.php?i=Chicken') { return Promise.resolve(mealsByIngredient); }

    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Light rum') { return Promise.resolve(drinksByIngredient); }

    if (
      url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata'
      || url === 'https://www.themealdb.com/api/json/v1/1/random.php'
      || url === 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771'
      || url === 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52977'
    ) { return Promise.resolve(oneMeal); }

    if (
      url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Aquamarine'
      || url === 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
      || url === 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=178319'
    ) { return Promise.resolve(oneDrink); }
    if (url === 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=') { return Promise.resolve(drinks); }

    if (url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=') { return Promise.resolve(meals); }

    return Promise.reject(new Error('Invalid url'));
  },
});

export default mockFetch;
